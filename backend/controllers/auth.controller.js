import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/verifyUser.js";


export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  console.log("Signup body:", req.body);
 if (!username || !email || !password || username === "" || email === "" || password === "") {
  console.log("Missing fields in signup");
    return next(errorHandler(400, "All fields are required"));
  }

     const existingUser = await User.findOne({
  $or: [{ username }, { email }]
});

if (existingUser) {
  return next(errorHandler(400, "Username or email already exists!"));
}

  try {
    const hashedPassword = bcryptjs.hashSync(password, 10);
    console.log("Hashed password:", hashedPassword);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
     
   await newUser.save();

    
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

   
    const { password: pass, ...rest } = newUser._doc;

    res
      .status(201)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        success: true,
        message: "Signup successful",
        user: rest,
      });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  console.log("Signin request body:", req.body);

  const { email, password: userPassword } = req.body; // 👈 rename 'password' here

  if (!email || !userPassword) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });
    console.log("Found user:", user);

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    // ✅ Compare password correctly
    const validPassword = bcryptjs.compareSync(userPassword, user.password);
    if (!validPassword)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET || "temp_secret",
      { expiresIn: "7d" }
    );

    // ✅ Remove password from response
    const { password, ...rest } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      })
      .status(200)
      .json({ success: true, message: "Signin successful", user: rest, token });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};
export const google = async (req, res, next) => {
  const { email, name, profilePicture } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
      const { password, ...rest } = user._doc;

      return res
        .status(200)
        .cookie("access_token", token, { httpOnly: true })
        .json({ success: true, user: rest });
    }

    
    const generatedPassword =
      Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

    const newUser = new User({
      username:
        name.split(" ").join("").toLowerCase() +
        Math.random().toString(9).slice(-4),
      email,
      password: hashedPassword,
      profilePicture,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
    const { password, ...rest } = newUser._doc;

    return res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json({ success: true, user: rest });
  } catch (error) {
    next(error);
  }
};
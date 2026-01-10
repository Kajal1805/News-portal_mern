import bcrypt from "bcryptjs"
import { errorHandler } from '../utils/error.js'
import user from "../models/user.model.js"
import User from "../models/user.model.js"

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You can update only your account"));
  }

  // password validation
  if (req.body.password) {
    if (req.body.password.length < 8) {
      return next(errorHandler(400, "Password must be at least 8 characters"));
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }

  // username validation
  if (req.body.username) {
    if (req.body.username.length < 3 || req.body.username.length > 20) {
      return next(errorHandler(400, "Username must be between 3 and 20 characters"));
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (!/^[a-zA-Z0-9]+$/.test(req.body.username)) {
      return next(errorHandler(400, "Username can only contain alphanumeric characters"));
    }
  }

  try {
    // yeh object FE se aaya fields store karega
    const updateFields = {};

    if (req.body.username) updateFields.username = req.body.username;
    if (req.body.email) updateFields.email = req.body.email;
    if (req.body.profilePicture) updateFields.profilePicture = req.body.profilePicture;
    if (req.body.password) updateFields.password = req.body.password;

    // UPDATED USER
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updateFields },    
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,        
    });

  } catch (error) {
    next(error);
  }
};

export const deleteUser = async(req, res, next) => {
    if(req.user.id !== req.params.userId && !req.user.isAdmin) {
        return next(errorHandler(403, "You can only delete your own account"))
    }

    try {
        await User.findByIdAndDelete(req.params.userId)

        res.status(200).json("User has been deleted")
    } catch (error) {
        next(error)
    }
}

export const signout = async(req, res, next) => {
    try {
        res.clearCookie("access_token").status(200).json("User signed out successfully")
    } catch(error) {
        next(error)
    }
}

export const getUsers = async(req, res, next) => {
    if(!req.user.isAdmin) {
        return next(errorHandler(403, "You are not authorized to access these resources!"))
    }

    try {
      const startIndex = parseInt(req.query.startIndex) || 0
      const limit = parseInt(req.query.limit) || 9
      const sortDirection = req.query.sort === "asc"? 1 : -1

      const users = await user.find(). sort({createdAt: sortDirection}).skip(startIndex).limit(limit)

      const getUsersWithoutPassword = users.map((user) => {
        const {password:pass, ...rest} = user._doc
      
        return rest;
    })

    const totalUsers = await User.countDocuments()

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthUsers = await User.countDocuments({
        createdAt: {$gte: oneMonthAgo },
    })

    res.status(200).json({
        users: getUsersWithoutPassword,
        totalUsers,
        lastMonthUsers,
    })
    } catch (error) {
        next(error)
    }
}


export const getUserById = async (req, res, next) => {
  try {
   const user = await User.findById(req.params.userId)

   if(!user) {
    return next(errorHandler(404, "User Not Found"))
   }

   const {password, ...rest} = user._doc

   res.status(200).json(rest)
  }
  catch (error) {
    next(error)
  }
}



   



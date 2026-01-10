import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";


dotenv.config();

const app = express();  

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}

));        
app.use(express.json());
app.use(cookieParser())

// ✅ Routes
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);



// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));


  app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  })
  
})

// ✅ Start server
app.listen(5000, () => {
  console.log("Server is running on port 5000 and connected to MongoDB");
  console.log("MongoDB URI:", process.env.MONGO_URI);
});

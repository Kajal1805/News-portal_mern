import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";


export const create = async (req, res) => {


  if (!req.body.title || !req.body.content || !req.body.category || !req.body.image) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      image: req.body.image,
      slug,
      userId: req.user.id,  // 🔥 FIXED
    });

    const savedPost = await newPost.save();
    console.log("📌 POST SAVED:", savedPost);

    res.status(201).json({ success: true, message: "Post created successfully", post: savedPost });

  } catch (error) {
    console.log("❌ DB ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET POSTS
export const getPosts = async (req, res, next) => {
  try {
    const startingIndex = parseInt(req.query.startingIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    // 🧠 FIXED QUERY FILTERS
    const filters = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    };

    console.log("Filters applied: ", filters);

    const posts = await Post.find(filters)
      .sort({ updatedAt: sortDirection })
      .skip(startingIndex)
      .limit(limit);

      console.log("Fetched posts:", posts);

    const totalPost = await Post.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      success: true,
      posts,
      totalPost,
      lastMonthPosts,
    });
  } catch (error) {
    console.error("Get posts error:", error);
    next(error);
  }
};

export const deletepost = async (req,res) => {
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.json({success: true, message: "Post deleted successfully" });
  }
  catch (error) {
    res.status(500).json({ success: false, message: "Error deleting post" });
  }
};

export const updatepost = async (req, res, next) => {
  try {
    const updatedpost = await Post.findByIdAndUpdate(
      req.params.postId, {
        $set: {
        title: req.body.title,
        content: req.body.content,
        category: req.body.category,
        image: req.body.image,
        },
      },
      {new: true }
     
    );
    res.status(200).json(updatedpost);
  }
  catch (error) {
    res.status(500).json({ message: "Error updating false" });
  }
};
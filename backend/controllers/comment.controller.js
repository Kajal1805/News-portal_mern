import Comment from "../models/Comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId } = req.body;

    if (!content || !postId) {
      return next(errorHandler(403, "All fields are required"));
    }

    const userId = req.user.id;

    const newComment = new Comment({
      content,
      postId,
      userId,
    });

    await newComment.save();

    res.status(200).json({
        success: true,
        message: "Comment created successfully",
        Comment: newComment,
    });
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
    try {
    const comments = (await Comment.find({ postId: req.params.postId.toString() }).populate("userId", "username profilePicture")
    ).toSorted((a, b) => new
      Date(b.createdAt) - new
      Date(a.createdAt))
  
    res.status(200).json(comments)
    }
    catch (error) {
        next(error)
    }
}
     
export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, "Comment not found"));
    }

    const userIndex = comment.likes.indexOf(req.user.id);

    if (userIndex === -1) {
      comment.noOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.noOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }

    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};


export const updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) return next(errorHandler(404, "Comment not found"));

    if (comment.userId !== req.user.id) {
      return next(errorHandler(403, "You can update only your comment"));
    }

    comment.content = req.body.content;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};


export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId)

    if (!comment) {
      return next(errorHandler(404, "Comment not found"))
    }

    // Only owner can delete
    if (comment.userId !== req.user.id) {
      return next(errorHandler(403, "You can delete only your comment"))
    }

    await Comment.findByIdAndDelete(req.params.commentId)

    res.status(200).json("Comment deleted successfully ✅")
  } catch (error) {
    next(error)
  }
}

export const getComments = async (req, res, next) => {
//   console.log("REQ.USER 👉", req.user);

// if (!req.user) {
//   return res.status(401).json({
//     success: false,
//     message: "User not found in request. Token missing or invalid"
//   })
// }

// if (!req.user.isAdmin) {
//   return res.status(403).json({
//     success: false,
//     message: "You are not admin"
//   })
// }
  if(!req.user.isAdmin || !req.user) {
    return next(errorHandler(403, "You are not Authorized to access these resources")
  )
  }

  try {
  const startIndex = parseInt(req.query.startIndex) || 0;

  const limit = parseInt(req.query.limit) || 9;

  const sortDirection = req.query.sort === "desc" ? -1 : 1

  const comments = await Comment.find()
  .sort({createdAt: sortDirection})
  .skip(startIndex)
  .limit(limit)

  const totalComments = await Comment.countDocuments()

  const now = new Date()

  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() -1, now.getDate())

  const lastMonthComments = await Comment.countDocuments({
    createdAt: {$gte: oneMonthAgo },
  })

  res.status(200).json({ comments, totalComments, lastMonthComments })
  }
  catch (error) {
    next(error)
  }
}
import express from 'express'
import { verifyToken } from '../utils/verifyUser.js'
import { createComment, deleteComment, getComments, getPostComments, likeComment, updateComment } from '../controllers/comment.controller.js'

const router = express.Router()

router.post("/create", verifyToken, createComment)
router.get("/getPostComments/:postId", getPostComments)
router.put("/likecomment/:commentId", verifyToken, likeComment)
router.put("/update/:commentId", verifyToken, updateComment)
router.delete("/delete/:commentId", verifyToken, deleteComment)
router.get("/getcomments", verifyToken,getComments)

export default router;
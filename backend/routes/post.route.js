import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import { create, getPosts, getPostById } from "../controllers/post.controller.js";
import { deletepost, updatepost } from "../controllers/post.controller.js"

const router = express.Router()


router.post("/create", verifyToken, create)
router.get("/getposts", getPosts);
router.get("/all", getPosts);
router.get("/:postId", getPostById);
router.delete("/deletepost/:postId/:userId", deletepost);
router.put("/updatepost/:postId/:userId", updatepost);



export default router;
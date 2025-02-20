import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
	createPost,
	getFeedPosts,
	getUserPosts,
	deletePost,
	getPostById,
	createComment,
	likePost,
	deleteComment,
} from "../controllers/post.controller.js";

const router = express.Router();

router.delete("/:postId/comment/:commentId", protectRoute, deleteComment);
router.get("/", protectRoute, getFeedPosts);
router.post("/create", protectRoute, createPost);
router.delete("/delete/:id", protectRoute, deletePost);
router.get("/:id", protectRoute, getPostById);
router.get("/users/:userId/posts", protectRoute, getUserPosts);
router.post("/:id/comment", protectRoute, createComment);
router.post("/:id/like", protectRoute, likePost);

export default router;

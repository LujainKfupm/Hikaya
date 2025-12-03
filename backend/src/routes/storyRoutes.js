import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
    getPublicStories,
    deleteStory,
    getMyStories,
    getStoryById,
    rateStory,
    addComment, deleteComment,
} from "../controllers/storyController.js";

const router = express.Router();

router.get("/public", getPublicStories);

router.delete("/:id", protect, adminOnly, deleteStory);

router.get("/mine", protect, getMyStories);

router.get("/:id", getStoryById);

router.post("/:id/rate", protect, rateStory);
router.post("/:id/comments", protect, addComment);
router.delete("/:storyId/comments/:commentId", protect, adminOnly, deleteComment);


export default router;


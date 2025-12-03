/**
 * routes/storyRoutes.js
 * -------------------------------------
 * Defines REST API endpoints for story CRUD.
 *
 * Routes to include:
 *   POST /
 *   GET /mine
 *   GET /public
 *   GET /:id
 *   DELETE /:id
 *
 * Should import:
 *   - express.Router()
 *   - storyController
 *   - authMiddleware
 */

import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
    getPublicStories,
    deleteStory,
    getMyStories,
    getStoryById,
} from "../controllers/storyController.js";

const router = express.Router();

router.get("/public", getPublicStories);

router.delete("/:id", protect, adminOnly, deleteStory);

router.get("/mine", protect, getMyStories);

router.get("/:id", getStoryById);

export default router;


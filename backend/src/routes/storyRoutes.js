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
import { protect } from "../middleware/authMiddleware.js";

import {
    createStory,
    getMyStories,
    getPublicStories,
    getStory,
    deleteStory
} from "../controllers/storyController.js";
const router = express.Router();

router.post("/", protect, createStory);
router.get("/mine", protect, getMyStories);
router.get("/:id", protect, getStory);
router.delete("/:id", protect, deleteStory);

router.get("/public", getPublicStories);

export default router;

/**
 * routes/generateRoutes.js
 * -------------------------------------
 * Defines:
 *   POST /api/generate/story  → generate a new story using OpenAI.
 *
 * Optionally you can protect this route later with auth middleware.
 */

import express from "express";
import { generateStory } from "../controllers/generateController.js";
// When auth is ready, you can do:
// import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public for now:
// router.post("/story", protect, generateStory);
router.post("/story", generateStory);

export default router;

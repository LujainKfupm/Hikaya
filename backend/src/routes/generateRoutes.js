
import express from "express";
import { generateStory } from "../controllers/generateController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/story", protect, generateStory);
router.post("/story", generateStory);

export default router;

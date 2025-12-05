
import express from "express";
import { generateStory } from "../controllers/generateController.js";
import { optionalAuth } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/story", optionalAuth, generateStory);

export default router;

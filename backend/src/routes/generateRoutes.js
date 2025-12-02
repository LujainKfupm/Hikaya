
import express from "express";
import { generateStory } from "../controllers/generateController.js";

const router = express.Router();

router.post("/story", generateStory);

export default router;

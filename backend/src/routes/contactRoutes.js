import express from "express";
import { sendMessage, getMessages, deleteMessage } from "../controllers/contactController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", sendMessage);         // public contact form
router.get("/", protect, adminOnly, getMessages);  // admin only
router.delete("/:id", protect, deleteMessage);

export default router;
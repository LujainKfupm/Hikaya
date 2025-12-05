import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getUsers, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/", protect, adminOnly, getUsers);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
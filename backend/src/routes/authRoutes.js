import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// register a new user
router.post("/register", register);
//login an existing user
router.post("/login", login);
// get current logged-in user
router.get("/me", protect, getMe);

export default router;

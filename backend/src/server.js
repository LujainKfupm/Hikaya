/**
 * server.js
 * -----------------------
 * This file starts the Express server.
 * It should ONLY:
 *   - load environment variables
 *   - create the app
 *   - use middleware (express.json, cors)
 *   - connect to MongoDB
 *   - mount route files
 *   - start listening
 *
 * DO NOT WRITE CONTROLLERS OR DATABASE LOGIC HERE.
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import generateRoutes from "./routes/generateRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect DB
connectDB(process.env.MONGO_URL);

// Route Mounting
app.use("/api/auth", authRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/generate", generateRoutes);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("🚀 Server running");
});

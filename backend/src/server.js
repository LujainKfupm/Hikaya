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

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import generateRoutes from "./routes/generateRoutes.js";
import {AdminAccount} from "./utils/adminAccount.js";

const app = express();

app.use(cors());
app.use(express.json());

// Connect DB

async function startServer() {
    await connectDB(process.env.MONGO_URL);
    await AdminAccount();

    app.listen(process.env.PORT || 3000, () => {
        console.log("Server running");
    });
}

startServer();

// Route Mounting
app.use("/api/auth", authRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/generate", generateRoutes);

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});


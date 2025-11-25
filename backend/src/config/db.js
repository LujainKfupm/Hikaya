/**
 * config/db.js
 * -----------------------
 * This file connects to MongoDB using Mongoose.
 * Only write:
 *   - mongoose.connect()
 *   - console.log on success
 *   - throw error if connection fails
 */

import mongoose from "mongoose";

export async function connectDB(url) {
    try {
        await mongoose.connect(url);
        console.log("🌿 MongoDB connected");
    } catch (err) {
        console.error("DB Connection Failed:", err);
        process.exit(1);
    }
}

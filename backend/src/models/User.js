/**
 * models/User.js
 * -----------------------
 * Mongoose schema for Users.
 *
 * Should include:
 *   - name: String
 *   - email: String (unique)
 *   - passwordHash: String
 *
 * You MAY add:
 *   - createdAt / updatedAt (timestamps)
 *
 * This file ONLY defines the schema & exports the model.
 */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // TODO: define schema fields
}, { timestamps: true });

export default mongoose.model("User", userSchema);

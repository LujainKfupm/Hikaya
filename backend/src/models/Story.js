/**
 * models/Story.js
 * -----------------------
 * Mongoose schema for Stories saved by users.
 *
 * Should include fields like:
 *   - user: ObjectId (ref: "User")
 *   - heroName, age, gender
 *   - topics: Array
 *   - morals: Array
 *   - details: String
 *   - content: String   (the generated story)
 *   - isPublic: Boolean
 */

import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    // TODO: define schema fields
}, { timestamps: true });

export default mongoose.model("Story", storySchema);

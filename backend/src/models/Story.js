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
    user: {
        type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
    },

    heroName: {
        type: String,
            required: [true, "اسم البطل مطلوب"],
            trim: true,
    },

    age: {
        type: Number,
            required: [true, "العمر مطلوب"],
            min: 0,
    },

    gender: {
        type: String,
        enum: ["boy", "girl", "other"],
            required: [true, "الجنس مطلوب"]
    },

    topics: {
        type: [String],
    default: [],
    },

    morals: {
        type: [String],
    default: [],
    },

    details: {
        type: String,
    default: "",
            trim: true,
    },

    content: {
        type: String,
            required: [true, "القصة لا يمكن أن تكون فارغة"]
    },

    isPublic: {
        type: Boolean,
    default: false,
    },
},
{ timestamps: true }
);
export default mongoose.model("Story", storySchema);

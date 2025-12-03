import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
    },

        title: {
            type: String,
            required: [true, "عنوان القصة مطلوب"],
            trim: true,
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

        ratings: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                value: { type: Number, min: 1, max: 5 }
            }
        ],

        comments: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                name: String,
                text: String,
                date: { type: Date, default: Date.now }
            }
        ],

    }, { timestamps: true }
);
export default mongoose.model("Story", storySchema);

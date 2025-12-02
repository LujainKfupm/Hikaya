/**
 * controllers/storyController.js
 * -------------------------------------
 * Handles CRUD for stories:
 *
 *   POST /     → create new story in DB
 *   GET /mine  → get stories for logged-in user
 *   GET /public → get public stories
 *   GET /:id   → get single story by ID
 *   DELETE /:id → delete story (owner only)
 *
 * Logic ONLY. Do not define routes here.
 */

// TODO: implement CRUD functions

import Story from "../models/Story.js";

export const createStory = async (req, res, next) => {
    try {
        const userId = req.user?._id?.toString();

        const {
            heroName,
            age,
            gender,
            topics,
            morals,
            details,
            content,
            isPublic
        } = req.body;

        if (!heroName || !age || !gender || !content) {
            return res.status(400).json({
                message: "heroName, age, gender و content مطلوبة",
            });
        }

        const story = await Story.create({
            heroName,
            age,
            gender,
            topics: topics || [],
            morals: morals || [],
            details: details || "",
            content,
            isPublic: isPublic || false,
            user: userId || null
        });

        return res.status(201).json(story);
    } catch (error) {
        next(error);
    }
};


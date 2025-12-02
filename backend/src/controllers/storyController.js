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
export const getMyStories = async (req, res, next) => {
    try {
        const userId = req.user?._id?.toString();

        if (!userId) {
            return res.status(401).json({ message: "يجب تسجيل الدخول لعرض قصصك" });
        }

        const stories = await Story.find({ user: userId }).sort({ createdAt: -1 });

        return res.status(200).json(stories);
    } catch (error) {
        next(error);
    }
};
export const getPublicStories = async (req, res, next) => {
    try {
        const stories = await Story.find({ isPublic: true }).sort({ createdAt: -1 });

        return res.status(200).json(stories);
    } catch (error) {
        next(error);
    }
};
export const getStory = async (req, res, next) => {
    try {
        const storyId = req.params.id;
        const currentUserId = req.user?._id?.toString();

        const story = await Story.findById(storyId);

        if (!story) {
            return res.status(404).json({ message: "القصة غير موجودة" });
        }

        if (!story.isPublic) {
            if (!currentUserId || story.user?.toString() !== currentUserId) {
                return res.status(403).json({ message: "ليس لديك صلاحية لعرض هذه القصة" });
            }
        }

        return res.status(200).json(story);
    } catch (error) {
        next(error);
    }
};
export const deleteStory = async (req, res, next) => {
    try {
        const storyId = req.params.id;
        const currentUserId = req.user?._id?.toString();

        const story = await Story.findById(storyId);

        if (!story) {
            return res.status(404).json({ message: "القصة غير موجودة" });
        }

        if (!currentUserId || story.user?.toString() !== currentUserId) {
            return res.status(403).json({ message: "ليس لديك صلاحية لحذف هذه القصة" });
        }

        await story.deleteOne();

        return res.status(200).json({ message: "تم حذف القصة بنجاح" });
    } catch (error) {
        next(error);
    }
};





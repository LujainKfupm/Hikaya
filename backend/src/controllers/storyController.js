import Story from "../models/Story.js";

export async function getPublicStories(req, res, next) {
    try {
        const stories = await Story.find({ isPublic: true })
            .sort({ createdAt: -1 });
        res.json(stories);
    } catch (err) {
        next(err);
    }
}

export async function deleteStory(req, res, next) {
    try {
        await Story.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        next(err);
    }
}

export async function getMyStories(req, res, next) {
    try {
        const stories = await Story.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json(stories);
    } catch (err) {
        next(err);
    }
}

export async function getStoryById(req, res, next) {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) {
            return res.status(404).json({ message: "القصة غير موجودة" });
        }
        res.json(story);
    } catch (err) {
        next(err);
    }
}


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
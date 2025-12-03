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
}

export async function addComment(req, res, next) {
    try {
        const { id } = req.params;
        const { text } = req.body;

        if (!text || !text.trim())
            return res.status(400).json({ message: "التعليق فارغ" });

        const story = await Story.findById(id);
        if (!story) return res.status(404).json({ message: "القصة غير موجودة" });

        const comment = {
            user: req.user._id,
            name: req.user.name,
            text,
            date: new Date(),
        };

        story.comments.push(comment);
        await story.save();

        res.json({ message: "تم إضافة التعليق", comment });
    } catch (err) {
        next(err);
    }
}

export async function rateStory(req, res, next) {
    try {
        const { id } = req.params;
        const { value } = req.body;
        const userId = req.user._id;

        if (!value || value < 1 || value > 5)
            return res.status(400).json({ message: "قيمة التقييم غير صحيحة" });

        const story = await Story.findById(id);
        if (!story) return res.status(404).json({ message: "القصة غير موجودة" });

        const existing = story.ratings.find((r) => r.user.toString() === userId.toString());
        if (existing) {
            existing.value = value;
        } else {
            story.ratings.push({ user: userId, value });
        }

        await story.save();

        const avg =
            story.ratings.reduce((a, r) => a + r.value, 0) / story.ratings.length;

        res.json({
            message: "تم التقييم بنجاح",
            ratingAvg: avg,
            ratingCount: story.ratings.length,
        });
    } catch (err) {
        next(err);
    }
}

export async function deleteComment(req, res, next) {
    try {
        const { storyId, commentId } = req.params;

        const story = await Story.findById(storyId);
        if (!story) return res.status(404).json({ message: "القصة غير موجودة" });

        story.comments = story.comments.filter(
            (c) => c._id.toString() !== commentId
        );

        await story.save();

        res.json({ message: "تم حذف التعليق" });
    } catch (err) {
        next(err);
    }
}


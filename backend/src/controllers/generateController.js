/**
 * controllers/generateController.js
 * -------------------------------------
 * Uses OpenAI API to generate a kids story based on user input.
 * Optionally saves the story to MongoDB (Story model).
 *
 * Expects body:
 * {
 *   heroName: string,
 *   age: number,
 *   gender: "boy" | "girl",
 *   topics: string[],
 *   morals: string[],
 *   details: string,
 *   isPublic: boolean
 * }
 *
 * Returns:
 * {
 *   story: string,
 *   saved: boolean,
 *   storyId?: string
 * }
 */

import OpenAI from "openai";
import Story from "../models/Story.js";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

function buildStoryPrompt({ heroName, age, gender, topics, morals, details }) {
    const genderText =
        gender === "girl" ? "بنت" : gender === "boy" ? "ولد" : "طفل";

    const topicsText =
        Array.isArray(topics) && topics.length > 0
            ? topics.join("، ")
            : "أي موضوع مناسب للأطفال";

    const moralsText =
        Array.isArray(morals) && morals.length > 0
            ? morals.join("، ")
            : "قيمة أخلاقية جميلة";

    const extraDetails = details?.trim()
        ? `تفاصيل إضافية عن الطفل: ${details}`
        : "لا توجد تفاصيل إضافية.";

    return `
اكتب قصة قصيرة ممتعة للأطفال باللغة العربية الفصحى المبسطة.

مواصفات القصة:
- اسم البطل/ة: ${heroName}
- العمر: ${age} سنوات
- الجنس: ${genderText}
- الموضوعات: ${topicsText}
- القيم الأخلاقية المطلوبة: ${moralsText}
- ${extraDetails}

شروط القصة:
- أن تكون موجهة لطفل/طفلة بعمر ${age} سنوات.
- أن يكون الأسلوب بسيطًا ومفهومًا.
- أن تحتوي على بداية، وسط، ونهاية.
- أن تنتهي بخلاصة واضحة للقيمة الأخلاقية.
- لا تستخدم لغة صعبة أو فصحى معقدة.
`;
}

export async function generateStory(req, res, next) {
    try {
        const {
            heroName,
            age,
            gender,
            topics = [],
            morals = [],
            details = "",
            isPublic = false,
        } = req.body;

        // Basic validation
        if (!heroName || !age || !gender) {
            return res.status(400).json({
                message: "الحقول heroName و age و gender مطلوبة.",
            });
        }

        if (!process.env.OPENAI_API_KEY) {
            return res.status(500).json({
                message: "OpenAI API key is not configured on the server.",
            });
        }

        const prompt = buildStoryPrompt({
            heroName,
            age,
            gender,
            topics,
            morals,
            details,
        });

        // Call OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "أنت كاتب قصص أطفال مبدع يكتب قصصًا تعليمية ممتعة باللغة العربية المبسطة.",
                },
                { role: "user", content: prompt },
            ],
            temperature: 0.9,
        });

        const storyText = completion.choices[0]?.message?.content?.trim();

        if (!storyText) {
            return res.status(500).json({
                message: "حدث خطأ أثناء إنشاء القصة.",
            });
        }

        // Try to save to DB (not fatal if this fails)
        let savedStory = null;
        try {
            const userId = req.user ? req.user.id || req.user._id : null;

            savedStory = await Story.create({
                user: userId,
                heroName,
                age,
                gender,
                topics,
                morals,
                details,
                content: storyText,
                isPublic,
            });
        } catch (dbErr) {
            // Log but don't block the response
            console.error("Failed to save story to DB:", dbErr);
        }

        return res.status(201).json({
            story: storyText,
            saved: !!savedStory,
            storyId: savedStory?._id,
        });
    } catch (err) {
        console.error("Error in generateStory controller:", err);
        return next(err);
    }
}

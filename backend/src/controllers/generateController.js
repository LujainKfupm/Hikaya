import OpenAI from "openai";
import Story from "../models/Story.js";
import dotenv from "dotenv";
dotenv.config();

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
            saveToLibrary = false,
            isPublic = false,
        } = req.body;

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

        const titlePrompt = `
أريد عنوانًا جميلًا وقصيرًا جدًا لقصة عربية للأطفال.
البطل: ${heroName}
العمر: ${age} سنوات
الموضوعات: ${topics.join("، ")}
القيم الأخلاقية: ${morals.join("، ")}

الشروط:
- عنوان قصير جدًا (3 إلى 6 كلمات)
- جذاب للأطفال
- باللغة العربية الفصحى
- بدون رموز أو تنسيق
`;

        const titleResponse = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: titlePrompt }],
            max_tokens: 20,
        });

        const generatedTitle = titleResponse.choices[0].message.content.trim();
        console.log("AI GENERATED TITLE:", generatedTitle);

        const prompt = buildStoryPrompt({
            heroName,
            age,
            gender,
            topics,
            morals,
            details,
        });

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

        const userId = req.user ? (req.user.id || req.user._id) : null;

        let savedStory = null;

        if (req.user && saveToLibrary) {
            try {
                savedStory = await Story.create({
                    user: userId,
                    title: generatedTitle,
                    heroName,
                    age,
                    gender,
                    topics,
                    morals,
                    details,
                    content: storyText,
                    isPublic: !!isPublic,
                });
                if (savedStory) {
                    console.log("SAVED STORY:", savedStory._id, savedStory.isPublic);
                }
            } catch (dbErr) {
                console.error("Failed to save story to DB:", dbErr);
            }
        }


        return res.status(201).json({
            title: generatedTitle,
            story: storyText,
            saved: !!savedStory,
            storyId: savedStory?._id,
        });

    } catch (err) {
        console.error("Error in generateStory controller:", err);
        return next(err);
    }
}

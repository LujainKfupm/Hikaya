export const TOPICS = ["صداقة", "فضاء", "مدرسة", "مغامرة", "عائلة"];
export const VALUES = ["الصدق", "الشجاعة", "الاحترام", "التعاون", "المثابرة"];
export const AGE_RANGES = ["3-5", "6-8", "9-12"];
const cover = "src/assets/ai story cover.jpg";

export let STORIES = [
    {
        id: "101",
        title: "سارة ورفاقها في رحلة البحث عن الكنز",
        author: "فريق حكايـة",
        ageRange: "6-8",
        topics: ["مغامرة"],
        values: ["التعاون"],
        ratingAvg: 4.7,
        ratingCount: 18,
        createdAt: "2025-01-02",
        cover: cover,
        body: `
في صباحٍ مشمسٍ مليءٍ بالحماس، اجتمعت سارة ورفاقها في ساحة المدرسة. 
كانوا قد وجدوا خريطة قديمة في مكتبة الصف تحمل علامات غريبة تشير إلى "كنزٍ مفقود" في الغابة القريبة.

انطلقت المجموعة بكل حماس، وكان كل منهم يحمل حقيبته الصغيرة. 
قالت سارة بابتسامة: "سنتعاون معًا ونكتشف السر!"

واجه الأطفال أثناء رحلتهم نهرًا صغيرًا، فتعاونوا على صنع جسرٍ من الأغصان للعبور. 
ثم واجهوا كهفًا مظلمًا، فأشعلوا المصابيح وأمسكوا بأيدي بعضهم. 
وفي النهاية، وجدوا صندوقًا خشبيًا صغيرًا مغطى بالتراب.

فتحوه ببطء فوجدوا بداخله رسالة تقول:
"الكنز الحقيقي هو الصداقة والعمل الجماعي."

ضحك الجميع وقالت سارة: "حقًا، لقد وجدنا أغلى كنز!"`,
        comments: [
            { id: "c1", name: "مريم", text: "قصة ممتعة جدًا!", date: "2025-01-03" },
            { id: "c2", name: "عبدالله", text: "أحببت فكرة التعاون!", date: "2025-01-04" }
        ],
        visibility: "public"
    },

    {
        id: "102",
        title: "رحلة يوسف وريلان إلى الفضاء",
        author: "فريق حكايـة",
        ageRange: "6-8",
        topics: ["فضاء"],
        values: ["الشجاعة"],
        ratingAvg: 4.9,
        ratingCount: 9,
        createdAt: "2025-01-01",
        cover: cover,
        body: `
في ليلةٍ هادئة، كان يوسف ينظر إلى السماء من نافذة غرفته، يحلم بأن يصبح رائد فضاء.
فجأةً، ظهر ضوءٌ لامع في السماء، ومنه خرج روبوت صغير قال: 
"مرحبًا، أنا ريلان! هل ترغب بمغامرة إلى الفضاء؟"

لم يصدق يوسف عينيه، لكنه قال بحماس: "نعم بالتأكيد!"

صعدا معًا في مركبة فضائية لامعة، وشاهدا الأرض من بعيد. 
عبروا بين الكواكب والمجرّات، وزارا القمر حيث كانت الصخور تتلألأ كالذهب.

لكنهم واجهوا عاصفة نيزكية قوية! خاف يوسف قليلاً، 
فقال له ريلان: "الشجاعة ليست أن لا تخاف، بل أن تتصرف رغم الخوف."

تعاون الاثنان حتى خرجا من العاصفة بأمان. وعندما عادا إلى الأرض، 
قال يوسف مبتسمًا: "لقد أدركت أن الشجاعة هي أعظم قوة في الفضاء… وفي الحياة أيضًا."`,
        comments: [
            { id: "c1", name: "نورة", text: "جميلة جدًا ومُلهمة!", date: "2025-01-02" }
        ],
        visibility: "public"
    },

    {
        id: "103",
        title: "عبدالله ومسابقة الرسم",
        author: "فريق حكايـة",
        ageRange: "3-5",
        topics: ["عائلة", "مدرسة"],
        values: ["الاحترام"],
        ratingAvg: 5.0,
        ratingCount: 4,
        createdAt: "2025-01-05",
        cover: cover,
        body: `
كان عبدالله يحب الرسم منذ صغره، وكان يملأ دفاتره بالألوان والأشكال الجميلة.
وذات يومٍ أعلنت المدرسة عن "مسابقة الرسم السنوية"، 
فقرر عبدالله المشاركة بلوحةٍ تعبّر عن "الاحترام".

رسم عبدالله مشهدًا لطفلٍ يساعد صديقه الكبير في حمل كتبه، 
وأمه تبتسم بفخر وهي تراه يقدّر الآخرين.

عندما عرضت المدرسة اللوحات، وقف الجميع يشاهد لوحة عبدالله بإعجاب. 
فازت لوحته بالمركز الأول، لكنه قال بتواضع: 
"الجائزة الحقيقية هي أن أتعلم احترام الجميع."

صفّق المعلم وقال له: "هذا هو الفنّ الحقيقي يا عبدالله، الفنّ الذي يحمل قيمة جميلة!"`,
        comments: [
            { id: "c1", name: "ليان", text: "قصة مؤثرة جدًا!", date: "2025-01-06" }
        ],
        visibility: "public"
    }
];

// helpers (front-end only)
export function addStory(s) {
    STORIES = [s, ...STORIES];
}
export function rateStory(id, value) {
    STORIES = STORIES.map((s) =>
        s.id === id
            ? {
                ...s,
                ratingAvg: Number(((s.ratingAvg * s.ratingCount + value) / (s.ratingCount + 1)).toFixed(1)),
                ratingCount: s.ratingCount + 1
            }
            : s
    );
}
export function addComment(id, name, text) {
    STORIES = STORIES.map((s) =>
        s.id === id
            ? {
                ...s,
                comments: [
                    {
                        id: crypto.randomUUID(),
                        name,
                        text,
                        date: new Date().toISOString().slice(0, 10)
                    },
                    ...s.comments
                ]
            } : s
    );
}

export const PLACEHOLDER_COVER = "src/assets/ai story cover.jpg";
const DELAY = 300;

function normalize(story) {
    return {
        ...story,
        rating: Number(story.rating ?? story.ratingAvg ?? 0),
        ratingsCount: story.ratingCount,
        commentsCount: Array.isArray(story.comments) ? story.comments.length : 0,
        date: story.createdAt,
        isPublic: story.visibility === "public",
        topic: story.topics?.[0] ?? "",
        moral: story.values?.[0] ?? "",
        cover: story.cover?.trim() ? story.cover : PLACEHOLDER_COVER
    };
}

export function getStories(options = {}) {
    // جعل الافتراضي publicOnly = false
    const { publicOnly = false, q = "", sortBy = "date_desc" } = options;

    return new Promise((resolve) => {
        setTimeout(() => {
            let data = STORIES.map(normalize);

            if (publicOnly) data = data.filter((s) => s.isPublic);

            if (q) {
                const k = q.toLowerCase();
                data = data.filter((s) =>
                    [
                        s.title,
                        s.topic,
                        s.moral,
                        s.ageRange,
                        ...(s.topics || []),
                        ...(s.values || []),
                        s.body || ""
                    ]
                        .join(" ")
                        .toLowerCase()
                        .includes(k)
                );
            }

            switch (sortBy) {
                case "rating_desc":
                    data.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
                    break;
                case "date_asc":
                    data.sort((a, b) => String(a.date).localeCompare(String(b.date)));
                    break;
                case "date_desc":
                default:
                    data.sort((a, b) => String(b.date).localeCompare(String(a.date)));
                    break;
            }

            resolve(data);
        }, DELAY);
    });
}

export function getStoryById(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const s = STORIES.find((st) => String(st.id) === String(id));
            resolve(s ? normalize(s) : null);
        }, DELAY);
    });
}
export let USERS = [
    { id: "u1", name: "أحمد", email: "ahmed@example.com" },
    { id: "u2", name: "سارة", email: "sara@example.com" }
];

export let COMMENTS = [
    { id: "cm1", storyId: "101", text: "قصة رائعة!", user: "أحمد" }
];

export let CATEGORIES = ["مغامرات", "تعليم", "خيال"];
export let AGE_GROUPS = ["3-5 سنوات", "6-8 سنوات", "9-12 سنة"];

export let CONTACT_MESSAGES = [
    {
        id: "m1",
        name: "ليان",
        email: "lian@example.com",
        message: "كيف أضيف قصة؟",
        responded: false
    }
];

// ===================== ADMIN FUNCTIONS =====================

// Users
export function getUsers() { return Promise.resolve([...USERS]); }
export function deleteUserById(id) {
    USERS = USERS.filter((u) => u.id !== id);
    return Promise.resolve();
}

// Comments
export function getComments() { return Promise.resolve([...COMMENTS]); }
export function deleteCommentById(id) {
    COMMENTS = COMMENTS.filter((c) => c.id !== id);
    return Promise.resolve();
}

// Categories
export function getCategories() { return Promise.resolve([...CATEGORIES]); }
export function addCategory(cat) {
    CATEGORIES.push(cat);
    return Promise.resolve();
}
export function deleteCategory(cat) {
    CATEGORIES = CATEGORIES.filter((c) => c !== cat);
    return Promise.resolve();
}

// Age Groups
export function getAgeGroups() { return Promise.resolve([...AGE_GROUPS]); }
export function addAgeGroup(age) {
    AGE_GROUPS.push(age);
    return Promise.resolve();
}
export function deleteAgeGroup(age) {
    AGE_GROUPS = AGE_GROUPS.filter((a) => a !== age);
    return Promise.resolve();
}

// Contact messages
export function getContactMessages() {
    return Promise.resolve([...CONTACT_MESSAGES]);
}
export function sendReply(id, reply) {
    CONTACT_MESSAGES = CONTACT_MESSAGES.map((m) =>
        m.id === id ? { ...m, responded: true, reply } : m
    );
    return Promise.resolve();
}

// Story deletion (needed for admin)
export function deleteStoryById(id) {
    STORIES = STORIES.filter((s) => s.id !== id);
    return Promise.resolve();
}
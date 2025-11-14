export const TOPICS = ["الصداقة", "الفضاء", "المدرسة", "المغامرة", "العائلة"];
export const VALUES = ["الصدق", "الشجاعة", "الاحترام", "التعاون", "المثابرة"];
export const AGE_RANGES = ["3-5", "6-8", "9-12"];

export const cover = (seed=1) =>
    `https://picsum.photos/seed/hikaya${seed}/800/420`;

export let STORIES = [
    {
        id: "101", title: "سارة ورفاقها في رحلة البحث عن الكنز",
        ageRange: "6-8", topics: ["المغامرة"], values: ["التعاون"],
        ratingAvg: 4.7, ratingCount: 18,
        createdAt: "2025-01-02",
        cover: cover(1),
        body: "في صباحٍ مشمس خرجت سارة مع أصدقائها في رحلةٍ ممتعة داخل الكهف...",
        comments: [{ id:"c1", name:"مريم", text:"قصة جميلة!", date:"2025-01-03" }],
        visibility: "public"
    },
    {
        id: "102", title: "رحلة يوسف وريلان إلى الفضاء",
        ageRange: "6-8", topics: ["الفضاء"], values: ["الشجاعة"],
        ratingAvg: 4.9, ratingCount: 9,
        createdAt: "2025-01-01",
        cover: cover(2),
        body: "كان يوسف يحلم بالفضاء منذ صغره، وفي ليلةٍ هادئة ظهر نيزك لامع...",
        comments: [], visibility: "public"
    },
    {
        id: "103", title: "عبدالله ومسابقة الرسم",
        ageRange: "3-5", topics: ["العائلة","المدرسة"], values: ["الاحترام"],
        ratingAvg: 5.0, ratingCount: 4,
        createdAt: "2025-01-05",
        cover: cover(3),
        body: "اجتمع الأصدقاء في المدرسة للاحتفال بعيد ميلاد عبد الله...",
        comments: [], visibility: "private"
    }
];

// helpers (front-end only)
export function addStory(s) {
    STORIES = [s, ...STORIES];
}
export function rateStory(id, value) {
    STORIES = STORIES.map(s =>
        s.id === id
            ? { ...s,
                ratingAvg: Number(((s.ratingAvg*s.ratingCount + value)/(s.ratingCount+1)).toFixed(1)),
                ratingCount: s.ratingCount + 1
            }
            : s
    );
}
export function addComment(id, name, text) {
    STORIES = STORIES.map(s =>
        s.id === id ? { ...s, comments: [{ id: crypto.randomUUID(), name, text, date: new Date().toISOString().slice(0,10) }, ...s.comments] } : s
    );
}

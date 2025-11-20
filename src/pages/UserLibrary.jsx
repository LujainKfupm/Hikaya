import { STORIES } from "../mocks/mockApi";
import StoryCard from "../components/StoryCard";

import coverImage from "../assets/ai story cover.jpg";

import { BookOpen, Share2, BookCopy, Star } from "lucide-react";

export default function UserLibrary() {

    const mine = STORIES; // demo: load all stories

    const stats = {
        total: mine.length,
        public: mine.filter(s => s.visibility === "public").length,
        private: mine.filter(s => s.visibility === "private").length,
        avg: (
            mine.reduce((a, s) => a + s.ratingAvg, 0) / Math.max(1, mine.length)
        ).toFixed(1),
    };

    // Helper function for story image
    const getStoryImage = (title) => {
        if (title === "سارة ورفاقها في رحلة البحث عن الكنز") return coverImage;
        if (title === "رحلة يوسف وريلان إلى الفضاء") return coverImage;
        if (title === "عبدالله ومسابقة الرسم") return coverImage;
        return coverImage;
    };

    return (
        <>
            <h1>مكتبتي</h1>

            {/* ------- Statistics Cards ------- */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                    gap: "16px",
                    marginBottom: "24px",
                }}
            >
                <div className="stat-card">
                    <BookOpen size={24} color="#4A90E2" />
                    <p className="stat-label">القصص الخاصة</p>
                    <h2>{stats.private}</h2>
                </div>


                <div className="stat-card">
                    <BookOpen size={24} color="#27AE60" />
                    <p className="stat-label">القصص العامة</p>
                    <h2>{stats.public}</h2>
                </div>

                <div className="stat-card">
                    <BookOpen size={24} color="#333" />
                    <p className="stat-label">إجمالي القصص</p>
                    <h2>{stats.total}</h2>
                </div>

                <div className="stat-card">
                    <Star size={24} color="#f5c518" />
                    <p className="stat-label">متوسط التقييم</p>
                    <h2>{stats.avg} ★</h2>
                </div>
            </div>

            {/* ------- Story Cards Grid ------- */}
            <div className="grid">
                {mine.map((s) => (
                    <StoryCard
                        key={s.id}
                        story={s}
                        image={getStoryImage(s.title)}
                    />
                ))}
            </div>
        </>
    );
}


import { useAuth } from "../context/AuthContext";
import { STORIES } from "../mocks/mockApi";
import StoryCard from "../components/StoryCard";

import heroImage from "../assets/user_library.png";
import spaceImage from "../assets/space_journey.png";
import drawingImage from "../assets/drawing_contest.png";

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
        if (title === "سارة ورفاقها في رحلة البحث عن الكنز") return heroImage;
        if (title === "رحلة يوسف وريلان إلى الفضاء") return spaceImage;
        if (title === "عبدالله ومسابقة الرسم") return drawingImage;
        return heroImage;
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
                <div style={statCardStyle}>
                    <BookOpen size={24} color="#4A90E2" />
                    <p style={statLabel}>القصص الخاصة</p>
                    <h2>{stats.private}</h2>
                </div>

                <div style={statCardStyle}>
                    <Share2 size={24} color="#27AE60" />
                    <p style={statLabel}>القصص العامة</p>
                    <h2>{stats.public}</h2>
                </div>

                <div style={statCardStyle}>
                    <BookCopy size={24} color="#333" />
                    <p style={statLabel}>إجمالي القصص</p>
                    <h2>{stats.total}</h2>
                </div>

                <div style={statCardStyle}>
                    <Star size={24} color="#f5c518" />
                    <p style={statLabel}>متوسط التقييم</p>
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

/* ---------------------------------------------
   Shared Styles
---------------------------------------------- */
const statCardStyle = {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};

const statLabel = {
    margin: "6px 0",
    color: "#555",
};

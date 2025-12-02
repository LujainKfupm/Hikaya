import { useEffect, useMemo, useState } from "react";
import StoryCard from "../components/StoryCard";
import coverImage from "../assets/ai story cover.jpg";
import { BookOpen, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { fetchMyStories } from "../api";

export default function UserLibrary() {
    const { user } = useAuth();
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    const isLoggedIn = !!user;

    useEffect(() => {
        if (!isLoggedIn) {
            setStories([]);
            setLoading(false);
            return;
        }

        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const token = user?.token;
                const data = await fetchMyStories(token);
                if (!alive) return;
                setStories(data || []);
            } catch (err) {
                console.error(err);
                if (alive) setStories([]);
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [isLoggedIn, user]);

    const stats = useMemo(() => {
        if (!stories.length) {
            return { total: 0, public: 0, private: 0, avg: "0.0" };
        }

        const total = stories.length;
        const publicCount = stories.filter((s) => s.isPublic === true).length;
        const privateCount = total - publicCount;

        const avgRating = (
            stories.reduce(
                (sum, s) => sum + Number(s.ratingAvg ?? s.rating ?? 0),
                0
            ) / total
        ).toFixed(1);

        return {
            total,
            public: publicCount,
            private: privateCount,
            avg: avgRating,
        };
    }, [stories]);


    if (!isLoggedIn) {
        return (
            <>
                <h1>مكتبتي</h1>
                <p>يجب تسجيل الدخول لعرض مكتبتي.</p>
            </>
        );
    }

    const normalizedStories = stories.map((s) => ({
        ...s,
        id: s._id || s.id,
    }));

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
            {loading ? (
                <p>جارٍ تحميل القصص...</p>
            ) : normalizedStories.length === 0 ? (
                <p>لا توجد قصص في مكتبتي حتى الآن.</p>
            ) : (
                <div className="grid">
                    {normalizedStories.map((s) => (
                        <StoryCard
                            key={s.id}
                            story={s}
                            image={coverImage}
                        />
                    ))}
                </div>
            )}
        </>
    );
}

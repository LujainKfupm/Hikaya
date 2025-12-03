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
            return { mine: 0, avg: "0.0" };
        }

        const mine = stories.length;

        const avgRating = (
            stories.reduce(
                (sum, s) => sum + Number(s.ratingAvg ?? s.rating ?? 0),
                0
            ) / mine
        ).toFixed(1);

        return {
            mine,
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

    function formatDate(iso) {
        if (!iso) return "—";
        try {
            const d = new Date(iso);
            return d.toLocaleDateString("ar-SA");
        } catch {
            return iso;
        }
    }

    const normalizedStories = stories.map((s) => ({
        ...s,
        id: s._id || s.id,
        ageRange: s.age,
        date: formatDate(s.createdAt),
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
                    <BookOpen size={24} color="#333" />
                    <p className="stat-label">إجمالي القصص</p>
                    <h2>{stats.mine}</h2>
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

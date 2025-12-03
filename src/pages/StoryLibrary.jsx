import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
    Star,
    Calendar,
    Baby,
    Filter,
    Search,
    Tag,
    Clock,
    TrendingUp,
    RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { fetchPublicStories, deleteStory } from "../api";
import coverImage from "../assets/ai story cover.jpg";


const TOPIC_OPTIONS = [
    { key: "adventure", label: "مغامرة" },
    { key: "fantasy", label: "خيال" },
    { key: "science", label: "علمي" },
    { key: "nature", label: "طبيعة" },
    { key: "school", label: "مدرسة" },
    { key: "family", label: "عائلة" },
    { key: "sports", label: "رياضة" },
    { key: "space", label: "فضاء" },
    { key: "animals", label: "حيوانات" },
    { key: "princesses", label: "أميرات" },
];

const keyByArabic = Object.fromEntries(TOPIC_OPTIONS.map((o) => [o.label, o.key]));
const keyByEnglish = {
    adventure: "adventure",
    fantasy: "fantasy",
    science: "science",
    scientific: "science",
    nature: "nature",
    school: "school",
    family: "family",
    sports: "sports",
    sport: "sports",
    space: "space",
    animals: "animals",
    animal: "animals",
    princesses: "princesses",
    princess: "princesses",
};

function normalizeTopicKey(raw) {
    if (!raw) return null;
    const s = String(raw).trim();
    if (keyByArabic[s]) return keyByArabic[s];
    const e = s.toLowerCase();
    return keyByEnglish[e] ?? null;
}

export default function StoryLibrary() {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";

    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ show: false, storyId: null });

    const [query, setQuery] = useState("");
    const [showFilters, setShowFilters] = useState(true);
    const [age, setAge] = useState("الكل");
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [sortBy, setSortBy] = useState("date_desc");

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const data = await fetchPublicStories();
                if (!alive) return;
                console.log("PUBLIC STORIES RAW:", data);
                setStories(data || []);
            } catch (err) {
                console.error(err);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, []);

    const normalized = useMemo(
        () =>
            stories.map((s) => {
                const topicRaw = s.topics?.[0] ?? "—";
                const topicKey = normalizeTopicKey(topicRaw);

                const ratingCount = Array.isArray(s.ratings) ? s.ratings.length : 0;
                const ratingSum = ratingCount
                    ? s.ratings.reduce((sum, r) => sum + (r.value ?? 0), 0)
                    : 0;
                const ratingAvg = ratingCount ? ratingSum / ratingCount : 0;

                const ageRange =
                    typeof s.age === "number"
                        ? s.age <= 5
                            ? "3-5"
                            : s.age <= 8
                                ? "6-8"
                                : "9-12"
                        : "—";

                return {
                    id: s._id,
                    title: s.title || `قصة ${s.heroName}`,
                    author: "—",
                    rating: ratingAvg,
                    moral: s.morals?.[0] ?? "—",
                    topicRaw,
                    topicKey,
                    cover: coverImage,
                    ageRange,
                    date: s.createdAt,
                    commentsCount: Array.isArray(s.comments) ? s.comments.length : 0,
                };
            }),
        [stories]
    );

    const filtered = useMemo(() => {
        const q = (query || "").toLowerCase().trim();

        let out = normalized.filter((s) => {
            const title = String(s.title || "").toLowerCase();
            const author = String(s.author || "").toLowerCase();
            const topic = String(s.topicRaw || "").toLowerCase();
            const moral = String(s.moral || "").toLowerCase();

            const matchesQuery =
                !q ||
                title.includes(q) ||
                author.includes(q) ||
                topic.includes(q) ||
                moral.includes(q);
            const matchesAge = age === "الكل" || String(s.ageRange) === age;
            const matchesTopics =
                selectedTopics.length === 0 ||
                (s.topicKey && selectedTopics.includes(s.topicKey));

            return matchesQuery && matchesAge && matchesTopics;
        });

        if (sortBy === "rating_desc") {
            out = out.slice().sort((a, b) => b.rating - a.rating);
        } else {
            out = out
                .slice()
                .sort(
                    (a, b) =>
                        (b.date ? new Date(b.date).getTime() : 0) -
                        (a.date ? new Date(a.date).getTime() : 0)
                );
        }

        return out;
    }, [normalized, query, age, selectedTopics, sortBy]);

    const toggleTopic = (topicKey) => {
        setSelectedTopics((prev) =>
            prev.includes(topicKey)
                ? prev.filter((t) => t !== topicKey)
                : [...prev, topicKey]
        );
    };

    const resetFilters = () => {
        setAge("الكل");
        setSelectedTopics([]);
        setSortBy("date_desc");
    };

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">المكتبة العامة</h1>

                <div
                    className="filters-toolbar"
                    style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}
                >
                    <button
                        type="button"
                        className="btn"
                        onClick={() => setShowFilters((v) => !v)}
                        aria-expanded={showFilters}
                        style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                    >
                        <Filter size={16} />
                        {showFilters ? "إخفاء الفلاتر" : "إظهار الفلاتر"}
                    </button>

                    <div
                        className="search-wrapper"
                        style={{ flex: 1, maxWidth: 720, position: "relative" }}
                    >
                        <input
                            type="text"
                            className="form-input"
                            placeholder="ابحث عن قصص..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            aria-label="بحث"
                        />
                        <Search
                            size={16}
                            style={{ position: "absolute", top: 12, left: 12, opacity: 0.55 }}
                        />
                    </div>
                </div>

                {showFilters && (
                    <div className="filter-card" style={{ marginTop: 12 }}>
                        <div className="filter-row">
                            <div
                                className="section-title"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    marginBottom: 8,
                                }}
                            >
                                <Baby size={16} />
                                <strong>تصفية حسب العمر</strong>
                            </div>
                            <div className="chip-group">
                                {["الكل", "3-5", "6-8", "9-12"].map((opt) => (
                                    <button
                                        key={opt}
                                        type="button"
                                        className={"chip" + (age === opt ? " chip--selected" : "")}
                                        onClick={() => setAge(opt)}
                                    >
                                        {opt === "الكل" ? "الكل" : opt + "سنوات"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-row" style={{ marginTop: 16 }}>
                            <div
                                className="section-title"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    marginBottom: 8,
                                }}
                            >
                                <Tag size={16} />
                                <strong>تصفية حسب الموضوع</strong>
                            </div>
                            <div className="chip-group">
                                {TOPIC_OPTIONS.map((t) => (
                                    <button
                                        key={t.key}
                                        type="button"
                                        className={
                                            "chip" + (selectedTopics.includes(t.key) ? " chip--selected" : "")
                                        }
                                        onClick={() => toggleTopic(t.key)}
                                    >
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="filter-row" style={{ marginTop: 16 }}>
                            <div
                                className="section-title"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    marginBottom: 8,
                                }}
                            >
                                <Clock size={16} />
                                <strong>ترتيب حسب</strong>
                            </div>
                            <div className="chip-group">
                                <button
                                    type="button"
                                    className={"chip" + (sortBy === "date_desc" ? " chip--selected" : "")}
                                    onClick={() => setSortBy("date_desc")}
                                >
                                    <Clock size={14} /> الأحدث
                                </button>
                                <button
                                    type="button"
                                    className={"chip" + (sortBy === "rating_desc" ? " chip--selected" : "")}
                                    onClick={() => setSortBy("rating_desc")}
                                >
                                    <TrendingUp size={14} /> الأعلى تقييمًا
                                </button>
                                <button type="button" className="chip" onClick={resetFilters}>
                                    <RefreshCw size={14} /> إعادة ضبط
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <p className="results-meta" style={{ marginTop: 8 }}>
                    {loading ? "جارٍ تحميل القصص..." : filtered.length + " قصة"}
                </p>
            </div>

            {loading ? (
                <div className="story-grid">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="story-card" style={{ padding: 12 }}>
                            <div
                                style={{ width: "100%", height: 170, borderRadius: 12, background: "#eee" }}
                            />
                            <div
                                style={{
                                    height: 16,
                                    marginTop: 12,
                                    width: "70%",
                                    background: "#eee",
                                    borderRadius: 8,
                                }}
                            />
                            <div
                                style={{
                                    height: 12,
                                    marginTop: 8,
                                    width: "40%",
                                    background: "#eee",
                                    borderRadius: 8,
                                }}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="story-grid">
                    {filtered.map((s) => (
                        <div className="story-card" key={s.id}>
                            <div className="story-card-image-wrapper">
                                <img
                                    src={s.cover}
                                    alt={s.title}
                                    className="story-card-image"
                                    loading="lazy"
                                    width={640}
                                    height={430}
                                />
                                <div className="story-card-rating">
                                    <Star size={14} color="#f5c518" /> {safeRating(s.rating)}
                                </div>
                            </div>

                            <div className="story-card-body">
                                <h3 className="story-card-title">{s.title}</h3>

                                <div className="story-card-info-row">
                  <span className="story-card-info-item">
                    <Calendar size={14} /> {formatDate(s.date)}
                  </span>
                                    <span className="story-card-info-item">
                    <Baby size={14} /> {s.ageRange}
                  </span>
                                </div>

                                <p className="story-card-topic">
                                    {s.topicRaw} • {s.moral}
                                </p>
                                <p className="story-card-comments">💬 {s.commentsCount} تعليقات</p>

                                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                                    <Link to={"/story/" + s.id} className="story-card-btn" target="_self">
                                        قراءة
                                    </Link>

                                    {isAdmin && (
                                        <button
                                            onClick={() => setModal({ show: true, storyId: s.id })}
                                            className="story-card-btn-delete"
                                        >
                                            حذف
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {modal.show && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <p>هل أنت متأكد من حذف هذه القصة؟</p>
                        <div
                            style={{
                                display: "flex",
                                gap: 12,
                                justifyContent: "flex-end",
                                marginTop: 16,
                            }}
                        >
                            <button
                                className="story-card-btn-cancel"
                                onClick={() => setModal({ show: false, storyId: null })}
                            >
                                لا
                            </button>
                            <button
                                className="story-card-btn-confirm"
                                onClick={async () => {
                                    try {
                                        await deleteStory(modal.storyId, user.token);

                                        setStories((prev) =>
                                            prev.filter((x) => x._id !== modal.storyId)
                                        );

                                        setModal({ show: false, storyId: null });
                                    } catch (err) {
                                        console.error("Delete failed:", err);
                                    }
                                }}
                            >
                                نعم
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function formatDate(iso) {
    if (!iso) return "—";
    try {
        return new Date(iso).toLocaleDateString("ar-SA");
    } catch {
        return iso;
    }
}
function safeRating(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n.toFixed(1) : "0.0";
}

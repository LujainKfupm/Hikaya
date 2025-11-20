import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getStories, deleteStoryById } from "../mocks/mockApi";
import { Star, Calendar, Baby } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function StoryLibrary() {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";

    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ show: false, storyId: null });

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const data = await getStories({ publicOnly: false, sortBy: "date_desc" });
                if (!alive) return;
                setStories(data || []);
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
            stories.map((s) => ({
                id: s.id,
                title: s.title,
                author: s.author ?? "—",
                rating: Number(s.rating ?? s.ratingAvg ?? 0),
                moral: s.moral ?? s.values?.[0] ?? "—",
                topic: s.topic ?? s.topics?.[0] ?? "—",
                cover: s.cover,
                ageRange: s.ageRange ?? "—",
                date: s.createdAt ?? s.date,
                commentsCount: s.commentsCount ?? s.comments?.length ?? 0,
            })),
        [stories]
    );

    const showDeleteModal = (id) => setModal({ show: true, storyId: id });

    const handleConfirmDelete = async () => {
        const id = modal.storyId;
        setModal({ show: false, storyId: null });
        await deleteStoryById(id);
        setStories((prev) => prev.filter((s) => s.id !== id));
    };

    const handleCancelDelete = () => setModal({ show: false, storyId: null });

    return (
        <>
            <h1>المكتبة العامة</h1>

            <p className="results-meta">
                {loading ? "جارٍ جلب القصص..." : (normalized.length+"قصة")}
            </p>

            {loading ? (
                <div className="story-grid">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="story-card" style={{ padding: 12 }}>
                            <div
                                style={{
                                    width: "100%",
                                    height: 170,
                                    borderRadius: 12,
                                    background: "#eee",
                                }}
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
                    {normalized.map((s) => (
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
                                <p className="story-card-meta">المؤلف: {s.author}</p>

                                <div className="story-card-info-row">
                  <span className="story-card-info-item">
                    <Calendar size={14} /> {formatDate(s.date)}
                  </span>
                                    <span className="story-card-info-item">
                    <Baby size={14} /> {s.ageRange}
                  </span>
                                </div>

                                <p className="story-card-topic">
                                    {s.topic} • {s.moral}
                                </p>
                                <p className="story-card-comments">
                                    💬 {s.commentsCount} تعليقات
                                </p>

                                <div
                                    style={{
                                        display: "flex",
                                        gap: "8px",
                                        marginTop: "8px",
                                    }}
                                >
                                    <Link
                                        to={"/story/" + s.id}
                                        className="story-card-btn"
                                        target="_self"
                                    >
                                        قراءة
                                    </Link>

                                    {isAdmin && (
                                        <button
                                            onClick={() => showDeleteModal(s.id)}
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
                                gap: "12px",
                                justifyContent: "flex-end",
                                marginTop: "16px",
                            }}
                        >
                            <button
                                className="story-card-btn-cancel"
                                onClick={handleCancelDelete}
                            >
                                لا
                            </button>
                            <button
                                className="story-card-btn-confirm"
                                onClick={handleConfirmDelete}
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
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchStoryById, rateStory, addComment, deleteComment} from "../api"; // 🔥 backend, not mocks
import { Star, Calendar, Baby, User, Lock } from "lucide-react";

import cover from "../assets/ai story cover.jpg";
import AuthDialog from "../components/AuthDialog";

function resolveCover(story) {
    return cover;
}


function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <p>{message}</p>
                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onCancel}>
                        إلغاء
                    </button>
                    <button className="btn-confirm" onClick={onConfirm}>
                        حذف
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function StoryView() {
    const { id } = useParams();
    const { user } = useAuth();

    const [story, setStory] = useState(null); // ← normalized view model
    const [modal, setModal] = useState({ show: false, commentId: null });

    const [hoverRating, setHoverRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(0);

    const [authOpen, setAuthOpen] = useState(false);

    const [newComment, setNewComment] = useState("");
    const canComment = !!user && user.role !== "guest";

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const data = await fetchStoryById(id);

                const ratingCount = Array.isArray(data.ratings) ? data.ratings.length : 0;
                const ratingSum = ratingCount
                    ? data.ratings.reduce((sum, r) => sum + (r.value ?? 0), 0)
                    : 0;
                const ratingAvg = ratingCount ? ratingSum / ratingCount : 0;

                const comments = Array.isArray(data.comments)
                    ? data.comments.map((c) => ({
                        id: c._id?.toString() || c.id,
                        name: c.name || "مستخدم",
                        text: c.text || "",
                        date: c.date || c.createdAt,
                    }))
                    : [];

                const ageRange =
                    typeof data.age === "number"
                        ? data.age <= 5
                            ? "3-5"
                            : data.age <= 8
                                ? "6-8"
                                : "9-12"
                        : "—";

                const view = {
                    id: data._id,
                    title: data.title || `قصة ${data.heroName || "بدون عنوان"}`,
                    author: data.user?.name ?? "—",
                    date: data.createdAt,
                    ageRange,
                    moral: data.morals?.join("، ") || "—",
                    topic: data.topics?.[0] || "—",
                    body: data.content,
                    rating: ratingAvg,
                    ratingAvg,
                    ratingsCount: ratingCount,
                    ratingCount: ratingCount,
                    comments,
                };

                setStory(view);

            } catch (err) {
                console.error(err);
                if (alive) setStory({ notFound: true });
            }
        })();

        return () => {
            alive = false;
        };
    }, [id]);

    const showConfirm = (commentId) => setModal({ show: true, commentId });

    const handleConfirm = async () => {
        const token = user.token;

        await deleteComment(id, modal.commentId, token);

        setStory((prev) => ({
            ...prev,
            comments: prev.comments.filter((c) => c._id !== modal.commentId),
        }));

        setModal({ show: false, commentId: null });
    };


    const handleCancel = () => setModal({ show: false, commentId: null });

    function formatDate(iso) {
        if (!iso) return "—";
        try {
            const d = new Date(iso);
            return d.toLocaleDateString("ar-SA");
        } catch {
            return iso;
        }
    }

    const canRate = !!user;

    const token = user?.token;

    const handleRate = async (value) => {
        if (!user) return setAuthOpen(true);

        const data = await rateStory(id, value, token);

        setSelectedRating(value);
        setStory((prev) => ({
            ...prev,
            ratingAvg: data.ratingAvg,
            ratingsCount: data.ratingCount,
        }));
    };


    const handlePostComment = async () => {
        if (!user) return setAuthOpen(true);

        const token = user.token;
        const txt = newComment.trim();
        if (!txt) return;

        const res = await addComment(id, txt, token);

        const normalizedComment = {
            id: res.comment._id,
            name: res.comment.name,
            text: res.comment.text,
            date: res.comment.date,
        };

        setStory((prev) => ({
            ...prev,
            comments: [...(prev.comments || []), normalizedComment],
        }));


        setNewComment("");
    };

    if (!story) return <p>جاري تحميل القصة...</p>;
    if (story.notFound) return <p>لم يتم العثور على القصة.</p>;

    return (
        <>
            <div className="back-row">
                <Link to="/library" className="back-link">
                    → العودة إلى المكتبة
                </Link>
            </div>

            <div className="cover-wrap">
                <img src={resolveCover(story)} alt={story.title} className="cover-img" />
            </div>

            <h1 className="story-title">{story.title}</h1>

            <div className="info-row">
        <span className="info-item">
          <User size={16} /> {story.author ?? "—"}
        </span>
                <span className="info-item">
          <Calendar size={16} /> {formatDate(story.date)}
        </span>
                <span className="info-item">
          <Baby size={16} /> {story.ageRange ?? "—"} سنوات
        </span>
            </div>

            <div className="rating-box">
                <Star size={18} color="#000" />
                <span className="rating-value">
          {Number(story.rating ?? story.ratingAvg ?? 0).toFixed(1)}
        </span>
                <span className="rating-count">
          ({story.ratingsCount ?? story.ratingCount ?? 0} تقييم)
        </span>
            </div>

            <div className="moral-box">
                <strong>العِبرة:</strong> {story.moral ?? "—"}
            </div>

            <div className="body-text">
                {String(story.body || "")
                    .split("\n")
                    .map((p, i) => (
                        <p key={i}>{p}</p>
                    ))}
            </div>

            <div
                className="rate-strip"
                style={{
                    margin: "14px 0 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <span style={{ fontWeight: 700, color: "#111" }}>قيّم هذه القصة:</span>
                {[1, 2, 3, 4, 5].map((n) => {
                    const active = canRate
                        ? hoverRating
                            ? n <= hoverRating
                            : n <= selectedRating
                        : false;
                    return (
                        <button
                            key={n}
                            type="button"
                            aria-label={"rate-" + n}
                            onMouseEnter={() => canRate && setHoverRating(n)}
                            onMouseLeave={() => canRate && setHoverRating(0)}
                            onClick={() => handleRate(n)}
                            disabled={!canRate}
                            style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                cursor: canRate ? "pointer" : "not-allowed",
                                opacity: canRate ? 1 : 0.5,
                                lineHeight: 0,
                            }}
                        >
                            <Star
                                size={22}
                                color={active ? "#A7D3F6" : "#999"}
                                fill={active ? "#A7D3F6" : "transparent"}
                            />
                        </button>
                    );
                })}
                {!canRate && (
                    <button
                        type="button"
                        className="btn"
                        onClick={() => setAuthOpen(true)}
                        style={{
                            marginInlineStart: 8,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                        }}
                    >
                        <Lock size={16} /> سجّل دخولك للتقييم
                    </button>
                )}
                {canRate && selectedRating > 0 && (
                    <span style={{ color: "#555", fontSize: ".9rem" }}>
            شكراً! ({selectedRating} / 5)
          </span>
                )}
            </div>

            <div className="comment-box">
                <h3>التعليقات</h3>

                {canComment ? (
                    <div className="comment-input-wrap">
            <textarea
                className="comment-input"
                placeholder="اكتب تعليقك هنا..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
            />
                        <button
                            className="comment-send-btn"
                            onClick={handlePostComment}
                            disabled={!newComment.trim()}
                            title="نشر التعليق"
                        >
                            نشر التعليق
                        </button>
                    </div>
                ) : (
                    <p style={{ color: "#777", margin: "10px 0 14px" }}>
                        يجب تسجيل الدخول لكتابة تعليق.
                        <button
                            type="button"
                            className="btn"
                            onClick={() => setAuthOpen(true)}
                            style={{ marginInlineStart: 8 }}
                        >
                            تسجيل الدخول
                        </button>
                    </p>
                )}

                {story.comments && story.comments.length > 0 ? (
                    story.comments.map((c) => (
                        <div key={c.id} className="comment-item">
                            <p className="comment-meta">
                                <span className="comment-name">{c.name}</span>
                                <span className="comment-date">{formatDate(c.date)}</span>
                            </p>
                            <p>{c.text}</p>
                            {user?.role === "admin" && (
                                <button
                                    className="btn-delete"
                                    onClick={() => showConfirm(c.id)}
                                >
                                    حذف
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="no-comments">لا توجد تعليقات بعد.</p>
                )}
            </div>

            {modal.show && (
                <ConfirmModal
                    message="هل أنت متأكد من حذف هذا التعليق؟"
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}

            <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
        </>
    );
}

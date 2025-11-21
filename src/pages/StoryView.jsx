import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getStoryById, deleteCommentById } from "../mocks/mockApi";
import { Star, Calendar, Baby, User, Lock } from "lucide-react";

import drawingContest from "../assets/drawing_contest.png";
import spaceJourney from "../assets/space_journey.png";
import userLibrary from "../assets/user_library.png";

import AuthDialog from "../components/AuthDialog"; // تأكدي من المسار الصحيح

function resolveCover(story) {
    const idKey = String(story?.id || "");
    const title = String(story?.title || "").toLowerCase();
    const topic = String(story?.topic || "").toLowerCase();

    if (idKey === "102") return spaceJourney;
    if (idKey === "103") return drawingContest;

    if (title.includes("فضاء") || topic.includes("فضاء")) return spaceJourney;
    if (title.includes("رسم") || title.includes("عبدالله") || title.includes("عبد الله")) return drawingContest;
    if (title.includes("كنز") || title.includes("سارة")) return userLibrary;

    return userLibrary;
}

function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <p>{message}</p>
                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onCancel}>إلغاء</button>
                    <button className="btn-confirm" onClick={onConfirm}>حذف</button>
                </div>
            </div>
        </div>
    );
}

export default function StoryView() {
    const { id } = useParams();
    const { user } = useAuth();

    const [story, setStory] = useState(null);
    const [modal, setModal] = useState({ show: false, commentId: null });

    // التقييم
    const [hoverRating, setHoverRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(0);

    // Dialog الدخول
    const [authOpen, setAuthOpen] = useState(false);

    // التعليقات
    const [newComment, setNewComment] = useState("");
    const canComment = !!user && user.role !== "guest";

    useEffect(() => {
        let alive = true;
        getStoryById(id)
            .then((data) => {
                if (!alive) return;
                setStory(data || { notFound: true });
            })
            .catch(() => {
                if (alive) setStory({ notFound: true });
            });
        return () => { alive = false; };
    }, [id]);

    const showConfirm = (commentId) => setModal({ show: true, commentId });

    const handleConfirm = () => {
        if (!modal.commentId) return;
        deleteCommentById(modal.commentId).then(() => {
            setStory((prev) => ({
                ...prev,
                comments: (prev.comments || []).filter((c) => c.id !== modal.commentId),
            }));
            setModal({ show: false, commentId: null });
        });
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
    const handleRate = (value) => {
        if (!canRate) return;
        setSelectedRating(value);
        setStory((prev) => {
            if (!prev) return prev;
            const currentAvg = Number(prev.rating ?? prev.ratingAvg ?? 0);
            const currentCount = Number(prev.ratingsCount ?? prev.ratingCount ?? 0);
            const nextCount = currentCount + 1;
            const nextAvg = (currentAvg * currentCount + value) / (nextCount || 1);
            return {
                ...prev,
                rating: nextAvg,
                ratingAvg: nextAvg,
                ratingsCount: nextCount,
                ratingCount: nextCount,
            };
        });
    };

    const handlePostComment = () => {
        const txt = (newComment || "").trim();
        if (!txt) return;

        const nameFromUser =
            user?.name ||
            user?.displayName ||
            (user?.email ? user.email.split("@")[0] : null) ||
            "مستخدم";

        const comment = {
            id: Date.now(), // مؤقت
            name: nameFromUser,
            date: new Date().toISOString(),
            text: txt,
        };

        setStory((prev) => ({
            ...prev,
            comments: [...(prev.comments || []), comment],
        }));
        setNewComment("");
    };

    if (!story) return <p>جاري تحميل القصة...</p>;
    if (story.notFound) return <p>لم يتم العثور على القصة.</p>;

    return (
        <>
            {/* رجوع — السهم على اليمين */}
            <div className="back-row">
                <Link to="/library" className="back-link">العودة إلى المكتبة →</Link>
            </div>

            {/* الغلاف */}
            <div className="cover-wrap">
                <img src={resolveCover(story)} alt={story.title} className="cover-img" />
            </div>

            {/* العنوان + معلومات القصة */}
            <h1 className="story-title">{story.title}</h1>

            <div className="info-row">
                <span className="info-item"><User size={16} /> {story.author ?? "—"}</span>
                <span className="info-item"><Calendar size={16} /> {formatDate(story.date)}</span>
                <span className="info-item"><Baby size={16} /> {story.ageRange ?? "—"} سنوات</span>
            </div>

            <div className="rating-box">
                <Star size={18} color="#000" />
                <span className="rating-value">{Number(story.rating ?? story.ratingAvg ?? 0).toFixed(1)}</span>
                <span className="rating-count">({story.ratingsCount ?? story.ratingCount ?? 0} تقييم)</span>
            </div>

            <div className="moral-box">
                <strong>العِبرة:</strong> {story.moral ?? story.values?.[0] ?? "—"}
            </div>

            <div className="body-text">{story.body ?? story.content}</div>

            {/* شريط التقييم */}
            <div className="rate-strip" style={{ margin: "14px 0 18px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontWeight: 700, color: "#111" }}>قيّم هذه القصة:</span>
                {[1, 2, 3, 4, 5].map((n) => {
                    const active = canRate ? (hoverRating ? n <= hoverRating : n <= selectedRating) : false;
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
                                lineHeight: 0
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
                        style={{ marginInlineStart: 8, display: "inline-flex", alignItems: "center", gap: 6 }}
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

            {/* التعليقات */}
            <div className="comment-box">
                <h3>التعليقات</h3>

                {/* إدخال تعليق — يظهر فقط لغير الضيوف */}
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

                {/* قائمة التعليقات */}
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

            {/* Dialog الدخول */}
            <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
        </>
    );
}









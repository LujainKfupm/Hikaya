import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getStoryById, deleteCommentById } from "../mocks/mockApi";
import { Star, Calendar, Baby, User } from "lucide-react";

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

    useEffect(() => {
        getStoryById(id).then(data => setStory(data));
    }, [id]);

    if (!story) return <p>جاري تحميل القصة...</p>;

    const showConfirm = (commentId) => {
        setModal({ show: true, commentId });
    };

    const handleConfirm = () => {
        if (!modal.commentId) return;
        deleteCommentById(modal.commentId).then(() => {
            setStory(prev => ({
                ...prev,
                comments: prev.comments.filter(c => c.id !== modal.commentId),
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
    return (
        <>
            <div className="back-row">
                <Link to="/library" className="back-link">← العودة إلى المكتبة</Link>
            </div>

            <div className="cover-wrap">
                <img src={story.cover} alt={story.title} className="cover-img" />
            </div>

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

            <div className="comment-box">
                <h3>التعليقات</h3>
                {story.comments && story.comments.length > 0 ? (
                    story.comments.map(c => (
                        <div key={c.id} className="comment-item">
                            <p><strong>{c.name}</strong> — {formatDate(c.date)}</p>
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
        </>
    );
}



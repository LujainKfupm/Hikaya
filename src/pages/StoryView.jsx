import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getStoryById, deleteCommentById } from "../mocks/mockApi";
import { Star, Calendar, Baby, User } from "lucide-react";

function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div style={modalOverlay}>
            <div style={modalBox}>
                <p>{message}</p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "16px" }}>
                    <button style={btnCancel} onClick={onCancel}>إلغاء</button>
                    <button style={btnConfirm} onClick={onConfirm}>حذف</button>
                </div>
            </div>
        </div>
    );
}

export default function StoryView() {
    const { id } = useParams();
    const { user } = useAuth();
    const [story, setStory] = useState(null);
    const [modal, setModal] = useState({ show: false, action: null, message: "" });

    useEffect(() => {
        getStoryById(id).then((data) => setStory(data));
    }, [id]);

    if (!story) return <p>جاري تحميل القصة...</p>;

    const showConfirm = (message, action) => {
        setModal({ show: true, message, action });
    };

    const handleConfirm = () => {
        if (modal.action) modal.action();
        setModal({ show: false, action: null, message: "" });
    };

    const handleCancel = () => {
        setModal({ show: false, action: null, message: "" });
    };

    const handleDeleteComment = (commentId) => {
        showConfirm("هل أنت متأكد من حذف هذا التعليق؟", () => {
            deleteCommentById(commentId).then(() => {
                setStory((prev) => ({
                    ...prev,
                    comments: prev.comments.filter((c) => c.id !== commentId),
                }));
            });
        });
    };

    return (
        <>
            <div style={backRow}>
                <Link to="/library" style={backLink}>← العودة إلى المكتبة</Link>
            </div>

            <div style={coverWrap}>
                <img src={story.cover} alt={story.title} style={coverImg} />
            </div>

            <h1 style={title}>{story.title}</h1>
            <div style={infoRow}>
                <span style={infoItem}><User size={16} /> {story.author ?? "—"}</span>
                <span style={infoItem}><Calendar size={16} /> {formatDate(story.date)}</span>
                <span style={infoItem}><Baby size={16} /> {story.ageRange ?? "—"} سنوات</span>
            </div>

            <div style={ratingBox}>
                <Star size={18} color="#f5c518" />
                <span>{Number(story.rating ?? story.ratingAvg ?? 0).toFixed(1)}</span>
                <span style={ratingSmall}>({story.ratingsCount ?? story.ratingCount ?? 0} تقييم)</span>
            </div>

            <div style={moralBox}>
                <strong>العِبرة:</strong> {story.moral ?? story.values?.[0] ?? "—"}
            </div>

            <div style={bodyText}>{story.body ?? story.content}</div>

            <div style={commentBox}>
                <h3 style={subTitle}>التعليقات</h3>
                {story.comments && story.comments.length > 0 ? (
                    story.comments.map((c) => (
                        <div key={c.id} style={commentItem}>
                            <p><strong>{c.name}</strong> — {formatDate(c.date)}</p>
                            <p>{c.text}</p>
                            {user?.role === "admin" && (
                                <button onClick={() => handleDeleteComment(c.id)} style={deleteBtn}>حذف</button>
                            )}
                        </div>
                    ))
                ) : (
                    <p style={{ color: "#777" }}>لا توجد تعليقات بعد.</p>
                )}
            </div>

            {modal.show && <ConfirmModal message={modal.message} onConfirm={handleConfirm} onCancel={handleCancel} />}
        </>
    );
}

const backRow = { marginBottom: "12px" };
const backLink = { color: "#4A90E2", textDecoration: "none" };
const coverWrap = { borderRadius: "14px", overflow: "hidden", marginBottom: "16px" };
const coverImg = { width: "100%", height: "auto", borderRadius: "14px" };
const title = { fontSize: "1.8rem", marginBottom: "6px" };
const infoRow = { display: "flex", gap: "10px", flexWrap: "wrap", color: "#555", fontSize: ".9rem" };
const infoItem = { display: "flex", alignItems: "center", gap: "4px" };
const ratingBox = { display: "flex", alignItems: "center", gap: "6px", margin: "10px 0" };
const ratingSmall = { color: "#777", fontSize: ".85rem" };
const moralBox = { background: "#f4f6f8", padding: "10px 14px", borderRadius: "10px", marginBottom: "16px" };
const bodyText = { lineHeight: "1.7", fontSize: "1rem", color: "#333", whiteSpace: "pre-line", marginBottom: "20px" };
const commentBox = { marginTop: "24px", padding: "16px", border: "1px solid #eee", borderRadius: "10px" };
const subTitle = { margin: "0 0 10px 0" };
const commentItem = { borderTop: "1px solid #eee", paddingTop: "8px", marginTop: "8px" };
const deleteBtn = { background: "#e74c3c", color: "#fff", border: "none", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", marginTop: "6px" };
const modalOverlay = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 };
const modalBox = { background: "#fff", padding: "20px", borderRadius: "12px", maxWidth: "300px", width: "100%", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" };
const btnConfirm = { padding: "6px 12px", background: "#E74C3C", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" };
const btnCancel = { padding: "6px 12px", background: "#ccc", color: "#000", border: "none", borderRadius: "8px", cursor: "pointer" };


function formatDate(iso) {
    if (!iso) return "—";
    try {
        const d = new Date(iso);
        return d.toLocaleDateString("ar-SA");
    } catch {
        return iso;
    }
}


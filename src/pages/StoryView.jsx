import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getStoryById } from "../mocks/mockApi";
import { Star, Calendar, Baby, MessageSquare, User, Share2 } from "lucide-react";

export default function StoryView() {
    const { id } = useParams();
    const [story, setStory] = useState(null);

    useEffect(() => {
        getStoryById(id).then((data) => setStory(data));
    }, [id]);

    if (!story) return <p>جاري تحميل القصة...</p>;

    return (
        <>
            {/* ===== العودة ===== */}
            <div style={backRow}>
                <Link to="/library" style={backLink}>← العودة إلى المكتبة</Link>
            </div>

            {/* ===== الغلاف ===== */}
            <div style={coverWrap}>
                <img src={story.cover} alt={story.title} style={coverImg} />
            </div>

            {/* ===== العنوان والمعلومات ===== */}
            <h1 style={title}>{story.title}</h1>
            <div style={infoRow}>
                <span style={infoItem}><User size={16}/> {story.author ?? "—"}</span>
                <span style={infoItem}><Calendar size={16}/> {formatDate(story.date)}</span>
                <span style={infoItem}><Baby size={16}/> {story.ageRange ?? "—"} سنوات</span>
            </div>

            <div style={ratingBox}>
                <Star size={18} color="#f5c518" />
                <span>{Number(story.rating).toFixed(1)}</span>
                <span style={ratingSmall}>({story.ratingsCount ?? 0} تقييم)</span>
            </div>

            <div style={moralBox}>
                <strong>العِبرة:</strong> {story.moral ?? "—"}
            </div>

            {/* ===== نص القصة ===== */}
            <p style={bodyText}>{story.body}</p>

            {/* ===== التعليقات ===== */}
            <div className="card" style={commentBox}>
                <h3 style={subTitle}>التعليقات</h3>
                {story.comments && story.comments.length > 0 ? (
                    story.comments.map((c) => (
                        <div key={c.id} style={commentItem}>
                            <p><strong>{c.name}</strong> — {formatDate(c.date)}</p>
                            <p>{c.text}</p>
                        </div>
                    ))
                ) : (
                    <p style={{ color: "#777" }}>لا توجد تعليقات بعد.</p>
                )}
            </div>

            {/* ===== أزرار المشاركة ===== */}
            <div style={shareRow}>
                <Share2 size={16}/> <span>مشاركة القصة</span>
            </div>
        </>
    );
}

/* ============ STYLES ============ */
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
const bodyText = { lineHeight: "1.7", fontSize: "1rem", color: "#333", whiteSpace: "pre-line" };

const commentBox = { marginTop: "24px", padding: "16px", border: "1px solid #eee", borderRadius: "10px" };
const subTitle = { margin: "0 0 10px 0" };
const commentItem = { borderTop: "1px solid #eee", paddingTop: "8px", marginTop: "8px" };

const shareRow = { display: "flex", alignItems: "center", gap: "6px", color: "#4A90E2", marginTop: "20px", cursor: "pointer" };

/* ============ Helper ============ */
function formatDate(iso) {
    if (!iso) return "—";
    try {
        const d = new Date(iso);
        return d.toLocaleDateString("ar-SA");
    } catch {
        return iso;
    }
}
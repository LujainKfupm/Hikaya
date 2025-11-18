import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getStories, deleteStoryById } from "../mocks/mockApi";
import { Star, Calendar, Baby } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const MOCK = [];

export default function StoryLibrary() {
    const [, force] = useState(0);
    const mounted = useRef(false);
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";

    useEffect(() => {
        mounted.current = true;
        getStories({ publicOnly: false, sortBy: "date_desc" }).then((data) => {
            if (!mounted.current) return;
            const normalized = data.map((s) => ({
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
            }));
            MOCK.splice(0, MOCK.length, ...normalized);
            force((x) => x + 1);
        });

        return () => {
            mounted.current = false;
        };
    }, []);

    function handleDelete(id) {
        if (!window.confirm("هل أنت متأكد من حذف هذه القصة؟")) return;
        deleteStoryById(id).then(() => {
            const index = MOCK.findIndex((s) => s.id === id);
            if (index !== -1) MOCK.splice(index, 1);
            force((x) => x + 1);
        });
    }

    return (
        <>
            <h1>المكتبة العامة</h1>
            <div style={noticeStyle}>
                <strong>📚 تصفح كل القصص:</strong> يمكنك اكتشاف جميع القصص المتاحة في الموقع.
            </div>
            <div className="grid" style={gridStyle}>
                {MOCK.map((s) => (
                    <div className="card" key={s.id} style={cardStyle}>
                        <div style={coverWrap}>
                            <img src={s.cover} alt={s.title} style={coverImg} />
                            <div style={ratingBadge}>
                                <Star size={14} color="#f5c518" />
                                <span>{safeRating(s.rating)}</span>
                            </div>
                        </div>
                        <div style={bodyStyle}>
                            <h3 style={titleStyle}>{s.title}</h3>
                            <p style={metaStyle}>المؤلف: {s.author}</p>
                            <div style={infoRow}>
                                <span style={infoItem}>
                                    <Calendar size={14} /> {formatDate(s.date)}
                                </span>
                                <span style={infoItem}>
                                    <Baby size={14} /> {s.ageRange}
                                </span>
                            </div>
                            <p style={topicStyle}>
                                {s.topic} • {s.moral}
                            </p>
                            <p style={commentsStyle}>💬 {s.commentsCount} تعليقات</p>
                            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                                <Link to={"/story/" + s.id} className="btn" style={btnStyle}>
                                    قراءة
                                </Link>
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDelete(s.id)}
                                        className="btn delete-btn"
                                    >
                                        حذف
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

/* ==================== STYLES ==================== */
const noticeStyle = {
    background: "#eef5ff",
    color: "#0f2f66",
    border: "1px solid #dbe7ff",
    padding: "10px 14px",
    borderRadius: "12px",
    margin: "10px 0 20px",
};

const gridStyle = {
    display: "grid",
    gap: "16px",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
};

const cardStyle = {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 2px 6px rgba(0,0,0,.05)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
};

const coverWrap = {
    position: "relative",
};

const coverImg = {
    width: "100%",
    height: "170px",
    objectFit: "cover",
    display: "block",
};

const ratingBadge = {
    position: "absolute",
    top: "10px",
    left: "10px",
    background: "rgba(255,255,255,0.9)",
    borderRadius: "12px",
    padding: "2px 8px",
    fontSize: ".9rem",
    display: "flex",
    alignItems: "center",
    gap: "4px",
};

const bodyStyle = {
    padding: "12px 14px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
};

const titleStyle = { margin: "0 0 4px 0", fontSize: "1.05rem" };
const metaStyle = { margin: "0", color: "#555", fontSize: ".9rem" };
const infoRow = { display: "flex", justifyContent: "space-between", color: "#777", fontSize: ".85rem" };
const infoItem = { display: "flex", alignItems: "center", gap: "4px" };
const topicStyle = { margin: "4px 0", color: "#333", fontSize: ".9rem" };
const commentsStyle = { color: "#888", fontSize: ".85rem" };
const btnStyle = {
    alignSelf: "start",
    background: "#4A90E2",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: "10px",
    textDecoration: "none",
    fontSize: ".9rem",
};

/* ==================== Helpers ==================== */
function formatDate(iso) {
    if (!iso) return "—";
    try {
        const d = new Date(iso);
        return d.toLocaleDateString("ar-SA");
    } catch {
        return iso;
    }
}

function safeRating(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n.toFixed(1) : "0.0";
}

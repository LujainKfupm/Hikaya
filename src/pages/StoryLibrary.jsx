//import all required dependencies
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getStories, deleteStoryById } from "../mocks/mockApi";
import { Star, Calendar, Baby } from "lucide-react";
import { useAuth } from "../context/AuthContext";
//temporary local array
const MOCK = [];

// reusable confirmation modal for delete actions
function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <p>{message}</p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "16px" }}>
                    <button className="story-card-btn-cancel" onClick={onCancel}>لا</button>
                    <button className="story-card-btn-confirm" onClick={onConfirm}>نعم</button>
                </div>
            </div>
        </div>
    );
}
// base setup for story library component (state, refs, auth, modal)
export default function StoryLibrary() {
    const [, force] = useState(0);
    const mounted = useRef(false);
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    const [modal, setModal] = useState({ show: false, storyId: null });
    // filters/search base state (topics multi, age single, sort single)
    const [showFilters, setShowFilters] = useState(false); // toggle filter panel
    const [searchTerm, setSearchTerm] = useState(""); // free text search
    const [selectedTopics, setSelectedTopics] = useState([]); // multi-select: topics
    const [selectedAge, setSelectedAge] = useState("all"); // single-select: age range
    const [sortBy, setSortBy] = useState("latest"); // single-select: latest | top_rated
    // static filter options (CSS styling is external, only classNames here)
    const TOPICS = useMemo(
        () => [
            "Adventure", "Nature", "Magic", "Animals", "Ocean", "Space",
            "Family", "Friendship", "Culture", "Music", "Sports",
            "Fantasy", "Science Fiction", "Perseverance", "Teamwork", "Environment",
        ],
        []
    );
    const AGE_RANGES = ["all", "3-5", "6-8", "9-12"];
    // fetch stories on mount and normalize data into MOCK
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
        return () => { mounted.current = false; };
    }, []);

    // handlers for showing, confirming, and cancelling story deletion
    const showDeleteModal = (id) => setModal({ show: true, storyId: id });
    const handleConfirmDelete = () => {
        if (!modal.storyId) return;
        deleteStoryById(modal.storyId).then(() => {
            const index = MOCK.findIndex((s) => s.id === modal.storyId);
            if (index !== -1) MOCK.splice(index, 1);
            force((x) => x + 1);
            setModal({ show: false, storyId: null });
        });
    };
    const handleCancelDelete = () => setModal({ show: false, storyId: null });
    // render stories list, info cards, and conditional confirm modal
    return (
        <>
            <h1>المكتبة العامة</h1>

            <div className="story-notice">
                <strong>📚 تصفح كل القصص:</strong> يمكنك اكتشاف جميع القصص المتاحة في الموقع.
            </div>

            <div className="story-grid">
                {MOCK.map((s) => (
                    <div className="story-card" key={s.id}>
                        <div className="story-card-image-wrapper">
                            <img src={s.cover} alt={s.title} className="story-card-image" />
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

                            <p className="story-card-topic">{s.topic} • {s.moral}</p>
                            <p className="story-card-comments">💬 {s.commentsCount} تعليقات</p>

                            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                                <Link to={"/story/" + s.id} className="story-card-btn">قراءة</Link>
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

            {modal.show && (
                <ConfirmModal
                    message="هل أنت متأكد من حذف هذه القصة؟"
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                />
            )}
        </>
    );
}
// helper functions to format date and safely handle rating display
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
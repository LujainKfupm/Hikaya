import { useEffect, useState } from "react";
import { BookOpen, Tag, Baby, Star } from "lucide-react";

const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_BASE = `${API_ROOT}/api`;

function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal-box">
                <p>{message}</p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "16px" }}>
                    <button type="button" className="admin-btn-cancel" onClick={onCancel}>إلغاء</button>
                    <button type="button" className="admin-btn-confirm" onClick={onConfirm}>حذف</button>
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [stories, setStories] = useState([]);

    const [modal, setModal] = useState({
        show: false,
        message: "",
        action: null,
    });

    const showConfirm = (message, action) => {
        setModal({ show: true, message, action });
    };

    const closeModal = () => {
        setModal({ show: false, message: "", action: null });
    };

    const handleConfirm = () => {
        if (modal.action) modal.action();
        closeModal();
    };

    // Fetch users (non-admin)
    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("hikaya_token");
            const res = await fetch(`${API_BASE}/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error("Failed to load users", error);
        }
    };

    // Fetch contact messages
    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem("hikaya_token");
            const res = await fetch(`${API_BASE}/contact`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();
            setMessages(data);
        } catch (error) {
            console.error("Failed to load messages", error);
        }
    };

    const fetchStories = async () => {
        try {
            const token = localStorage.getItem("hikaya_token");
            const res = await fetch(`${API_BASE}/stories`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "فشل في تحميل القصص");
            setStories(data);
        } catch (error) {
            console.error("Failed to load stories", error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchMessages();
        fetchStories();
    }, []);

    let publicCount = 0;
    let publicAvgRating = "0.0";
    let topTopic = "—";
    let topAgeGroup = "—";

    if (stories.length > 0) {
        const publicStories = stories.filter((s) => s.isPublic === true);
        publicCount = publicStories.length;

        if (publicStories.length > 0) {
            const publicAverages = publicStories.map((s) => {
                if (Array.isArray(s.ratings) && s.ratings.length > 0) {
                    const sum = s.ratings.reduce(
                        (acc, r) => acc + Number(r.value || 0),
                        0
                    );
                    return sum / s.ratings.length;
                }
                return Number(s.ratingAvg ?? s.rating ?? 0);
            });

            const avg =
                publicAverages.reduce((sum, v) => sum + v, 0) /
                publicAverages.length;

            publicAvgRating = avg.toFixed(1);
        }

        const topicCounts = {};
        for (const s of stories) {
            const topics = Array.isArray(s.topics) ? s.topics : [];
            for (const t of topics) {
                if (!t) continue;
                topicCounts[t] = (topicCounts[t] || 0) + 1;
            }
        }
        if (Object.keys(topicCounts).length > 0) {
            topTopic = Object.entries(topicCounts).reduce(
                (best, current) => (current[1] > best[1] ? current : best)
            )[0];
        }

        const ageCounts = { "3-5": 0, "6-8": 0, "9-12": 0 };

        for (const s of stories) {
            const age = Number(s.age);
            if (!Number.isFinite(age)) continue;

            if (age >= 3 && age <= 5) ageCounts["3-5"]++;
            else if (age >= 6 && age <= 8) ageCounts["6-8"]++;
            else if (age >= 9 && age <= 12) ageCounts["9-12"]++;
        }

        const ageEntries = Object.entries(ageCounts).filter(([, count]) => count > 0);
        if (ageEntries.length > 0) {
            topAgeGroup = ageEntries.reduce(
                (best, current) => (current[1] > best[1] ? current : best)
            )[0];
        }
    }

    // Delete user with confirmation modal
    const handleDeleteUser = (id) => {
        showConfirm("هل أنت متأكد من حذف هذا المستخدم؟", async () => {
            try {
                const token = localStorage.getItem("hikaya_token");

                const res = await fetch(`${API_BASE}/users/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "فشل الحذف");

                setUsers(prev => prev.filter(u => u._id !== id));
            } catch (error) {
                alert(error.message);
            }
        });
    };

    // Delete contact message
    const handleDeleteMessage = (id) => {
        showConfirm("هل أنت متأكد من حذف هذه الرسالة؟", async () => {
            try {
                const token = localStorage.getItem("hikaya_token");

                const res = await fetch(`${API_BASE}/contact/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "فشل الحذف");

                setMessages(prev => prev.filter(m => m._id !== id));
            } catch (error) {
                alert(error.message);
            }
        });
    };

    return (
        <div className="admin-container">
            <h1 className="admin-title">لوحة التحكم</h1>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                    gap: "16px",
                    marginBottom: "24px",
                }}
            >
                <div className="stat-card">
                    <BookOpen size={24} />
                    <p className="stat-label">القصص العامة</p>
                    <h2>{publicCount}</h2>
                </div>

                <div className="stat-card">
                    <Star size={24} />
                    <p className="stat-label">متوسط تقييم المكتبة العامة</p>
                    <h2>{publicAvgRating}</h2>
                </div>

                <div className="stat-card">
                    <Tag size={24} />
                    <p className="stat-label">أكثر موضوع استخداماً</p>
                    <h2>{topTopic}</h2>
                </div>

                <div className="stat-card">
                    <Baby size={24} />
                    <p className="stat-label">أكثر فئة عمرية</p>
                    <h2>{topAgeGroup === "—" ? "—" : `${topAgeGroup} سنوات`}</h2>
                </div>
            </div>

            {/* Users Section */}
            <section className="admin-section">
                <h2 className="admin-section-title">المستخدمون</h2>
                <div className="admin-card-grid">
                    {users.map(u => (
                        <div key={u._id} className="admin-card">
                            <p>{u.name}</p>
                            <p className="admin-email">{u.email}</p>
                            <button
                                type="button"
                                className="admin-btn-delete"
                                onClick={() => handleDeleteUser(u._id)}
                            >
                                حذف المستخدم
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Messages */}
            <section className="admin-section">
                <h2 className="admin-section-title">رسائل التواصل</h2>
                <div className="admin-card-grid">
                    {messages.map((m) => (
                        <div key={m._id} className="admin-card">
                            <p><strong>{m.name}</strong></p>
                            <p><a href={`mailto:${m.email}`} className="admin-email">{m.email}</a></p>
                            <p>{m.message}</p>

                            <button
                                type="button"
                                className="admin-btn-delete"
                                onClick={() => handleDeleteMessage(m._id)}
                            >
                                حذف الرسالة
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Confirm Modal */}
            {modal.show && (
                <ConfirmModal
                    message={modal.message}
                    onConfirm={handleConfirm}
                    onCancel={closeModal}
                />
            )}
        </div>
    );
}


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getStories,
    deleteStoryById,
    getUsers,
    deleteUserById,
    getComments,
    deleteCommentById,
    getCategories,
    addCategory,
    deleteCategory,
    getAgeGroups,
    addAgeGroup,
    deleteAgeGroup,
    getContactMessages,
    sendReply,
} from "../mocks/mockApi";
import { Star, Calendar, Baby, User, Mail } from "lucide-react";

export default function AdminDashboard() {
    // ---------- States ----------
    const [stories, setStories] = useState([]);
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [ageGroups, setAgeGroups] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [newAgeGroup, setNewAgeGroup] = useState("");

    // ---------- Fetch Data ----------
    useEffect(() => {
        getStories({ publicOnly: false }).then(setStories);
        getUsers().then(setUsers);
        getComments().then(setComments);
        getCategories().then(setCategories);
        getAgeGroups().then(setAgeGroups);
        getContactMessages().then(setMessages);
    }, []);

    // ---------- Handlers ----------
    function handleDeleteStory(id) {
        if (!window.confirm("هل أنت متأكد من حذف هذه القصة؟")) return;
        deleteStoryById(id).then(() => setStories((prev) => prev.filter((s) => s.id !== id)));
    }

    function handleDeleteUser(id) {
        if (!window.confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
        deleteUserById(id).then(() => setUsers((prev) => prev.filter((u) => u.id !== id)));
    }

    function handleDeleteComment(id) {
        if (!window.confirm("هل أنت متأكد من حذف هذا التعليق؟")) return;
        deleteCommentById(id).then(() => setComments((prev) => prev.filter((c) => c.id !== id)));
    }

    function handleAddCategory() {
        if (!newCategory.trim()) return;
        addCategory(newCategory).then(() => {
            setCategories((prev) => [...prev, newCategory]);
            setNewCategory("");
        });
    }

    function handleDeleteCategory(category) {
        deleteCategory(category).then(() => setCategories((prev) => prev.filter((c) => c !== category)));
    }

    function handleAddAgeGroup() {
        if (!newAgeGroup.trim()) return;
        addAgeGroup(newAgeGroup).then(() => {
            setAgeGroups((prev) => [...prev, newAgeGroup]);
            setNewAgeGroup("");
        });
    }

    function handleDeleteAgeGroup(age) {
        deleteAgeGroup(age).then(() => setAgeGroups((prev) => prev.filter((a) => a !== age)));
    }

    function handleReply(messageId) {
        const replyText = prompt("اكتب الرد هنا:");
        if (!replyText) return;
        sendReply(messageId, replyText).then(() => {
            setMessages((prev) =>
                prev.map((m) => (m.id === messageId ? { ...m, responded: true, reply: replyText } : m))
            );
        });
    }

    // ---------- Statistics ----------
    const totalUsers = users.length;
    const totalStories = stories.length;
    const totalComments = comments.length;
    const mostPopularTopics = [...new Set(stories.map((s) => s.topic))].slice(0, 5); // top 5

    // ---------- Render ----------
    return (
        <div className="admin-dashboard">
            <h1>لوحة تحكم المسؤول</h1>

            {/* ===== Stories ===== */}
            <section className="dashboard-section">
                <h2>القصص</h2>
                <div className="grid">
                    {stories.map((s) => (
                        <div className="card" key={s.id}>
                            <div className="cover-wrap">
                                <img src={s.cover} alt={s.title} className="story-cover" />
                                <div className="rating-badge">
                                    <Star size={14} color="#f5c518" /> {Number(s.rating ?? 0).toFixed(1)}
                                </div>
                            </div>
                            <div className="card-body">
                                <h3>{s.title}</h3>
                                <p>المؤلف: {s.author ?? "—"}</p>
                                <div className="info-row">
                  <span>
                    <Calendar size={14} /> {formatDate(s.date)}
                  </span>
                                    <span>
                    <Baby size={14} /> {s.ageRange ?? "—"}
                  </span>
                                </div>
                                <p className="topic">{s.topic} • {s.moral}</p>
                                <div className="admin-buttons">
                                    <Link to={`/story/${s.id}`} className="btn view-btn">عرض</Link>
                                    <button onClick={() => handleDeleteStory(s.id)} className="btn delete-btn">حذف</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== Users ===== */}
            <section className="dashboard-section">
                <h2>المستخدمون</h2>
                <table className="users-table">
                    <thead>
                    <tr>
                        <th>الاسم</th>
                        <th>البريد الإلكتروني</th>
                        <th>الدور</th>
                        <th>الإجراءات</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.name || "—"}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>
                                <button onClick={() => handleDeleteUser(u.id)} className="btn delete-btn">حذف</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </section>

            {/* ===== Comments ===== */}
            <section className="dashboard-section">
                <h2>التعليقات</h2>
                {comments.map((c) => (
                    <div key={c.id} className="comment-item">
                        <p><strong>{c.name}</strong> — {formatDate(c.date)}</p>
                        <p>{c.text}</p>
                        <button onClick={() => handleDeleteComment(c.id)} className="btn delete-btn">حذف</button>
                    </div>
                ))}
            </section>

            {/* ===== Categories & Age Groups ===== */}
            <section className="dashboard-section">
                <h2>الفئات</h2>
                <div className="category-list">
                    {categories.map((c) => (
                        <div key={c} className="category-item">
                            {c} <button onClick={() => handleDeleteCategory(c)} className="btn delete-btn">حذف</button>
                        </div>
                    ))}
                </div>
                <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="أدخل فئة جديدة" />
                <button onClick={handleAddCategory} className="btn add-btn">إضافة</button>

                <h2>الفئات العمرية</h2>
                <div className="agegroup-list">
                    {ageGroups.map((a) => (
                        <div key={a} className="category-item">
                            {a} <button onClick={() => handleDeleteAgeGroup(a)} className="btn delete-btn">حذف</button>
                        </div>
                    ))}
                </div>
                <input value={newAgeGroup} onChange={(e) => setNewAgeGroup(e.target.value)} placeholder="أدخل الفئة العمرية" />
                <button onClick={handleAddAgeGroup} className="btn add-btn">إضافة</button>
            </section>

            {/* ===== Contact Messages ===== */}
            <section className="dashboard-section">
                <h2>رسائل التواصل</h2>
                {messages.map((m) => (
                    <div key={m.id} className="comment-item">
                        <p><strong>{m.name}</strong> — {m.email}</p>
                        <p>{m.text}</p>
                        {m.responded ? <span>تم الرد: {m.reply}</span> : (
                            <button onClick={() => handleReply(m.id)} className="btn view-btn">رد</button>
                        )}
                    </div>
                ))}
            </section>

            {/* ===== Statistics ===== */}
            <section className="dashboard-section">
                <h2>الإحصائيات</h2>
                <p>إجمالي المستخدمين: {totalUsers}</p>
                <p>إجمالي القصص: {totalStories}</p>
                <p>إجمالي التعليقات: {totalComments}</p>
                <p>أكثر الموضوعات شيوعاً: {mostPopularTopics.join(", ")}</p>
            </section>
        </div>
    );
}

// ---------- Helpers ----------
function formatDate(iso) {
    if (!iso) return "—";
    try {
        const d = new Date(iso);
        return d.toLocaleDateString("ar-SA");
    } catch {
        return iso;
    }
}
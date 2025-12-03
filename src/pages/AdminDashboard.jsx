import { useEffect, useState } from "react";
import {getUsers, deleteUserById, getComments,
    deleteCommentById, getCategories, addCategory,
    deleteCategory, getAgeGroups, addAgeGroup, deleteAgeGroup,
}
from "../mocks/mockApi";
import { getAdminMessages } from "../api.js";

const API_BASE = "http://localhost:3000/api";

function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal-box">
                <p>{message}</p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "16px" }}>
                    <button className="admin-btn-cancel" onClick={onCancel}>إلغاء</button>
                    <button className="admin-btn-confirm" onClick={onConfirm}>حذف</button>
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [ageGroups, setAgeGroups] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [newAgeGroup, setNewAgeGroup] = useState("");
    const [modal, setModal] = useState({ show: false, action: null, message: "" });
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        getUsers().then(setUsers);
        getComments().then(setComments);
        getCategories().then(setCategories);
        getAgeGroups().then(setAgeGroups);
    }, []);

    const showConfirm = (message, action) => {
        setModal({ show: true, message, action });
    };
    const handleConfirm = () => { if (modal.action) modal.action(); setModal({ show: false, action: null, message: "" }); };
    const handleCancel = () => setModal({ show: false, action: null, message: "" });

    const handleDeleteUser = (id) =>
        showConfirm("هل أنت متأكد من حذف هذا المستخدم؟", () =>
            deleteUserById(id).then(() => setUsers(users.filter(u => u.id !== id)))
        );

    const handleDeleteComment = (id) =>
        showConfirm("هل أنت متأكد من حذف هذا التعليق؟", () =>
            deleteCommentById(id).then(() => setComments(comments.filter(c => c.id !== id)))
        );

    const handleDeleteCategory = (cat) =>
        showConfirm("هل أنت متأكد من حذف هذه الفئة؟", () =>
            deleteCategory(cat).then(() => setCategories(categories.filter(c => c !== cat)))
        );

    const handleDeleteAgeGroup = (age) =>
        showConfirm("هل أنت متأكد من حذف هذه الفئة العمرية؟", () =>
            deleteAgeGroup(age).then(() => setAgeGroups(ageGroups.filter(a => a !== age)))
        );

    const handleAddCategory = () => {
        if (!newCategory) return;
        addCategory(newCategory).then(() => {
            setCategories([...categories, newCategory]);
            setNewCategory("");
        });
    };

    const handleAddAgeGroup = () => {
        if (!newAgeGroup) return;
        addAgeGroup(newAgeGroup).then(() => {
            setAgeGroups([...ageGroups, newAgeGroup]);
            setNewAgeGroup("");
        });
    };

    // inside useEffect
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem("hikaya_token"); // or however you store admin token
                const data = await getAdminMessages(token);
                setMessages(data);
            } catch (err) {
                console.error("Error fetching messages:", err);
            }
        };

        fetchMessages();
    }, []);

    const handleDeleteMessage = async (id) => {
        if (!window.confirm("هل أنت متأكد من حذف هذه الرسالة؟")) return;

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

            if (!res.ok) throw new Error(data.message || "فشل في حذف الرسالة");

            // Update state to remove deleted message
            setMessages(prev => prev.filter(m => m._id !== id));
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };



    return (
        <div className="admin-container">
            <h1 className="admin-title">لوحة التحكم</h1>

            {/* Users */}
            <section className="admin-section">
                <h2 className="admin-section-title">المستخدمون</h2>
                <div className="admin-card-grid">
                    {users.map(u => (
                        <div key={u.id} className="admin-card">
                            <p>{u.name}</p>
                            <p className="admin-email">{u.email}</p>
                            <button className="admin-btn-delete" onClick={() => handleDeleteUser(u.id)}>حذف</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Comments */}
            <section className="admin-section">
                <h2 className="admin-section-title">التعليقات</h2>
                <div className="admin-card-grid">
                    {comments.map(c => (
                        <div key={c.id} className="admin-card">
                            <p>{c.text}</p>
                            <p className="admin-meta">— {c.user}</p>
                            <button className="admin-btn-delete" onClick={() => handleDeleteComment(c.id)}>حذف</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories */}
            <section className="admin-section">
                <h2 className="admin-section-title">الفئات</h2>
                <div className="admin-input-row">
                    <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="فئة جديدة" className="admin-input" />
                    <button className="admin-btn-add" onClick={handleAddCategory}>إضافة</button>
                </div>
                <div className="admin-card-grid">
                    {categories.map(c => (
                        <div key={c} className="admin-card">
                            <p>{c}</p>
                            <button className="admin-btn-delete" onClick={() => handleDeleteCategory(c)}>حذف</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Age Groups */}
            <section className="admin-section">
                <h2 className="admin-section-title">الفئات العمرية</h2>
                <div className="admin-input-row">
                    <input value={newAgeGroup} onChange={e => setNewAgeGroup(e.target.value)} placeholder="فئة عمرية جديدة" className="admin-input" />
                    <button className="admin-btn-add" onClick={handleAddAgeGroup}>إضافة</button>
                </div>
                <div className="admin-card-grid">
                    {ageGroups.map(a => (
                        <div key={a} className="admin-card">
                            <p>{a}</p>
                            <button className="admin-btn-delete" onClick={() => handleDeleteAgeGroup(a)}>حذف</button>
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
                                className="admin-btn-delete"
                                onClick={() => handleDeleteMessage(m._id)}
                            >
                                حذف الرسالة
                            </button>
                        </div>
                    ))}
                </div>
            </section>


            {modal.show && <ConfirmModal message={modal.message} onConfirm={handleConfirm} onCancel={handleCancel} />}
        </div>
    );
}


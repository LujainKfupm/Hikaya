import { useEffect, useState } from "react";
import {
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
    getContactMessages
} from "../mocks/mockApi";

/* ===================== MODAL COMPONENT ===================== */
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

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [ageGroups, setAgeGroups] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [newAgeGroup, setNewAgeGroup] = useState("");

    const [modal, setModal] = useState({ show: false, action: null, message: "" });

    useEffect(() => {
        getUsers().then(setUsers);
        getComments().then(setComments);
        getCategories().then(setCategories);
        getAgeGroups().then(setAgeGroups);
        getContactMessages().then(setMessages);
    }, []);

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

    /* ===================== DELETION HANDLERS ===================== */
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

    /* ===================== ADD HANDLERS ===================== */
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

    return (
        <div style={container}>
            <h1 style={title}>لوحة التحكم</h1>

            {/* Users */}
            <section style={section}>
                <h2 style={sectionTitle}>المستخدمون</h2>
                <div style={cardGrid}>
                    {users.map(u => (
                        <div key={u.id} style={card}>
                            <p>{u.name}</p>
                            <p style={email}>{u.email}</p>
                            <button style={btnDelete} onClick={() => handleDeleteUser(u.id)}>حذف</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Comments */}
            <section style={section}>
                <h2 style={sectionTitle}>التعليقات</h2>
                <div style={cardGrid}>
                    {comments.map(c => (
                        <div key={c.id} style={card}>
                            <p>{c.text}</p>
                            <p style={meta}>— {c.user}</p>
                            <button style={btnDelete} onClick={() => handleDeleteComment(c.id)}>حذف</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories */}
            <section style={section}>
                <h2 style={sectionTitle}>الفئات</h2>
                <div style={inputRow}>
                    <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="فئة جديدة" style={input} />
                    <button style={btnAdd} onClick={handleAddCategory}>إضافة</button>
                </div>
                <div style={cardGrid}>
                    {categories.map(c => (
                        <div key={c} style={card}>
                            <p>{c}</p>
                            <button style={btnDelete} onClick={() => handleDeleteCategory(c)}>حذف</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Age Groups */}
            <section style={section}>
                <h2 style={sectionTitle}>الفئات العمرية</h2>
                <div style={inputRow}>
                    <input value={newAgeGroup} onChange={e => setNewAgeGroup(e.target.value)} placeholder="فئة عمرية جديدة" style={input} />
                    <button style={btnAdd} onClick={handleAddAgeGroup}>إضافة</button>
                </div>
                <div style={cardGrid}>
                    {ageGroups.map(a => (
                        <div key={a} style={card}>
                            <p>{a}</p>
                            <button style={btnDelete} onClick={() => handleDeleteAgeGroup(a)}>حذف</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Messages */}
            <section style={section}>
                <h2 style={sectionTitle}>رسائل التواصل</h2>
                <div style={cardGrid}>
                    {messages.map(m => (
                        <div key={m.id} style={card}>
                            <p><strong>{m.name}</strong></p>
                            <p><a href={`mailto:${m.email}`} style={email}>{m.email}</a></p>
                            <p>{m.message}</p>
                            {m.responded && <p style={reply}>تم الرد: {m.reply}</p>}
                        </div>
                    ))}
                </div>
            </section>

            {modal.show && <ConfirmModal message={modal.message} onConfirm={handleConfirm} onCancel={handleCancel} />}
        </div>
    );
}

/* ===================== STYLES ===================== */
const container = { padding: "20px" };
const title = { fontSize: "2rem", marginBottom: "20px", textAlign: "center" };
const section = { marginBottom: "30px" };
const sectionTitle = { fontSize: "1.5rem", marginBottom: "10px" };
const cardGrid = { display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" };
const card = { background: "#fff", padding: "12px", borderRadius: "12px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "6px" };
const btnDelete = { padding: "6px 10px", background: "#E74C3C", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" };
const btnAdd = { padding: "6px 12px", background: "#4A90E2", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" };
const inputRow = { display: "flex", gap: "8px", marginBottom: "12px" };
const input = { flex: 1, padding: "6px 10px", borderRadius: "8px", border: "1px solid #ccc" };
const email = { color: "#007BFF", fontSize: "0.85rem" };
const meta = { fontSize: "0.8rem", color: "#555" };
const reply = { color: "green", fontWeight: "bold" };

/* ===================== MODAL STYLES ===================== */
const modalOverlay = { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 };
const modalBox = { background: "#fff", padding: "20px", borderRadius: "12px", maxWidth: "300px", width: "100%", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" };
const btnConfirm = { padding: "6px 12px", background: "#E74C3C", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" };
const btnCancel = { padding: "6px 12px", background: "#ccc", color: "#000", border: "none", borderRadius: "8px", cursor: "pointer" };



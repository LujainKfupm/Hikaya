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
    getContactMessages,
    sendReply
} from "../mocks/mockApi";

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [ageGroups, setAgeGroups] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [newAgeGroup, setNewAgeGroup] = useState("");

    useEffect(() => {
        getUsers().then(setUsers);
        getComments().then(setComments);
        getCategories().then(setCategories);
        getAgeGroups().then(setAgeGroups);
        getContactMessages().then(setMessages);
    }, []);

    const handleDeleteUser = (id) => deleteUserById(id).then(() => setUsers(users.filter(u => u.id !== id)));
    const handleDeleteComment = (id) => deleteCommentById(id).then(() => setComments(comments.filter(c => c.id !== id)));
    const handleAddCategory = () => {
        if (!newCategory) return;
        addCategory(newCategory).then(() => {
            setCategories([...categories, newCategory]);
            setNewCategory("");
        });
    };
    const handleDeleteCategory = (cat) => deleteCategory(cat).then(() => setCategories(categories.filter(c => c !== cat)));
    const handleAddAgeGroup = () => {
        if (!newAgeGroup) return;
        addAgeGroup(newAgeGroup).then(() => {
            setAgeGroups([...ageGroups, newAgeGroup]);
            setNewAgeGroup("");
        });
    };
    const handleDeleteAgeGroup = (age) => deleteAgeGroup(age).then(() => setAgeGroups(ageGroups.filter(a => a !== age)));
    const handleReplyMessage = (id) => {
        const reply = prompt("اكتب الرد:");
        if (!reply) return;
        sendReply(id, reply).then(() => {
            setMessages(messages.map(m => m.id === id ? { ...m, responded: true, reply } : m));
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
                    <input
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value)}
                        placeholder="فئة جديدة"
                        style={input}
                    />
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
                    <input
                        value={newAgeGroup}
                        onChange={e => setNewAgeGroup(e.target.value)}
                        placeholder="فئة عمرية جديدة"
                        style={input}
                    />
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
                            <p><strong>{m.name}</strong> ({m.email})</p>
                            <p>{m.message}</p>
                            {m.responded ? (
                                <p style={reply}>تم الرد: {m.reply}</p>
                            ) : (
                                <button style={btnAdd} onClick={() => handleReplyMessage(m.id)}>رد</button>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

/* ===================== STYLES ===================== */
const container = { padding: "20px" };
const title = { fontSize: "2rem", marginBottom: "20px", textAlign: "center" };
const section = { marginBottom: "30px" };
const sectionTitle = { fontSize: "1.5rem", marginBottom: "10px" };
const cardGrid = {
    display: "grid",
    gap: "16px",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))"
};
const card = {
    background: "#fff",
    padding: "12px",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "6px"
};
const btnDelete = {
    padding: "6px 10px",
    background: "#E74C3C",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
};
const btnAdd = {
    padding: "6px 12px",
    background: "#4A90E2",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
};
const inputRow = { display: "flex", gap: "8px", marginBottom: "12px" };
const input = { flex: 1, padding: "6px 10px", borderRadius: "8px", border: "1px solid #ccc" };
const email = { color: "#007BFF", fontSize: "0.85rem" };
const meta = { fontSize: "0.8rem", color: "#555" };
const reply = { color: "green", fontWeight: "bold" };

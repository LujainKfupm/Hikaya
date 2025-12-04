import { useEffect, useState } from "react";

const API_BASE = "http://localhost:3000/api";

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

    useEffect(() => {
        fetchUsers();
        fetchMessages();
    }, []);

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


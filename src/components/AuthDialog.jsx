import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X } from "lucide-react";

export default function AuthDialog({ open, onClose }) {
    const { login } = useAuth();
    const [tab, setTab] = useState("login");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState("");

    if (!open) return null;

    function handleLogin() {
        const res = login(email, pass);
        if (!res.ok) {
            setError(res.msg);
            return;
        }
        onClose();
    }

    return (
        <div className="auth-overlay">
            <div className="auth-dialog-box">

                <button className="auth-close-btn" onClick={onClose}>
                    <X size={22} />
                </button>


                <h2 className="auth-title">
                    مرحباً بك في حكاية
                </h2>
                <p className="auth-subtitle">
                    سجل الدخول لحفظ القصص والتقييم والتعليق
                </p>

                <div className="auth-demo-box">

                    <strong>حسابات تجريبية:</strong><br />
                    <span>👨‍💼 مشرف: admin@hikaya.com — admin123</span><br />
                    <span>👤 مستخدم: demo@example.com — demo123</span>
                </div>

                {/* التبويبات */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        background: "#F2F2F2",
                        borderRadius: "12px",
                        marginBottom: "20px",
                        padding: "4px",
                    }}
                >
                    <button
                        onClick={() => setTab("login")}
                        style={{
                            border: "none",
                            background: tab === "login" ? "#fff" : "transparent",
                            borderRadius: "10px",
                            padding: "10px 0",
                            fontSize: "14px",
                            cursor: "pointer",
                            fontWeight: tab === "login" ? "bold" : "normal",
                        }}
                    >
                        تسجيل الدخول
                    </button>

                    <button
                        onClick={() => setTab("signup")}
                        style={{
                            border: "none",
                            background: tab === "signup" ? "#fff" : "transparent",
                            borderRadius: "10px",
                            padding: "10px 0",
                            fontSize: "14px",
                            cursor: "pointer",
                            fontWeight: tab === "signup" ? "bold" : "normal",
                        }}
                    >
                        إنشاء حساب
                    </button>
                </div>

                {/* البريد */}
                <label style={{ fontSize: "14px" }}>البريد الإلكتروني</label>
                <input
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        width: "100%",
                        marginTop: "6px",
                        marginBottom: "14px",
                        padding: "12px",
                        fontSize: "14px",
                        borderRadius: "10px",
                        border: "1px solid #ddd",
                        background: "#F8F8F8",
                    }}
                />

                {/* كلمة المرور */}
                <label style={{ fontSize: "14px" }}>كلمة المرور</label>
                <input
                    type="password"
                    placeholder="•••••••"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    style={{
                        width: "100%",
                        marginTop: "6px",
                        marginBottom: "18px",
                        padding: "12px",
                        fontSize: "14px",
                        borderRadius: "10px",
                        border: "1px solid #ddd",
                        background: "#F8F8F8",
                    }}
                />

                {error && (
                    <div style={{ color: "red", marginBottom: "10px", fontSize: "13px" }}>
                        {error}
                    </div>
                )}

                {/* زر الدخول */}
                <button
                    onClick={handleLogin}
                    style={{
                        width: "100%",
                        background: "#000",
                        color: "#fff",
                        padding: "12px",
                        borderRadius: "10px",
                        marginBottom: "12px",
                        fontSize: "15px",
                        cursor: "pointer",
                        border: "none",
                    }}
                >
                    تسجيل الدخول →
                </button>
            </div>
        </div>
    );
}

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X } from "lucide-react";

export default function AuthDialog({ open, onClose }) {
    const {login} = useAuth();
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
                    <X size={22}/>
                </button>


                <h2 className="auth-title">
                    مرحباً بك في حكاية
                </h2>
                <p className="auth-subtitle">
                    سجل الدخول لحفظ القصص والتقييم والتعليق
                </p>

                <div className="auth-demo-box">

                    <strong>حسابات تجريبية:</strong><br/>
                    <span>👨‍💼 مشرف: admin@hikaya.com — admin123</span><br/>
                    <span>👤 مستخدم: demo@example.com — demo123</span>
                </div>

                <div className="auth-tabs">
                    <button
                        className={tab === "login" ? "auth-tab active" : "auth-tab"}
                        onClick={() => setTab("login")}
                    >
                        تسجيل الدخول
                    </button>

                    <button
                        className={tab === "signup" ? "auth-tab active" : "auth-tab"}
                        onClick={() => setTab("signup")}
                    >
                        إنشاء حساب
                    </button>
                </div>

                <label className="auth-label">البريد الإلكتروني</label>
                <input
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label className="auth-label">كلمة المرور</label>
                <input
                    type="password"
                    placeholder="•••••••"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                />

                {error &&
                    <div className="auth-error">
                        {error}
                    </div>
                }

                <button className="auth-login-btn"
                        onClick={handleLogin}
                >
                    تسجيل الدخول →
                </button>
            </div>
        </div>
    );
}

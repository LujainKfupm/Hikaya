import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X } from "lucide-react";

export default function AuthDialog({ open, onClose }) {
    const {login,signup} = useAuth();
    const [tab, setTab] = useState("login");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [name, setName] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [error, setError] = useState("");
    const [showWelcome, setShowWelcome] = useState(false);


    if (!open) return null;

    function handleLogin() {
        const res = login(email, pass);
        if (!res.ok) {
            setError(res.msg);
            return;
        }
        setShowWelcome(true);
        setTimeout(() => {
            setShowWelcome(false);
            onClose();
        }, 2000);

    }
    function handleSignup() {

        if (!name || !email || !pass || !confirmPass) {
            setError("يرجى تعبئة جميع الحقول");
            return;
        }

        if (pass !== confirmPass) {
            setError("كلمات المرور غير متطابقة");
            return;
        }

        const res = signup({
            name,
            email,
            password: pass,
        });

        if (!res.ok) {
            setError(res.msg);
            return;
        }

        onClose();
    }

    return (
        <div className="auth-overlay">
            {showWelcome && (
                <div className="welcome-toast">
                    أهلاً بك 👋
                </div>
            )}
            <div className="auth-dialog-box">

                <button className="auth-close-btn" onClick={onClose}>
                    <X size={22}/>
                </button>


                <h2 className="auth-title">
                    مرحباً بك في حكاية
                </h2>
                <p className="auth-subtitle">
                    {tab === "login"
                        ? "سجل الدخول لحفظ القصص والتقييم والتعليق"
                        : "أنشئ حسابك للبدء في إنشاء قصص شخصية لطفلك"}
                </p>

                <div className="auth-demo-box">
                    <strong>حسابات تجريبية:</strong><br/>
                    <span>👨‍💼 مشرف: admin@hikaya.com — admin123</span><br/>
                    <span>👤 مستخدم: demo@example.com — demo123</span>
                </div>

                <div className="auth-tabs">
                    <button
                        className={tab === "login" ? "auth-tab active" : "auth-tab"}
                        onClick={() =>{ setTab("login");
                            setError("");}}
                    >
                        تسجيل الدخول
                    </button>

                    <button
                        className={tab === "signup" ? "auth-tab active" : "auth-tab"}
                        onClick={() => {setTab("signup"); setError("");
                        }}
                    >
                        إنشاء حساب
                    </button>
                </div>
                {/* login */}
                {tab === "login" && (
                    <>
                <label className="auth-label">البريد الإلكتروني</label>
                <input
                    className="auth-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                />

                <label className="auth-label">كلمة المرور</label>
                <input
                    className="auth-input"
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="•••••••"
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
           </>

                )}
                {/* sign up */}
                {tab === "signup" && (
                    <>
                        <label className="auth-label">الاسم الكامل</label>
                        <input
                            className="auth-input"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="أدخل اسمك"
                        />

                        <label className="auth-label">البريد الإلكتروني</label>
                        <input
                            className="auth-input"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@email.com"
                        />

                        <label className="auth-label">كلمة المرور</label>
                        <input
                            className="auth-input"
                            type="password"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            placeholder="•••••••"
                        />

                        <label className="auth-label">تأكيد كلمة المرور</label>
                        <input
                            className="auth-input"
                            type="password"
                            value={confirmPass}
                            onChange={(e) => setConfirmPass(e.target.value)}
                            placeholder="•••••••"
                        />

                        {error && <div className="auth-error">{error}</div>}

                        <button className="auth-login-btn" onClick={handleSignup}>
                            إنشاء الحساب →
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
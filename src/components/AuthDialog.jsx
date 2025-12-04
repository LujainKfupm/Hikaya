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

    function resetForm() {
        setEmail("");
        setPass("");
        setName("");
        setConfirmPass("");
        setError("");
    }

    if (!open) return null;
    async function handleLogin() {
        setError("");
        if (!email || !pass) {
            setError("الرجاء إدخال البريد و كلمة المرور");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("صيغة البريد الإلكتروني غير صحيحة");
            return;
        }

        if (pass.length < 6) {
            setError("كلمة المرور يجب أن تكون ستّة أحرف على الأقل");
            return;
        }

        const res = await login(email, pass);
        if (!res.ok) {
            setError(res.msg);
            return;
        }

        setShowWelcome(true);
        setTimeout(() => {
            setShowWelcome(false);
            resetForm();
            onClose();
        }, 1000);
    }


    async function handleSignup() {
        // Reset previous error
        setError("");

        //Check all fields filled
        if (!name || !email || !pass || !confirmPass) {
            setError("يرجى تعبئة جميع الحقول");
            return;
        }

        //Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("صيغة البريد الإلكتروني غير صحيحة");
            return;
        }

        //Check password length
        if (pass.length < 6) {
            setError("كلمة المرور يجب أن تكون ستّة أحرف على الأقل");
            return;
        }

        //Confirm password matches
        if (pass !== confirmPass) {
            setError("كلمات المرور غير متطابقة");
            return;
        }
        //Call backend
        const res = await signup({
            name,
            email,
            password: pass
        });

        if (!res.ok) {
            setError(res.msg);
            return;
        }
        resetForm();
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

                <button className="auth-close-btn" onClick={() => {
                    resetForm();
                    setTab("login");
                    onClose();
                }}>
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
                    <strong>حساب المشرف:</strong><br/>
                    <span> admin@hikaya.com — admin123</span><br/>
                </div>

                <div className="auth-tabs">
                    <button
                        className={tab === "login" ? "auth-tab active" : "auth-tab"}
                        onClick={() => {
                            setTab("login");
                            resetForm();
                        }}
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
                    autoComplete="off"
                />

                <label className="auth-label">كلمة المرور</label>
                <input
                    className="auth-input"
                    type="password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    placeholder="•••••••"
                    autoComplete="new-password"
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
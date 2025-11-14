import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { BookOpen } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthDialog from "./AuthDialog";

export default function Header() {
    const { user, logout } = useAuth();
    const nav = useNavigate();
    const [showAuth, setShowAuth] = useState(false);

    return (
        <header className="header" dir="rtl">
            <div className="nav">
                {/* Logo (Right side) */}
                <div className="logo">
                    <div className="logo-icon">
                        <BookOpen color="#f5c518" size={28} />
                    </div>
                    <div className="logo-text">
                        <strong>حكاية</strong>
                        <small>قصص ذكية للأطفال</small>
                    </div>
                </div>

                {/* Navigation links (Centered) */}
                <div className="nav-links">
                    <Link to="/">الرئيسية</Link>
                    <Link to="/create">إنشاء قصة</Link>
                    <Link to="/library">المكتبة</Link>
                    <Link to="/contact">التواصل</Link>
                    {user?.role === "user" && <Link to="/my-library">مكتبتي</Link>}
                    {user?.role === "admin" && <Link to="/admin">لوحة التحكم</Link>}
                </div>

                {/* Auth controls (Left side) */}
                <div className="nav-actions">
                    {!user ? (
                        <button className="btn" onClick={() => setShowAuth(true)}>
                            دخول / تسجيل
                        </button>
                    ) : (
                        <>
                            <span>{user.name}</span>
                            <button
                                className="btn"
                                onClick={() => {
                                    logout();
                                    toast("تم تسجيل الخروج");
                                    nav("/");
                                }}
                            >
                                خروج
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Dialog */}
            <AuthDialog open={showAuth} onClose={() => setShowAuth(false)} />

        </header>
    );
}

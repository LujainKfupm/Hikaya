import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

import HomePage from './pages/HomePage'
import StoryCreation from './pages/StoryCreation'
import StoryLibrary from './pages/StoryLibrary'
import StoryView from './pages/StoryView'
import UserLibrary from './pages/UserLibrary'
import ContactPage from './pages/ContactPage'
import AdminDashboard from './pages/AdminDashboard'

function Header() {
    const { user, logout } = useAuth()
    const nav = useNavigate()
    const [showAuth, setShowAuth] = useState(false)

    return (
        <div className="nav">
            <strong>حكاية</strong>
            <Link to="/">الرئيسية</Link>
            <Link to="/create">إنشاء قصة</Link>
            <Link to="/library">المكتبة</Link>
            <Link to="/contact">التواصل</Link>
            {user?.role === 'user' && <Link to="/my-library">مكتبتي</Link>}
            {user?.role === 'admin' && <Link to="/admin">لوحة التحكم</Link>}
            <div className="spacer" />
            {!user ? (
                <button className="btn" onClick={() => setShowAuth(true)}>دخول / تسجيل</button>
            ) : (
                <>
                    <span>{user.name}</span>
                    <button className="btn" onClick={() => { logout(); toast('تم تسجيل الخروج'); nav('/') }}>خروج</button>
                </>
            )}
            {showAuth && <AuthDialog onClose={() => setShowAuth(false)} />}
        </div>
    )
}

function AuthDialog({ onClose }) {
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    function handleLogin(e){
        e.preventDefault()
        const res = login(email, password)
        if(!res.ok) return toast.error(res.msg)
        toast.success('أهلاً بك 👋')
        onClose()
    }

    return (
        <div className="container card">
            <h3>تسجيل الدخول (حسابات تجريبية)</h3>
            <p>مشرف: admin@hikaya.com / admin123</p>
            <p>مستخدم: demo@example.com / demo123</p>
            <form onSubmit={handleLogin}>
                <label>البريد الإلكتروني</label>
                <input value={email} onChange={e=>setEmail(e.target.value)} />
                <label>كلمة المرور</label>
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
                <div style={{display:'flex', gap:8, marginTop:8}}>
                    <button className="btn" type="submit">دخول</button>
                    <button className="btn" type="button" onClick={onClose}>إغلاق</button>
                </div>
            </form>
        </div>
    )
}

function Footer() {
    return (
        <div style={{padding:'24px', borderTop:'1px solid #eee', marginTop:24}}>
            © حكاية — جميع الحقوق محفوظة
        </div>
    )
}

function RequireAuth({ children, role }) {
    const { user } = useAuth()
    if (!user) return <Navigate to="/" replace />
    if (role && user.role !== role) return <Navigate to="/" replace />
    return children
}

export default function App(){
    return (
        <AuthProvider>
            <Header />
            <div className="container">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/create" element={<StoryCreation />} />
                    <Route path="/library" element={<StoryLibrary />} />
                    <Route path="/story/:id" element={<StoryView />} />
                    <Route path="/my-library" element={
                        <RequireAuth role="user"><UserLibrary /></RequireAuth>
                    }/>
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/admin" element={
                        <RequireAuth role="admin"><AdminDashboard /></RequireAuth>
                    }/>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
            <Footer />
        </AuthProvider>
    )
}

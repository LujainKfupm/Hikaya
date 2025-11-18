import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const DEMO_USERS = [
    { email: 'admin@hikaya.com', password: 'admin123', role: 'admin', name: 'مشرف' },
    { email: 'demo@example.com', password: 'demo123', role: 'user',  name: 'مستخدم' },
];

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('hikaya_user');
        return saved ? JSON.parse(saved) : null;
    });

    function login(email, password) {
        const found = DEMO_USERS.find(
            u => u.email === email && u.password === password
        );

        if (!found) return { ok:false, msg:'بيانات الدخول غير صحيحة' };

        setUser(found);
        localStorage.setItem('hikaya_user', JSON.stringify(found));
        return { ok:true };
    }
    function signup(newUser) {
        localStorage.setItem("hikaya_user", JSON.stringify(newUser));
        setUser(newUser);

        return { ok: true };
    }


    function logout() {
        setUser(null);
        localStorage.removeItem('hikaya_user');
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
}

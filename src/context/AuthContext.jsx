import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_BASE = `${API_ROOT}/api/auth`;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore user on page reload
    useEffect(() => {
        const token = localStorage.getItem("hikaya_token");
        if (!token) {
            setLoading(false);
            return;
        }

        fetch(`${API_BASE}/me`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data) setUser(data);
            })
            .finally(() => setLoading(false));
    }, []);


    // Login
    async function login(email, password) {
        try {
            const res = await fetch(`${API_BASE}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (!res.ok) return { ok: false, msg: data.message || "خطأ" };

            // Save token and user
            localStorage.setItem("hikaya_token", data.token);
            setUser(data);

            return { ok: true };

        } catch (err) {
            return { ok: false, msg: "فشل الاتصال بالخادم" };
        }
    }

    // Sign-up
    async function signup({ name, email, password }) {
        try {
            const res = await fetch(`${API_BASE}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                // return backend message
                return { ok: false, msg: data.message || "حدث خطأ" };
            }

            // Save token and user
            localStorage.setItem("hikaya_token", data.token);
            setUser(data);

            return { ok: true };

        } catch (err) {
            return { ok: false, msg: "فشل الاتصال بالخادم" };
        }
    }

    // Log-out
    function logout() {
        localStorage.removeItem("hikaya_token");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}


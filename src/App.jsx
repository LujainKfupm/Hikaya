import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import StoryCreation from "./pages/StoryCreation";
import StoryLibrary from "./pages/StoryLibrary";
import StoryView from "./pages/StoryView";
import UserLibrary from "./pages/UserLibrary";
import ContactPage from "./pages/ContactPage";
import AdminDashboard from "./pages/AdminDashboard";
import FAQ  from "./pages/FAQ";

function RequireAuth({ children, role }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/" replace />;
    if (role && user.role !== role) return <Navigate to="/" replace />;
    return children;
}

export default function App() {
    return (
        <AuthProvider>
            <Header />
            <div className="container">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/create" element={<StoryCreation />} />
                    <Route path="/library" element={<StoryLibrary />} />
                    <Route path="/story/:id" element={<StoryView />} />
                    <Route
                        path="/my-library"
                        element={
                            <RequireAuth role="user">
                                <UserLibrary />
                            </RequireAuth>
                        }
                    />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/faq" element={<FAQ />} />

                    <Route
                        path="/admin"
                        element={
                            <RequireAuth role="admin">
                                <AdminDashboard />
                            </RequireAuth>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
            <Footer />
        </AuthProvider>
    );
}

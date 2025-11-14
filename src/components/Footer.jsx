import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react"; // ✅ Import the same icon

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-column">
                    <div className="footer-logo">
                        <BookOpen color="#f5c518" size={22} /> {/* Book icon */}
                        <h3>حكاية</h3>
                    </div>
                    <p>إنشاء قصص سحرية مخصصة للأطفال من خلال الذكاء الاصطناعي.</p>
                </div>

                <div className="footer-column">
                    <h4>الدعم</h4>
                    <ul>
                        <li><Link to="/faq">الأسئلة الشائعة</Link></li>
                        <li><Link to="/contact">اتصل بنا</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2025 حكاية — جميع الحقوق محفوظة</p>
                <p>صُنِعَ <span style={{ color: "red" }}>❤️</span> للأطفال في كل مكان</p>
            </div>
        </footer>
    );
}

import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

export default function ContactPage() {
    const formRef = useRef();
    const [successMsg, setSuccessMsg] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = formRef.current;
        const name = form.name;
        const email = form.email;
        const message = form.message;

        // Clear previous custom validity
        name.setCustomValidity("");
        email.setCustomValidity("");
        message.setCustomValidity("");

        let valid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!name.value.trim()) {
            name.setCustomValidity("الرجاء إدخال اسمك");
            valid = false;
        }
        if (!email.value.trim()) {
            email.setCustomValidity("الرجاء إدخال البريد الإلكتروني");
            valid = false;
        } else if (!emailRegex.test(email.value)) {
            email.setCustomValidity("البريد الإلكتروني غير صالح");
            valid = false;
        }
        if (!message.value.trim()) {
            message.setCustomValidity("الرجاء إدخال رسالتك");
            valid = false;
        }

        if (!valid) {
            form.reportValidity();
            return;
        }

        // Show confirmation message
        setSuccessMsg("تم إرسال الرسالة بنجاح");
        setTimeout(() => setSuccessMsg(""), 3000);

        form.reset();
    };

    return (
        <div className="contact-container">
            <h2>تواصل معنا</h2>
            <p>لديك سؤال؟ نحن هنا لمساعدتك!</p>

            <div className="faq-hint">
                <Link to="/faq">تحقق من الأسئلة الشائعة أولاً</Link>
            </div>

            {successMsg && (
                <div className="success-box">
                    <Check size={18} color="#155724" />
                    <span>{successMsg}</span>
                </div>
            )}

            <form className="contact-form" ref={formRef} onSubmit={handleSubmit} noValidate>
                <label htmlFor="name">الاسم</label>
                <input type="text" id="name" name="name" placeholder="أدخل اسمك" />

                <label htmlFor="email">البريد الإلكتروني</label>
                <input type="text" id="email" name="email" placeholder="أدخل بريدك الإلكتروني" />

                <label htmlFor="message">الرسالة</label>
                <textarea id="message" name="message" placeholder="اكتب رسالتك هنا"></textarea>

                <button className="contact-button" type="submit">إرسال</button>
            </form>
        </div>
    );
}


import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { sendContactMessage } from "../api";

export default function ContactPage() {
    const formRef = useRef();
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = formRef.current;

        const data = {
            name: form.name.value.trim(),
            email: form.email.value.trim(),
            message: form.message.value.trim(),
        };

        if (!data.name || !data.email || !data.message) {
            return setErrorMsg("الرجاء تعبئة جميع الحقول");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return setErrorMsg("الرجاء إدخال بريد إلكتروني صحيح");
        }

        setErrorMsg("");

        const res = await sendContactMessage(data);

        if (res._id) {
            setSuccessMsg("تم إرسال الرسالة بنجاح");
            setTimeout(() => setSuccessMsg(""), 3000);
            form.reset();
        } else {
            setErrorMsg("حدث خطأ أثناء إرسال الرسالة");
        }
    };

    return (
        <div className="contact-container">
            <h2>تواصل معنا</h2>
            <p>لديك سؤال؟ نحن هنا لمساعدتك!</p>

            <div className="faq-hint">
                <Link to="/faq">تحقق من الأسئلة الشائعة أولاً</Link>
            </div>


            <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
                <label>الاسم</label>
                <input name="name" placeholder="أدخل اسمك" />

                <label>البريد الإلكتروني</label>
                <input name="email" placeholder="أدخل بريدك الإلكتروني" />

                <label>الرسالة</label>
                <textarea name="message" placeholder="اكتب رسالتك هنا"></textarea>

                <button className="contact-button" type="submit">
                    إرسال
                </button>

                {successMsg && (
                    <div className="success-box">
                        <Check size={18} color="#155724" />
                        <span>{successMsg}</span>
                    </div>
                )}
                {errorMsg && (
                    <div className="error-box">
                        <span>{errorMsg}</span>
                    </div>
                )}
            </form>
        </div>
    );
}

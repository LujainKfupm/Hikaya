import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "react-feather"; // arrow icon

const faqData = [
    {
        question: "ما هو موقع حكاية؟",
        answer: "حكاية هو منصة تفاعلية تتيح للمستخدمين قراءة وإنشاء قصص مخصّصة للأطفال بطريقة ممتعة وسهلة."
    },
    {
        question: "كيف يمكنني التواصل مع فريق الموقع؟",
        answer: "يمكنك التواصل معنا عبر صفحة اتصل بنا الموجودة أسفل الصفحة."
    },
    {
        question: "هل الموقع مجاني؟",
        answer: "نعم،جميع ميزات القراءة مجانية، وبعض ميزات إنشاء القصص قد تتطلب تسجيل دخول."
    },
    {
        question: "هل أحتاج إلى إنشاء حساب لاستخدام الموقع؟",
        answer: "يمكنك تصفّح وقراءة القصص دون حساب ولكن إنشاء حساب يتيح لك حفظ القصص وتقييمها."
    },
    {
        question: "هل القصص مناسبة لجميع الأعمار؟",
        answer: "نعم، القصص مصمّمة لتناسب الأطفال من مختلف الأعمار، مع التركيز على القيم الإيجابية والمحتوى التربوي الآمن."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="faq-container">
            <h2>الأسئلة الشائعة</h2>

            <div className="faq-list">
                {faqData.map((item, index) => (
                    <div
                        key={index}
                        className={`faq-item ${openIndex === index ? "open" : ""}`}
                        onClick={() => toggleFAQ(index)}
                    >
                        <div className="faq-question">
                            <ChevronLeft
                                className={`faq-arrow ${openIndex === index ? "rotated" : ""}`}
                                size={18}
                            />
                            {item.question}
                        </div>
                        {openIndex === index && (
                            <div className="faq-answer">
                                {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="faq-contact">
                <h3>التعليقات والاقتراحات</h3>
                <p>
                    لأي استفسار أو ملاحظات، يرجى ملء المعلومات المطلوبة.{" "}
                    <Link to="/contact">تواصل معنا</Link>
                </p>
            </div>
        </div>
    );
}

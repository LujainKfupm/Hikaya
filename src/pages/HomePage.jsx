import { Link } from "react-router-dom";
import { Sparkles, Heart, Star } from "lucide-react";
import heroImage from "../assets/img.png";

export default function HomePage() {
    return (
        <>
            {/* ⭐ New Modern Hero Section (Replaces Old One) */}
            <section
                className="hero card"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "24px",
                    padding: "32px",
                    borderRadius: "12px",
                    marginBottom: "24px",
                }}
            >
                {/* Right side: text */}
                <div style={{ flex: 1 }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "8px",
                        }}
                    >
                        <Sparkles color="#f5c518" size={22} />
                        <h3 style={{ margin: 0 }}>قصص سحرية لطفلك</h3>
                    </div>

                    <p style={{ color: "#444", lineHeight: 1.8 }}>
                        أنشئ قصصًا مخصصة مدعومة بالذكاء الاصطناعي تُشعل الخيال،
                        وتُعلِّم دروسًا قيّمة، وتحتفي بتفرّد طفلك.
                    </p>

                    <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                        <Link
                            to="/create"
                            className="btn"
                            style={{
                                backgroundColor: "#111",
                                color: "#fff",
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: "8px",
                                cursor: "pointer",
                            }}
                        >
                            ✨ إنشاء قصتك
                        </Link>

                        <Link
                            to="/library"
                            className="btn"
                            style={{
                                border: "1px solid #ccc",
                                padding: "10px 20px",
                                borderRadius: "8px",
                            }}
                        >
                            تصفح المكتبة
                        </Link>
                    </div>
                </div>

                {/* Left side: image */}
                <img
                    src={heroImage}
                    alt="حكاية"
                    style={{
                        width: "280px",
                        borderRadius: "12px",
                        flexShrink: 0,
                    }}
                />
            </section>

            {/* Features Section */}
            <section style={{ marginTop: 18, textAlign: "center" }}>
                <h2>لماذا تختار حكاية؟</h2>
                <p style={{ color: "#666", marginBottom: 24 }}>
                    تجمع بين تقنية الذكاء الاصطناعي المتطورة وفن رواية القصص الخالدة لخلق
                    تجارب لا تُنسى لأطفالك.
                </p>

                <div className="features-grid">
                    <div className="feature-card">
                        <Sparkles color="#f5c518" size={32} />
                        <h3>قصص مدعومة بالذكاء الاصطناعي</h3>
                        <p>إنشاء قصص فريدة وشخصية مصممة خصيصاً لاهتمامات طفلك وعمره.</p>
                    </div>

                    <div className="feature-card">
                        <Heart color="#f5c518" size={32} />
                        <h3>تعليمية وممتعة</h3>
                        <p>كل قصة تعلم قيم أخلاقية ودروس حياتية بطريقة جذابة.</p>
                    </div>

                    <div className="feature-card">
                        <Star color="#f5c518" size={32} />
                        <h3>مناسبة للعمر</h3>
                        <p>محتوى آمن وملائم لكل فئة عمرية.</p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works">
                <h2>كيف يعمل؟</h2>
                <p className="subtitle">إنشاء القصص الشخصية سهل مثل 1-2-3</p>

                <div className="steps-grid">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <h3>أدخل التفاصيل</h3>
                        <p>شارك اسم طفلك وعمره والمواضيع المفضلة والقيم التي تريد تعليمها.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">2</div>
                        <h3>الذكاء الاصطناعي يُبدع</h3>
                        <p>ينشئ الذكاء الاصطناعي قصة فريدة ومناسبة للعمر في ثوانٍ.</p>
                    </div>

                    <div className="step-card">
                        <div className="step-number">3</div>
                        <h3>اقرأ وشارك</h3>
                        <p>استمتع بالقصة معًا، احفظها في مكتبتك، وشاركها مع الآخرين.</p>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="cta-section">
                <h2>هل أنت مستعد لصنع السحر؟</h2>
                <p>ابدأ في إنشاء قصص مخصصة ستجعل طفلك بطل مغامرته الخاصة.</p>
                <Link className="cta-button" to="/create">
                    ✨ إنشاء قصتك الأولى
                </Link>
            </section>
        </>
    );
}

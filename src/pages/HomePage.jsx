import { Link } from "react-router-dom";
import { Sparkles, Heart, Star } from "lucide-react";
import heroImage from "../assets/img.png";

export default function HomePage() {
    return (
        <>
            <section
                className="hero card hero-section"
            >
                {/* Right side: text */}
                <div className="hero-text" >
                    <div className="hero-title-row"
                    >
                        <Sparkles color="#f5c518" size={22} />
                        <h3 className="hero-heading" >قصص سحرية لطفلك</h3>
                    </div>

                    <p className="hero-description">
                        أنشئ قصصًا مخصصة مدعومة بالذكاء الاصطناعي تُشعل الخيال،
                        وتُعلِّم دروسًا قيّمة، وتحتفي بتفرّد طفلك.
                    </p>

                    <div className="hero-buttons">
                        <Link
                            to="/create"
                            className="btn hero-primary-btn"
                        >
                            ✨ إنشاء قصتك
                        </Link>

                        <Link
                            to="/library"
                            className="btn hero-secondary-btn"
                        >
                            تصفح المكتبة
                        </Link>
                    </div>
                </div>

                {/* Left side: image */}
                <img
                    src={heroImage}
                    alt="حكاية"
                    className="hero-image"
                />
            </section>

            {/* Features Section */}
            <section className="features-wrapper">
                <h2>لماذا تختار حكاية؟</h2>
                <p className="features-subtitle">
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

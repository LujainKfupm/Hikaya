import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const TOPICS = [
    "مغامرة",
    "خيال",
    "علمي",
    "طبيعة",
    "مدرسة",
    "عائلة",
    "رياضة",
    "فضاء",
    "حيوانات",
    "أميرات",
];

const MORALS = [
    "الصدق",
    "الشجاعة",
    "اللطف",
    "الصبر",
    "الاحترام",
    "التعاون",
    "الصداقة",
    "المسؤولية",
    "الكرم",
    "المثابرة",
];

export default function StoryCreation() {
    const { user } = useAuth();
    const isLoggedIn = !!user;

    const [form, setForm] = useState({
        heroName: "",
        age: "",
        gender: "",
        topics: [],
        morals: [],
        details: "",
        isPublic: true,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generatedStory, setGeneratedStory] = useState("");

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    function toggleTopic(topic) {
        setForm((prev) => {
            const exists = prev.topics.includes(topic);
            return {
                ...prev,
                topics: exists
                    ? prev.topics.filter((t) => t !== topic)
                    : [...prev.topics, topic],
            };
        });
    }

    function toggleMoral(moral) {
        setForm((prev) => {
            const exists = prev.morals.includes(moral);
            return {
                ...prev,
                morals: exists
                    ? prev.morals.filter((m) => m !== moral)
                    : [...prev.morals, moral],
            };
        });
    }

    function validate() {
        if (!form.heroName.trim()) {
            toast.error("اسم البطل مطلوب");
            return false;
        }
        const ageNumber = Number(form.age);
        if (!ageNumber || ageNumber < 3 || ageNumber > 12) {
            toast.error("العمر يجب أن يكون بين ٣ و ١٢ سنة");
            return false;
        }
        if (!form.gender) {
            toast.error("اختاري جنس البطل");
            return false;
        }
        if (form.topics.length === 0) {
            toast.error("اختاري موضوعاً واحداً على الأقل للقصة");
            return false;
        }
        if (form.morals.length === 0) {
            toast.error("اختاري درساً أخلاقياً واحداً على الأقل");
            return false;
        }
        return true;
    }

    function buildGeneratedStory(payload) {
        const { heroName, age, topics, morals, details, gender } = payload;

        const heShe = gender === "boy" ? "هو" : "هي";
        const childWord = gender === "boy" ? "طفل" : "طفلة";
        const pronounSuffix = gender === "boy" ? "ه" : "ها";

        const mainTopic = topics[0];
        const mainMoral = morals[0];

        let text =
            `في يومٍ من الأيام، كان هناك ${childWord} باسم ${heroName} يبلغ من العمر ${age} سنة. ` +
            `${heShe} كان يحب عالم ${mainTopic} كثيراً، ويجد فيه متعة واكتشافاً جديداً كل يوم. ` +
            `وخلال هذه المغامرة، تعلّم ${heroName} قيمة ${mainMoral}، وفهم أن القيم الجميلة تجعل العالم مكاناً أفضل. `;

        if (details.trim()) {
            text += `وخلال القصة، حدث موقف مميز: ${details.trim()}، وكان لهذا الموقف أثر كبير في قلب ${heroName}. `;
        }

        text += `وفي نهاية اليوم، عاد ${heroName} إلى البيت وهو يشعر بالفخر لأنه تعلّم شيئاً جديداً عن نفس${pronounSuffix} وعن العالم من حول${pronounSuffix}.`;

        return text;
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        setGeneratedStory("");

        const storyPayload = {
            ...form,
            age: Number(form.age),
            createdBy: isLoggedIn ? user.email : "guest",
            createdAt: new Date().toISOString(),
        };

        //api backend added later
        setTimeout(() => {
            setIsSubmitting(false);

            const storyText = buildGeneratedStory(storyPayload);
            setGeneratedStory(storyText);

            console.log("Story to send to backend:", storyPayload);

            if (isLoggedIn) {
                toast.success("تم إنشاء القصة وحفظها في مكتبتي ✨");
            } else {
                toast.success("تم إنشاء القصة مؤقتاً، سجّلي الدخول لحفظها 💾");
            }

            setForm((prev) => ({
                ...prev,
                heroName: "",
                age: "",
                details: "",
            }));
        }, 600);
    }

    return (
        <div className="page">
            <header className="page-header">
                <h1 className="page-title">إنشاء قصة جديدة</h1>
                <p className="page-subtitle">
                    املئي الحقول التالية وسيقوم النظام بإنشاء قصة مخصّصة لطفلك ❤️
                </p>

                {!isLoggedIn && (
                    <div className="alert alert-warning">
                        <strong>ملاحظة للضيوف:</strong> يمكنك إنشاء القصة، لكن لن يتم حفظها
                        في "مكتبتي". سجّلي الدخول لحفظ قصصك والوصول إليها لاحقاً.
                    </div>
                )}
            </header>

            <form className="form-card" onSubmit={handleSubmit}>
                <div className="form-grid">
                    {/* اسم البطل */}
                    <div className="form-field">
                        <label className="form-label">
                            <span className="required">اسم البطل</span>
                        </label>
                        <input
                            type="text"
                            name="heroName"
                            className="form-input"
                            placeholder="مثال: سارة، ياسر..."
                            value={form.heroName}
                            onChange={handleChange}
                        />
                        <p className="form-hint">سيظهر اسم البطل داخل القصة.</p>
                    </div>

                    <div className="form-field form-field-inline">
                        <div className="form-field">
                            <label className="form-label">
                                <span className="required">عمر البطل (بالسنوات)</span>
                            </label>
                            <input
                                type="number"
                                name="age"
                                className="form-input"
                                min={3}
                                max={12}
                                placeholder="من ٣ إلى ١٢"
                                value={form.age}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">ملاءمة عمرية</label>
                            <p className="form-hint">
                                سيتم توليد القصة بما يناسب هذا العمر من حيث اللغة وطول القصة.
                            </p>
                        </div>
                    </div>

                    <div className="form-field">
                        <label className="form-label">
                            <span className="required">جنس البطل</span>
                        </label>
                        <div className="chip-group">
                            <button
                                type="button"
                                className={`chip ${
                                    form.gender === "boy" ? "chip--selected" : ""
                                }`}
                                onClick={() =>
                                    setForm((prev) => ({
                                        ...prev,
                                        gender: "boy",
                                    }))
                                }
                            >
                                ولد
                            </button>
                            <button
                                type="button"
                                className={`chip ${
                                    form.gender === "girl" ? "chip--selected" : ""
                                }`}
                                onClick={() =>
                                    setForm((prev) => ({
                                        ...prev,
                                        gender: "girl",
                                    }))
                                }
                            >
                                بنت
                            </button>
                        </div>
                    </div>

                    <div className="form-field">
                        <label className="form-label">
                            <span className="required">موضوعات القصة</span>
                        </label>
                        <p className="form-hint">
                            يمكنك اختيار أكثر من موضوع، سيتم التركيز على الأول كموضوع رئيسي.
                        </p>
                        <div className="chip-group">
                            {TOPICS.map((topic) => {
                                const selected = form.topics.includes(topic);
                                return (
                                    <button
                                        key={topic}
                                        type="button"
                                        className={`chip ${
                                            selected ? "chip--selected" : ""
                                        }`}
                                        onClick={() => toggleTopic(topic)}
                                    >
                                        {topic}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="form-field">
                        <label className="form-label">
                            <span className="required">الدروس الأخلاقية</span>
                        </label>
                        <p className="form-hint">
                            اختاري القيم التي ترغبين أن يتعلمها الطفل من هذه القصة.
                        </p>
                        <div className="chip-group">
                            {MORALS.map((moral) => {
                                const selected = form.morals.includes(moral);
                                return (
                                    <button
                                        key={moral}
                                        type="button"
                                        className={`chip ${
                                            selected ? "chip--selected" : ""
                                        }`}
                                        onClick={() => toggleMoral(moral)}
                                    >
                                        {moral}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="form-field">
                        <label className="form-label">تفاصيل إضافية (اختياري)</label>
                        <textarea
                            name="details"
                            className="form-input form-textarea"
                            rows={4}
                            placeholder="اكتبي أي تفاصيل تحبين إضافتها للقصة (مكان، شخصية، موقف...)"
                            value={form.details}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-field">
                        <label className="form-checkbox">
                            <input
                                type="checkbox"
                                name="isPublic"
                                checked={form.isPublic}
                                onChange={handleChange}
                                disabled={!isLoggedIn}
                            />
                            <span>
                جعل القصة <strong>عامة</strong> في المكتبة
                                {!isLoggedIn && " (يتطلب تسجيل الدخول)"}
              </span>
                        </label>
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "جارٍ إنشاء القصة..." : "إنشاء القصة"}
                    </button>
                </div>
            </form>

            {generatedStory && (
                <section className="story-output">
                    <h2>القصة المولَّدة</h2>
                    <p>{generatedStory}</p>
                </section>
            )}
        </div>
    );
}

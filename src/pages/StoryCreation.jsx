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

        const topicMain = topics[0];
        const topicList =
            topics.length > 1 ? topics.join("، ") : topicMain || "المغامرات";
        const moralsList =
            morals.length > 1 ? morals.join("، ") : morals[0] || "القيم الجميلة";

        const extraDetails = details.trim()
            ? `\n\nفي أحد الأيام، حدث موقف مميز: ${details.trim()}، وكان هذا الموقف نقطة تحوّل في حياة ${heroName}.`
            : "";

        if (gender === "boy") {
            return (
                `في صباحٍ لطيف في مدينة صغيرة هادئة، كان هناك طفلٌ اسمه ${heroName}، ` +
                `يبلغ من العمر ${age} سنة. كان ${heroName} يحب عالم ${topicList}، ` +
                `ويتخيّل دائمًا أن حياته مليئة بالمفاجآت والاكتشافات.\n\n` +

                `في ذلك اليوم، استيقظ ${heroName} وهو يشعر بحماسٍ غريب. نظر من النافذة ورأى أن الشمس تشرق ` +
                `بلطف، وكأنها تدعوه إلى مغامرة جديدة. قرر ${heroName} أن يتبع قلبه ويخرج ليستكشف العالم من حوله.\n\n` +

                `وأثناء رحلته، واجه مواقف مختلفة جعلته يتعلّم معاني ${moralsList}. ` +
                `ففي موقفٍ ما، احتاج صديقٌ له إلى المساعدة، فتقدّم ${heroName} بشجاعة ومدّ يد العون. ` +
                `وفي موقفٍ آخر، كان عليه أن يختار بين قول الحقيقة أو إخفائها، فتذكّر أن ${morals[0] || "الصدق"} ` +
                `هو الذي يجعل الناس يثقون به ويحبّونه.\n` +

                extraDetails +

                `\n\nمع نهاية اليوم، كان ${heroName} قد تعلّم أن القيم الجميلة ليست مجرد كلمات، ` +
                `بل أفعال صغيرة يقوم بها كل يوم. عاد إلى البيت وقلبه ممتلئ بالفخر، ` +
                `وهو يهمس لنفسه: "سأحافظ دائمًا على ${moralsList}، لأنها تجعلني بطلاً حقيقياً في قصّتي وفي حياة من حولي."`
            );
        } else {
            return (
                `في مدينةٍ هادئة مليئة بالأشجار والزهور، كانت تعيش طفلة لطيفة اسمها ${heroName}، ` +
                `تبلغ من العمر ${age} سنة. كانت ${heroName} تحب عالم ${topicList}، ` +
                `وتقضي وقتها في التخيّل والرسم وطرح الأسئلة عن كل شيء من حولها.\n\n` +

                `في صباحٍ مشمس، استيقظت ${heroName} وهي تشعر بأن هذا اليوم سيكون مختلفًا. ` +
                `ارتدت ملابسها المفضّلة، وحملت حقيبتها الصغيرة، وقررت أن تنطلق في مغامرة جديدة ` +
                `تبحث فيها عن معنى ${moralsList}.\n\n` +

                `خلال رحلتها، قابلت ${heroName} أشخاصًا وحيوانات وأصدقاء جدداً. ` +
                `في أحد المواقف، رأت طفلاً حزيناً يجلس وحده، فاقتربت منه بابتسامة وشاركت معه لعبتها، ` +
                `وتعلّمت معنى ${morals[0] || "اللطف"} وأن كلمة طيبة يمكن أن تغيّر يوم شخصٍ كامل. ` +
                `وفي موقفٍ آخر، احتاجت أن تتحلّى بـ${morals[1] || "الصبر"} كي تصل إلى هدفها، ` +
                `فتعلّمت أن الاستعجال لا يقود دائماً إلى أفضل النتائج.\n` +

                extraDetails +

                `\n\nمع غروب الشمس، عادت ${heroName} إلى بيتها وهي تشعر بالامتنان. ` +
                `جلست بجانب نافذتها، ونظرت إلى السماء، وقالت بهدوء: "اليوم تعلّمت أن ${moralsList} ` +
                `تجعل قلبي أكثر نوراً، وتساعدني أن أكون بطلة قصّتي الخاصة."`
            );
        }
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

        // api backend added later
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
                    املأ الحقول التالية وسيقوم النظام بإنشاء قصة مخصّصة لطفلك ❤️
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
                            اختر القيم التي ترغبين أن يتعلمها الطفل من هذه القصة.
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
                            placeholder="اكتب أي تفاصيل تحبين إضافتها للقصة (مكان، شخصية، موقف...)"
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

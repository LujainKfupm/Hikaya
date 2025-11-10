import { useState } from 'react'
import toast from 'react-hot-toast'

export default function StoryCreation(){
    const [hero, setHero] = useState('')
    const [age, setAge] = useState(6)
    const [topic, setTopic] = useState('مغامرة')
    const [moral, setMoral] = useState('الصدق')
    const [details, setDetails] = useState('')
    const [isPublic, setIsPublic] = useState(true)

    function createStory(e){
        e.preventDefault()
        if(!hero) return toast.error('اسم البطل مطلوب')
        if(age < 3 || age > 12) return toast.error('العمر بين 3 و 12')
        toast.success('تم إنشاء القصة (وهمية الآن)')
    }

    return (
        <>
            <h1>إنشاء قصة</h1>
            <form onSubmit={createStory} className="card">
                <label>اسم البطل *</label>
                <input value={hero} onChange={e=>setHero(e.target.value)} />
                <label>العمر *</label>
                <input type="number" value={age} onChange={e=>setAge(+e.target.value)} />
                <label>الموضوع</label>
                <select value={topic} onChange={e=>setTopic(e.target.value)}>
                    {['مغامرة','خيال','علمي','طبيعة','مدرسة','عائلة','رياضة','فضاء','حيوانات','أميرات'].map(t=>(
                        <option key={t} value={t}>{t}</option>
                    ))}
                </select>
                <label>الدرس الأخلاقي</label>
                <select value={moral} onChange={e=>setMoral(e.target.value)}>
                    {['الصدق','الشجاعة','اللطف','الصبر','الاحترام','التعاون','الصداقة','المسؤولية','الكرم','المثابرة'].map(m=>(
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
                <label>تفاصيل مخصصة (اختياري)</label>
                <textarea value={details} onChange={e=>setDetails(e.target.value)} />
                <label>
                    <input type="checkbox" checked={isPublic} onChange={e=>setIsPublic(e.target.checked)} />
                    جعل القصة عامة
                </label>
                <button className="btn" type="submit">إنشاء</button>
            </form>
        </>
    )
}

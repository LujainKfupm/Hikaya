import { useState } from 'react'

const TABS = ['المستخدمون','المحتوى','الفئات','رسائل التواصل','الإعلانات','سجل الأنشطة','التحليلات']

export default function AdminDashboard(){
    const [tab, setTab] = useState(TABS[0])
    return (
        <>
            <h1>لوحة تحكم المشرف</h1>
            <div style={{display:'flex', gap:8, flexWrap:'wrap', margin:'8px 0'}}>
                {TABS.map(t=>(
                    <button key={t} className="btn" onClick={()=>setTab(t)}>{t}</button>
                ))}
            </div>
            <div className="card">
                <h3>{tab}</h3>
                <p>محتوى {tab} (placeholder الآن)</p>
            </div>
        </>
    )
}

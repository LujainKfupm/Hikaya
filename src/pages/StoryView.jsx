import { useParams } from 'react-router-dom'

export default function StoryView(){
    const { id } = useParams()
    return (
        <>
            <h1>عرض القصة #{id}</h1>
            <p>نص القصة الكامل.</p>
            <div className="card">
                <h3>التعليقات</h3>
                <p>لا توجد تعليقات بعد.</p>
            </div>
        </>
    )
}

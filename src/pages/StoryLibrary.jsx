import { Link } from 'react-router-dom'
const MOCK = [
    { id:1, title:'مغامرة في الصحراء', author:'ليلى', rating:4.6, moral:'الشجاعة', topic:'مغامرة' },
    { id:2, title:'رحلة إلى الفضاء', author:'خالد', rating:4.2, moral:'الفضول', topic:'فضاء' },
]

export default function StoryLibrary(){
    return (
        <>
            <h1>المكتبة العامة</h1>
            <div className="grid">
                {MOCK.map(s=>(
                    <div className="card" key={s.id}>
                        <h3>{s.title}</h3>
                        <p>المؤلف: {s.author} — ⭐ {s.rating}</p>
                        <p>{s.topic} • {s.moral}</p>
                        <Link to={`/story/${s.id}`} className="btn">قراءة</Link>
                    </div>
                ))}
            </div>
        </>
    )
}

export default function ContactPage(){
    return (
        <>
            <h1>التواصل</h1>
            <form className="card">
                <label>الاسم *</label><input />
                <label>البريد الإلكتروني *</label><input />
                <label>الموضوع *</label><input />
                <label>الرسالة *</label><textarea />
                <button className="btn" type="button">إرسال (وهمي)</button>
            </form>
        </>
    )
}

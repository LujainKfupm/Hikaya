const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function generateStoryAPI(payload) {
    const res = await fetch(`${API_BASE}/api/generate/story`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // later:
            // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        let errorMessage = "فشل في إنشاء القصة من الخادم";
        try {
            const body = await res.json();
            if (body.message) errorMessage = body.message;
        } catch {
            // ignore JSON parse errors
        }
        throw new Error(errorMessage);
    }

    return res.json(); // { story, saved, storyId }
}

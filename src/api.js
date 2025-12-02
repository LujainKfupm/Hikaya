const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function generateStoryAPI(payload, token) {
    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/api/generate/story`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        let message = "فشل في إنشاء القصة من الخادم";
        try {
            const body = await res.json();
            if (body.message) message = body.message;
        } catch {

        }
        throw new Error(message);
    }

    return res.json();
}


export async function fetchPublicStories() {
    const res = await fetch(`${API_BASE}/api/stories/public`, {
        method: "GET",
    });

    if (!res.ok) {
        throw new Error("فشل في جلب القصص من الخادم");
    }

    return res.json();
}

export async function deleteStory(id, authToken) {
    const res = await fetch(`${API_BASE}/api/stories/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
    });

    if (!res.ok) {
        throw new Error("فشل في حذف القصة من الخادم");
    }

    return res.json();
}

export async function fetchMyStories(token) {
    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}/api/stories/mine`, {
        method: "GET",
        headers,
    });

    if (!res.ok) {
        throw new Error("فشل في جلب قصص مكتبتي من الخادم");
    }

    return res.json();
}

export async function fetchStoryById(id) {
    const res = await fetch(`${API_BASE}/api/stories/${id}`);
    if (!res.ok) throw new Error("لم يتم العثور على القصة");
    return res.json();
}

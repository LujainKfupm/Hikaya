const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function generateStoryAPI(payload) {
    const res = await fetch(`${API_BASE}/api/generate/story`, {
        method: "POST",
        headers: getAuthHeaders(),
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


export async function deleteStory(id) {
    const res = await fetch(`${API_BASE}/api/stories/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    if (!res.ok) throw new Error("Delete failed");

    return res.json();
}

export async function fetchMyStories() {
    const res = await fetch(`${API_BASE}/api/stories/mine`, {
        method: "GET",
        headers: getAuthHeaders(),
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

export async function rateStory(id, value) {
    const res = await fetch(`${API_BASE}/api/stories/${id}/rate`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ value }),
    });
    return res.json();
}

export async function addComment(id, text) {
    const res = await fetch(`${API_BASE}/api/stories/${id}/comments`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ text }),
    });
    return res.json();
}

export async function deleteComment(storyId, commentId) {
    const res = await fetch(`${API_BASE}/api/stories/${storyId}/comments/${commentId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    return res.json();
}
export async function sendContactMessage(data) {
    const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        let msg = "فشل في إرسال الرسالة";
        try {
            const body = await res.json();
            if (body.message) msg = body.message;
        } catch {}
        throw new Error(msg);
    }

    return res.json();
}
export async function getAdminMessages() {
    const res = await fetch(`${API_BASE}/api/contact`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!res.ok) {
        throw new Error("فشل في جلب رسائل التواصل");
    }

    return res.json();
}


export function getAuthHeaders() {
    const token =
        (JSON.parse(localStorage.getItem("hikaya_user") || "{}")?.token) ||
        localStorage.getItem("hikaya_token");

    if (!token || token === "null" || token === "undefined") {
        return { "Content-Type": "application/json" };
    }

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}


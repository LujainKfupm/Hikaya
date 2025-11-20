import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getStoryById, deleteCommentById } from "../mocks/mockApi";
import { Star, Calendar, Baby, User, Lock } from "lucide-react";


import drawingContest from "../assets/drawing_contest.png";
import spaceJourney from "../assets/space_journey.png";
import userLibrary from "../assets/user_library.png";


function resolveCover(story) {
    const idKey = String(story?.id || "");
    const title = String(story?.title || "").toLowerCase();
    const topic = String(story?.topic || "").toLowerCase();


    if (idKey === "102") return spaceJourney;
    if (idKey === "103") return drawingContest;


    if (title.includes("فضاء") || topic.includes("فضاء")) return spaceJourney;
    if (title.includes("رسم") || title.includes("عبدالله") || title.includes("عبد الله")) return drawingContest;
    if (title.includes("كنز") || title.includes("سارة")) return userLibrary;

    return userLibrary;
}
function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <p>{message}</p>
                <div className="modal-actions">
                    <button className="btn-cancel" onClick={onCancel}>إلغاء</button>
                    <button className="btn-confirm" onClick={onConfirm}>حذف</button>
                </div>
            </div>
        </div>
    );
}

export default function StoryView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [story, setStory] = useState(null);
    const [modal, setModal] = useState({ show: false, commentId: null });

    const [hoverRating, setHoverRating] = useState(0);
    const [selectedRating, setSelectedRating] = useState(0);
    useEffect(() => {
        let alive = true;
        getStoryById(id)
            .then((data) => {
                if (!alive) return;
                setStory(data || { notFound: true });
            })
            .catch(() => {
                if (alive) setStory({ notFound: true });
            });
        return () => { alive = false; };
    }, [id]);


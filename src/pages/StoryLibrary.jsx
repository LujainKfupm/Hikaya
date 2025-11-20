//import all required dependencies
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getStories, deleteStoryById } from "../mocks/mockApi";
import { Star, Calendar, Baby } from "lucide-react";
import { useAuth } from "../context/AuthContext";
//temporary local array
const MOCK = [];

// reusable confirmation modal for delete actions
function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <p>{message}</p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "16px" }}>
                    <button className="story-card-btn-cancel" onClick={onCancel}>لا</button>
                    <button className="story-card-btn-confirm" onClick={onConfirm}>نعم</button>
                </div>
            </div>
        </div>
    );
}
// base setup for story library component (state, refs, auth, modal)
export default function StoryLibrary() {
    const [, force] = useState(0);
    const mounted = useRef(false);
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    const [modal, setModal] = useState({ show: false, storyId: null });



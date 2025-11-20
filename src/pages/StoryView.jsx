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



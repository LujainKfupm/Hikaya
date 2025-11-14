import { Link } from "react-router-dom";
import { Calendar, User, Star } from "lucide-react";

export default function StoryCard({ story, image }) {
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: "14px",
                overflow: "hidden",
                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
            }}
        >
            {/* --- IMAGE WITH BADGE --- */}
            <div style={{ position: "relative" }}>
                <img
                    src={image}
                    alt={story.title}
                    style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                    }}
                />

                {/* Rating badge */}
                <div
                    style={{
                        position: "absolute",
                        top: "10px",
                        left: "10px",
                        background: "#000",
                        color: "#fff",
                        padding: "4px 10px",
                        fontSize: "14px",
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                    }}
                >
                    <Star size={14} fill="#fff" /> {story.ratingAvg}
                </div>
            </div>

            {/* --- CONTENT --- */}
            <div style={{ padding: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "20px" }}>{story.title}</h3>

                {/* Date + Age */}
                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                        color: "#777",
                        fontSize: "14px",
                        marginTop: "8px",
                    }}
                >
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <User size={16} /> {story.ageRange} سنوات
                    </span>

                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <Calendar size={16} /> 01/10/2025
                    </span>
                </div>

                {/* Topics */}
                <div style={{ marginTop: "14px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {story.topics.map((t, i) => (
                        <div
                            key={i}
                            style={{
                                background: "#f2f2f2",
                                padding: "6px 12px",
                                borderRadius: "20px",
                                fontSize: "14px",
                                color: "#444",
                            }}
                        >
                            {t}
                        </div>
                    ))}
                </div>

                {/* Details Button */}
                <Link
                    to={`/story/${story.id}`}
                    style={{
                        marginTop: "14px",
                        display: "inline-block",
                        color: "#0066ff",
                        fontSize: "15px",
                    }}
                >
                    تفاصيل
                </Link>
            </div>
        </div>
    );
}

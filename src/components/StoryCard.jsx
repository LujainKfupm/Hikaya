import { Link } from "react-router-dom";
import { Calendar, User, Star } from "lucide-react";

export default function StoryCard({ story, image }) {
    return (
        <div className="story-card">
            {/* --- IMAGE WITH BADGE --- */}
            <div className="story-card-image-wrapper">
                <img
                    src={image}
                    alt={story.title}
                    className="story-card-image"
                />

                {/* Rating badge */}
                <div className="story-card-rating">
                    <Star size={14} fill="#fff" /> {story.ratingAvg}
                </div>
            </div>

            {/* --- CONTENT --- */}
            <div className="story-card-body">
                <h3 className="story-card-title">{story.title}</h3>

                {/* Date + Age */}
                <div className="story-card-meta">
                    <span className="story-card-meta-item">
                        <User size={16} /> {story.ageRange} سنوات
                    </span>

                    <span className="story-card-meta-item">
                        <Calendar size={16} /> {story.date}
                    </span>
                </div>

                {/* Topics */}
                <div className="story-card-topics">
                    {story.topics.map((t, i) => (
                        <div
                            key={i} className="story-card-topic">
                            {t}
                        </div>
                    ))}
                </div>

                {/* Details Button */}
                <Link
                    to={`/story/${story.id}`}
                    className="story-card-details-btn">
                    تفاصيل
                </Link>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import './CourseLearning.css';

function VideoLesson({ lesson, onComplete, isCompleted }) {
  const [videoWatched, setVideoWatched] = useState(isCompleted);

  const toYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/embed/")) {
        return url;
      }

      // youtu.be/<id>
      if (u.hostname === "youtu.be") {
        const id = u.pathname.replace("/", "");
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }

      // youtube.com/watch?v=<id>
      if (u.hostname.includes("youtube.com")) {
        const v = u.searchParams.get("v");
        if (v) {
          return `https://www.youtube.com/embed/${v}`;
        }
      }

      // vimeo.com/<id>
      if (u.hostname === "vimeo.com") {
        const id = u.pathname.split("/").filter(Boolean)[0];
        return id ? `https://player.vimeo.com/video/${id}` : "";
      }

      // player.vimeo.com/video/<id>
      if (u.hostname === "player.vimeo.com" && u.pathname.startsWith("/video/")) {
        return url;
      }
      return "";
    } catch {
      return "";
    }
  };

  const embedUrl = toYouTubeEmbedUrl(lesson.videoUrl);

  return (
    <div className="video-lesson">
      <div className="lesson-header">
        <h2>▶️ {lesson.title}</h2>
        {lesson.duration && (
          <span className="duration-badge">{lesson.duration}</span>
        )}
      </div>

      <div className="video-container">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={lesson.title}
            allowFullScreen
            className="video-player"
          />
        ) : (
          <div className="video-placeholder">
            Video URL not available
          </div>
        )}
      </div>

      <div className="lesson-actions">
        {!isCompleted ? (
          <button
            className="complete-button"
            onClick={() => {
              setVideoWatched(true);
              onComplete();
            }}
          >
            ✓ Mark as Complete
          </button>
        ) : (
          <div className="completed-badge">
            ✅ Completed
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoLesson;
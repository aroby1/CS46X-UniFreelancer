/* global process */
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiClock, FiVideo, FiLink } from "react-icons/fi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import "./TutorialDetail.css";

const getEmbedUrl = (url) => {
  if (!url) return null;

  const youtubeMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]+)/i
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/i);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return null;
};

const normalizeResources = (resources = []) => {
  if (!Array.isArray(resources)) return [];
  return resources
    .map((resource, index) => {
      if (!resource) return null;
      if (typeof resource === "string") {
        const trimmed = resource.trim();
        if (!trimmed) return null;
        return { label: `Resource ${index + 1}`, url: trimmed };
      }

      const label = resource.label || resource.name || `Resource ${index + 1}`;
      const url = resource.url || resource.link || "";
      if (!url) return null;

      return { label, url };
    })
    .filter(Boolean);
};

const formatWrittenContent = (content) => {
  if (typeof content !== "string") return [];
  return content
    .split(/\n+/)
    .map((segment) => segment.trim())
    .filter(Boolean);
};

function TutorialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [modal, setModal] = useState({ open: false, title: "", message: "" });
  const modalTimerRef = useRef(null);
  const intentHandledRef = useRef(false);

  useEffect(() => {
    const fetchTutorial = async () => {
      if (!id) {
        setError("Missing tutorial id");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/api/academy/tutorials/${id}`);

        if (!response.ok) {
          throw new Error("Tutorial not found");
        }

        const data = await response.json();
        setTutorial(data);
      } catch (err) {
        console.error("Error fetching tutorial:", err);
        setError(err.message || "Unable to load tutorial");
      } finally {
        setLoading(false);
      }
    };

    fetchTutorial();
  }, [id]);

  useEffect(() => {
    const fetchProfileForStatus = async () => {
      try {
        setAuthChecked(false);
        const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiUrl}/api/users/profile`, {
          credentials: "include",
        });

        if (!response.ok) {
          setIsAuthenticated(false);
          setIsBookmarked(false);
          setIsCompleted(false);
          return;
        }

        const data = await response.json();
        setIsAuthenticated(true);

        const includesId = (collection, targetId) => {
          if (!Array.isArray(collection) || !targetId) return false;
          return collection.some((item) => {
            if (!item) return false;
            if (typeof item === "string") return item === targetId;
            return item._id === targetId;
          });
        };

        setIsBookmarked(includesId(data.bookmarkedTutorials, id));
        setIsCompleted(includesId(data.completedTutorials, id));
      } catch (err) {
        setIsAuthenticated(false);
        setIsBookmarked(false);
        setIsCompleted(false);
      } finally {
        setAuthChecked(true);
      }
    };

    if (id) {
      fetchProfileForStatus();
    }
  }, [id]);

  const handleBack = () => {
    navigate("/academy/tutorials");
  };

  const closeModal = () => {
    setModal({ open: false, title: "", message: "" });
    if (modalTimerRef.current) {
      clearTimeout(modalTimerRef.current);
      modalTimerRef.current = null;
    }
  };

  const openModal = (title, message) => {
    setModal({ open: true, title, message });
    if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
    modalTimerRef.current = setTimeout(() => {
      closeModal();
    }, 1600);
  };

  const goToLoginForIntent = (intent) => {
    const returnTo = `/academy/tutorials/${id}?intent=${encodeURIComponent(intent)}`;
    navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  };

  const clearIntentFromUrl = () => {
    const params = new URLSearchParams(location.search);
    params.delete("intent");
    const next = params.toString();
    navigate(`${location.pathname}${next ? `?${next}` : ""}`, { replace: true });
  };

  const setBookmark = async (next) => {
    if (!id) return;

    try {
      setIsSaving(true);
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/users/tutorials/${id}/bookmark`, {
        method: next ? "POST" : "DELETE",
        credentials: "include",
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        goToLoginForIntent("bookmark");
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to update bookmark");
      }

      setIsBookmarked(next);
      setIsAuthenticated(true);
      openModal(next ? "Saved" : "Removed", next ? "Tutorial bookmarked." : "Bookmark removed.");
    } catch (err) {
      console.error(err);
      openModal("Error", "Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const setCompleted = async (next) => {
    if (!id) return;

    try {
      setIsSaving(true);
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/users/tutorials/${id}/complete`, {
        method: next ? "POST" : "DELETE",
        credentials: "include",
      });

      if (response.status === 401) {
        setIsAuthenticated(false);
        goToLoginForIntent("complete");
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to update completion");
      }

      setIsCompleted(next);
      setIsAuthenticated(true);
      openModal(
        next ? "Completed" : "Updated",
        next ? "Marked as completed." : "Completion removed."
      );
    } catch (err) {
      console.error(err);
      openModal("Error", "Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const run = async () => {
      if (intentHandledRef.current) return;
      if (!authChecked) return;

      const intent = new URLSearchParams(location.search).get("intent");
      if (!intent) {
        intentHandledRef.current = true;
        return;
      }

      if (!isAuthenticated) return;

      if (intent === "bookmark") {
        if (!isBookmarked) await setBookmark(true);
        clearIntentFromUrl();
        intentHandledRef.current = true;
        return;
      }

      if (intent === "complete") {
        if (!isCompleted) await setCompleted(true);
        clearIntentFromUrl();
        intentHandledRef.current = true;
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authChecked, isAuthenticated, isBookmarked, isCompleted, location.search]);

  const thumbnail = tutorial?.thumbnail || tutorial?.thumbnailUrl;
  const resources = normalizeResources(tutorial?.resources);
  const paragraphs = formatWrittenContent(tutorial?.writtenContent);
  const embedUrl = getEmbedUrl(tutorial?.videoUrl);
  const category = tutorial?.category || tutorial?.topic || "General";
  const hasVideo = Boolean(tutorial?.videoUrl);
  const hasArticle = paragraphs.length > 0;
  const publishedDate = tutorial?.createdAt
    ? new Date(tutorial.createdAt).toLocaleDateString()
    : null;

  return (
    <div className="tutorial-detail-page">
      <div className="tutorial-detail-container">
        <button className="back-button" onClick={handleBack}>
          <FiArrowLeft size={18} /> Back to Tutorials
        </button>

        {loading ? (
          <div className="loading-message">Loading tutorial...</div>
        ) : error || !tutorial ? (
          <div className="tutorial-section tutorial-error">
            <h2 className="section-title">Unable to load this tutorial</h2>
            <p className="section-subtitle">{error || "Please try again."}</p>
          </div>
        ) : (
          <>
            <div className="tutorial-hero">
              <button
                type="button"
                className={`bookmark-button ${isBookmarked ? "is-active" : ""}`}
                onClick={() => setBookmark(!isBookmarked)}
                disabled={isSaving}
                title={
                  isAuthenticated
                    ? isBookmarked
                      ? "Remove bookmark"
                      : "Save to profile"
                    : "Sign in to bookmark"
                }
                aria-label={isBookmarked ? "Remove bookmark" : "Bookmark tutorial"}
              >
                {isBookmarked ? <BsBookmarkFill /> : <BsBookmark />}
              </button>

              <div className="tutorial-hero-image">
                {thumbnail ? (
                  <img src={thumbnail} alt={tutorial.title} />
                ) : (
                  <div className="placeholder-hero-image">📘</div>
                )}
              </div>

              <div className="tutorial-hero-content">
                <div className="tutorial-badges">
                  <span className="tutorial-badge tutorial-badge-category">{category}</span>
                  {hasVideo && (
                    <span className="tutorial-badge tutorial-badge-video">Video</span>
                  )}
                  {hasArticle && (
                    <span className="tutorial-badge tutorial-badge-article">Article</span>
                  )}
                </div>

                <h1 className="tutorial-title">{tutorial.title}</h1>
                <p className="tutorial-description">{tutorial.description}</p>

                <div className="tutorial-hero-bottom">
                  <div className="tutorial-meta">
                    <div className="tutorial-meta-item">
                      <FiClock className="tutorial-meta-icon" />
                      <div>
                        <span className="tutorial-meta-label">Duration</span>
                        <span className="tutorial-meta-value">
                          {tutorial.duration || "Self-paced"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {publishedDate && (
                    <p className="published-date">Published {publishedDate}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="tutorial-section">
              <h2 className="section-title">Overview</h2>
              <p className="section-subtitle">
                Everything you need to follow along with this lesson.
              </p>
              <div className="tutorial-overview-copy">
                <p>{tutorial.description}</p>
              </div>
            </div>

            {tutorial.videoUrl && (
              <div className="tutorial-section">
                <h2 className="section-title">Watch the Tutorial</h2>
                <div className="tutorial-video-wrapper">
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title={tutorial.title}
                      className="tutorial-video-frame"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="tutorial-video-fallback">
                      <FiVideo />
                      <p>
                        We couldn&apos;t embed this video, but you can watch it in a new
                        tab.
                      </p>
                      <a
                        className="resource-link"
                        href={tutorial.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open Video
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {paragraphs.length > 0 && (
              <div className="tutorial-section">
                <h2 className="section-title">Written Guide</h2>
                <div className="tutorial-written-content">
                  {paragraphs.map((paragraph, index) => (
                    <p key={`paragraph-${index}`}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="tutorial-section">
              <h2 className="section-title">Resources</h2>
              {resources.length > 0 ? (
                <ul className="tutorial-resources-list">
                  {resources.map((resource, index) => (
                    <li
                      key={`${resource.label}-${index}`}
                      className="tutorial-resource-item"
                    >
                      <div className="tutorial-resource-info">
                        <FiLink />
                        <span>{resource.label}</span>
                      </div>
                      <a
                        className="resource-link"
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="tutorial-empty-state">
                  No downloadable resources have been added yet.
                </p>
              )}
            </div>

            <div className="tutorial-actions">
              <button
                type="button"
                className={`complete-button ${isCompleted ? "is-completed" : ""}`}
                onClick={() => setCompleted(!isCompleted)}
                disabled={isSaving}
                title={
                  isAuthenticated
                    ? isCompleted
                      ? "Mark as not completed"
                      : "Mark as completed"
                    : "Sign in to track completion"
                }
              >
                {isCompleted ? "Completed" : "Mark as Completed"}
              </button>
            </div>

            {modal.open && (
              <div
                className="tutorial-modal-overlay"
                role="dialog"
                aria-modal="true"
                onClick={closeModal}
              >
                <div
                  className="tutorial-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="tutorial-modal-title">{modal.title}</h3>
                  <p className="tutorial-modal-message">{modal.message}</p>
                  <button
                    type="button"
                    className="tutorial-modal-close"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TutorialDetail;

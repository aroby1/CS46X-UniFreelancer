import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// ------------------------------
// STRIPE IMPORTS
// ------------------------------
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// ------------------------------
// CHECKOUT COMPONENT
// ------------------------------
import CheckoutForm from "../../../components/Shared/CheckoutForm";

import { FiClock, FiDollarSign } from 'react-icons/fi';
import './CourseDetail.css';

// ------------------------------
// STRIPE INITIALIZATION
// ------------------------------
// Must be outside component to avoid re-creating Stripe on every render
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
);

console.log(
  "Stripe publishable key:",
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
);

function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ------------------------------
  // STATE
  // ------------------------------
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [openVideos, setOpenVideos] = useState({});

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => {
      const next = { ...prev, [moduleId]: !prev[moduleId] };

      // If closing module, also close its video dropdown
      if (prev[moduleId]) {
        setOpenVideos(v => ({ ...v, [moduleId]: false }));
      }

      return next;
    });
  };

  const toggleVideo = (moduleKey) => {
    setOpenVideos(prev => ({
      ...prev,
      [moduleKey]: !prev[moduleKey]
    }));
  };

  const toYouTubeEmbedUrl = (url) => {
    if (!url) return "";

    try {
      const u = new URL(url);

      // Already an embed link
      if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/embed/")) {
        return url;
      }

      // youtu.be/<id>
      if (u.hostname === "youtu.be") {
        const id = u.pathname.replace("/", "");
        return id ? `https://www.youtube.com/embed/${id}` : "";
      }

      // youtube.com/watch?v=<id>
      const v = u.searchParams.get("v");
      if (v) {
        const list = u.searchParams.get("list");
        return list
          ? `https://www.youtube.com/embed/${v}?list=${encodeURIComponent(list)}`
          : `https://www.youtube.com/embed/${v}`;
      }

      return "";
    } catch {
      return "";
    }
  };

  // Stripe-related state
  const [clientSecret, setClientSecret] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  // ------------------------------
  // FETCH COURSE DATA
  // ------------------------------
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);

        const response = await fetch(`http://localhost:5000/api/academy/courses/${id}`);

        if (!response.ok) {
          throw new Error('Course not found');
        }

        const data = await response.json();
        setCourse(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourse();
  }, [id]);

  // ------------------------------
  // NAVIGATION
  // ------------------------------
  const handleBack = () => {
    navigate('/academy/courses');
  };

  // ------------------------------
  // START ENROLLMENT / PAYMENT FLOW
  // ------------------------------
  const handleEnroll = async () => {
    if (!course) {
      console.warn("handleEnroll called with no course");
      return;
    }

    try {
      setEnrolling(true);

      const res = await fetch(
        "http://localhost:5000/api/payments/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: course._id,
            userId: "TEMP_USER_ID", // replace with real auth user later
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Payment initialization failed");
      }

      // ------------------------------
      // FREE COURSE FLOW
      // ------------------------------
      if (data.free) {
        navigate(`/academy/courses/${course._id}/learn`);
        return;
      }

      // ------------------------------
      // PAID COURSE FLOW
      // ------------------------------
      if (!data.clientSecret) {
        throw new Error("Missing clientSecret from backend");
      }

      setClientSecret(data.clientSecret);

    } catch (err) {
      console.error("Enrollment failed:", err);
      alert(`Enrollment failed: ${err.message}`);
    } finally {
      setEnrolling(false);
    }
  };

  // ------------------------------
  // HELPERS
  // ------------------------------
  const getCoursePrice = (course) => {
    if (!course) return 'Free';
    if (course.isLiteVersion) return 'Free (Lite)';
    if (course.priceAmount && course.priceAmount > 0) {
      return `$${course.priceAmount}`;
    }
    return 'Free';
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    return duration;
  };

  // ------------------------------
  // LOADING STATE
  // ------------------------------
  if (loading) {
    return (
      <div className="course-detail-page">
        <div className="course-detail-container">
          <div className="loading-message">Loading course...</div>
        </div>
      </div>
    );
  }

  // ------------------------------
  // ERROR STATE
  // ------------------------------
  if (error || !course) {
    return (
      <div className="course-detail-page">
        <div className="course-detail-container">
          <button className="back-button" onClick={handleBack}>
            ← Back to Courses
          </button>
          <div className="error-message">
            <h2>Course Not Found</h2>
            <p>{error || 'The course you are looking for does not exist.'}</p>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------
  // MAIN RENDER
  // ------------------------------
  const publishedDate = course?.createdAt
    ? new Date(course.createdAt).toLocaleDateString()
    : null;

  return (
    <div className="course-detail-page">
      <div className="course-detail-container">
        <button className="back-button" onClick={handleBack}>
          ← Back to Courses
        </button>

        {/* ------------------------------
            COURSE HEADER
           ------------------------------ */}
        <div className="course-header-section">
          <div className="course-hero">
            <div className="course-hero-image">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} />
              ) : (
                <div className="placeholder-hero-image">Image</div>
              )}
            </div>

            <div className="course-hero-content">
              <div className="course-badges">
                {course.isLiteVersion && (
                  <span className="lite-badge">Lite Version</span>
                )}
                <span className="difficulty-badge">
                  {course.difficulty || 'Beginner'}
                </span>
                <span className="category-badge">
                  {course.category || 'General'}
                </span>
              </div>

              <h1 className="course-title">{course.title}</h1>

              <div className="course-meta">
                <div className="meta-item">
                  <span>{formatDuration(course.duration)}</span>
                </div>
                <div className="meta-item">
                  <span>{getCoursePrice(course)}</span>
              <div className="course-hero-bottom">
                <div className="course-meta">
                  <div className="course-meta-item">
                    <FiClock className="course-meta-icon" />
                    <div>
                      <span className="course-meta-label">Estimated Time</span>
                      <span className="course-meta-value">{formatDuration(course.duration)}</span>
                    </div>
                  </div>
                  <div className="course-meta-item">
                    <FiDollarSign className="course-meta-icon" />
                    <div>
                      <span className="course-meta-label">Price</span>
                      <span className="course-meta-value">{getCoursePrice(course)}</span>
                    </div>
                  </div>
                </div>

                {publishedDate && (
                  <p className="published-date">Published {publishedDate}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------
            COURSE OVERVIEW
           ------------------------------ */}
        <div className="course-section">
          <h2 className="section-title">Course Overview</h2>
          <div className="course-description">
            {course.description || 'No description available for this course.'}
          </div>
        </div>

        {/* ------------------------------
            COURSE MODULES 
           ------------------------------ */}
        {course.modules && course.modules.length > 0 && (
          <div className="course-section">
            <h2 className="section-title">Course Modules</h2>
            <div className="modules-list">
              {course.modules
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((module, index) => (
                  <div key={module._id || index} className="module-card">
                    <div className="module-header">
                      <div className="module-number">
                        Module {index + 1}
                      </div>
                      <h3 className="module-title">{module.title}</h3>
                    </div>

                    {module.description && (
                      <div className="module-description">
                        <p>{module.description}</p>
                      </div>
                    )}
                  </div>
                ))}
                .map((module, index) => {
                  const moduleKey = module._id || index;
                  const isExpanded = expandedModules[moduleKey];

                  const embedUrl = toYouTubeEmbedUrl(module.videoUrl);

                  return (
                    <div key={moduleKey} className={`module-card ${isExpanded ? 'expanded' : ''}`}>
                      <div className="module-card-header" onClick={() => toggleModule(moduleKey)}>
                        <div className="module-thumbnail">
                          {module.thumbnail ? (
                            <img src={module.thumbnail} alt={`Module ${index + 1}`} />
                          ) : (
                            <div className="module-placeholder-thumbnail" />
                          )}
                        </div>

                        <div className="module-info-compact">
                          <div className="module-number">Module {index + 1}</div>
                          <h3 className="module-title-compact">{module.title}</h3>
                          <div className="module-meta-compact">
                            {(module.duration || module.estimatedMinutes) && (
                              <span className="module-duration-compact">
                                {module.duration || `${module.estimatedMinutes} min`}
                              </span>
                            )}
                          </div>
                          {module.description && (
                            <p className="module-description-preview">
                              {module.description.length > 100
                                ? `${module.description.substring(0, 100)}...`
                                : module.description}
                            </p>
                          )}
                        </div>

                        <div className="module-toggle-icon">
                          {isExpanded ? '−' : '+'}
                        </div>
                      </div>

                      <div className={`module-details-expanded ${isExpanded ? 'expanded' : ''}`}>
                        {module.description && (
                          <div className="module-full-description">
                            <h4 className="module-subtitle">Overview</h4>
                            <p>{module.description}</p>
                          </div>
                        )}

                        {module.learningPoints && module.learningPoints.length > 0 && (
                          <div className="module-learning-points">
                            <h4 className="module-subtitle">Learning Outcomes</h4>
                            <ul className="module-points-list">
                              {module.learningPoints.map((point, pointIndex) => (
                                <li key={pointIndex}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="module-content">
                          {module.videoUrl && (
                            <div className="content-item content-item-video">
                              <button
                                type="button"
                                className="video-toggle"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleVideo(moduleKey);
                                }}
                                aria-expanded={!!openVideos[moduleKey]}
                              >
                                <span className="content-icon">🎥</span>
                                <span>Watch Video</span>
                                <span className="video-toggle-icon">{openVideos[moduleKey] ? '−' : '+'}</span>
                              </button>

                              {openVideos[moduleKey] && embedUrl && (
                                <div
                                  className="video-embed"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <iframe
                                    src={embedUrl}
                                    title={`${module.title || `Module ${index + 1}`} video`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                  />
                                </div>
                              )}
                            </div>
                          )}


                          {module.articleContent && (
                            <div className="content-item">
                              <span className="content-icon">📄</span>
                              <span className="content-text">Article Content Available</span>
                            </div>
                          )}

                          {module.pdfUrl && (
                            <div className="content-item">
                              <span className="content-icon">📕</span>
                              <a href={module.pdfUrl} target="_blank" rel="noopener noreferrer" className="content-link">
                                PDF Resource
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ------------------------------ */}
        {/* COURSE ACTIONS / ENROLLMENT */}
        {/* ------------------------------ */}
        {!clientSecret ? (
        <button
          className="enroll-button"
          onClick={handleEnroll}
          disabled={enrolling}
        >
          {course.isFree
            ? "Enroll Free"
            : enrolling
            ? "Starting Checkout..."
            : `Enroll for $${course.priceAmount}`}
        </button>
      ) : (
        <div className="checkout-container">
          <h3>Complete Your Purchase</h3>
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#0070f3',
                }
              }
            }}
          >
            <CheckoutForm />
          </Elements>
        </div>
      )}

      </div>
    </div>
  );
}

export default CourseDetail;

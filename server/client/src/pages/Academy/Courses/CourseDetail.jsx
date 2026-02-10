/* global process */
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
  const [enrolling, setEnrolling] = useState(false);
  const [user, setUser] = useState(null);

  // ------------------------------
  // FETCH USER DATA
  // ------------------------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users/me', {
          credentials: 'include',
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };

    fetchUser();
  }, []);

  // ------------------------------
  // FETCH COURSE DATA
  // ------------------------------
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/academy/courses/${id}`);

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

    // Check if user is logged in
    if (!user) {
      navigate(`/login?returnTo=/academy/courses/${id}`);
      return;
    }

    try {
      setEnrolling(true);

      const res = await fetch(
        "/api/payments/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            courseId: course._id,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Payment initialization failed");
      }

      // FREE COURSE FLOW
      if (data.free) {
        alert("You've been enrolled in this free course!");
        navigate(`/academy/my-courses`);
        return;
      }

      // PAID COURSE FLOW - Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error("Invalid response from server");

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

 {/* COURSE HEADER */}
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
                  {course.difficulty || "Beginner"}
                </span>
                <span className="category-badge">
                  {course.category || "General"}
                </span>
              </div>

              <h1>{course.title}</h1>

              <div className="course-meta">
                <div>
                  <FiClock /> {course.duration || "N/A"}
                </div>
                <div>
                  <FiDollarSign />{" "}
                  {course.isFree ? "Free" : `$${course.priceAmount}`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COURSE OVERVIEW */}
        <div className="course-section">
          <h2>Course Overview</h2>
          <p>{course.description}</p>
        </div>

        {/* COURSE MODULES */}
        {course.modules?.length > 0 && (
          <div className="course-section">
            <h2>Course Modules</h2>

            {course.modules.map((module, index) => {
              const key = module._id || index;
              const embedUrl = toYouTubeEmbedUrl(module.videoUrl);

              return (
                <div key={key} className="module-card">
                  <div
                    className="module-card-header"
                    onClick={() => toggleModule(key)}
                  >
                    <h3>{module.title}</h3>
                    <span>{expandedModules[key] ? "−" : "+"}</span>
                  </div>

                  {expandedModules[key] && (
                    <div className="module-content">
                      <p>{module.description}</p>

                      {embedUrl && (
                        <>
                          <button onClick={() => toggleVideo(key)}>
                            Watch Video
                          </button>

                          {openVideos[key] && (
                            <iframe
                              src={embedUrl}
                              title={module.title}
                              allowFullScreen
                            />
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ENROLLMENT */}
        {!clientSecret ? (
        <button
          className="enroll-button"
          onClick={handleEnroll}
          disabled={enrolling}
        >
          {course.isFree
            ? enrolling ? "Enrolling..." : "Enroll Free"
            : enrolling
            ? "Starting Checkout..."
            : `Enroll for $${course.priceAmount}`}
        </button>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
    </div>
  );
}

export default CourseDetail;

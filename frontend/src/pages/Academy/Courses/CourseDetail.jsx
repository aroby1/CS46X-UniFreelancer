/* global process */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

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
  const _getCoursePrice = (c) => {
    if (!c) return 'Free';
    if (c.isLiteVersion) return 'Free (Lite)';
    if (c.priceAmount && c.priceAmount > 0) {
      return `$${c.priceAmount}`;
    }
    return 'Free';
  };

  const _formatDuration = (duration) => {
    if (!duration) return 'N/A';
    return duration;
  };

  // ------------------------------
  // LOADING STATE
  // ------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-light-primary pt-8 px-10 max-sm:px-4 max-sm:pt-5">
        <div className="max-w-content mx-auto">
          <div className="text-center py-16 px-5 text-dark-secondary">Loading course...</div>
        </div>
      </div>
    );
  }

  // ------------------------------
  // ERROR STATE
  // ------------------------------
  if (error || !course) {
    return (
      <div className="min-h-screen bg-light-primary pt-8 px-10 max-sm:px-4 max-sm:pt-5">
        <div className="max-w-content mx-auto">
          <button className="bg-transparent border-none text-dark-primary text-base cursor-pointer mb-8 py-2 inline-flex items-center transition-colors duration-300 hover:text-dark-secondary" onClick={handleBack}>
            <FiArrowLeft className="inline mr-1" /> Back to Courses
          </button>
          <div className="text-center py-16 px-5 text-dark-secondary">
            <h2 className="text-dark-primary mb-2.5">Course Not Found</h2>
            <p>{error || 'The course you are looking for does not exist.'}</p>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------
  // MAIN RENDER
  // ------------------------------
  const _publishedDate = course?.createdAt
    ? new Date(course.createdAt).toLocaleDateString()
    : null;

  return (
    <div className="min-h-screen bg-light-primary pt-8 px-10 max-sm:px-4 max-sm:pt-5">
      <div className="max-w-content mx-auto">
        <button className="bg-transparent border-none text-dark-primary text-base cursor-pointer mb-8 py-2 inline-flex items-center transition-colors duration-300 hover:text-dark-secondary" onClick={handleBack}>
          <FiArrowLeft className="inline mr-1" /> Back to Courses
        </button>

 {/* COURSE HEADER */}
        <div className="mb-12">
          <div className="grid grid-cols-[1fr_1.5fr] gap-10 bg-light-tertiary rounded-lg p-10 shadow-card max-md:grid-cols-1 max-md:gap-8 max-sm:p-5">
            <div className="w-full h-[300px] rounded-md overflow-hidden bg-[#f5f5f5] max-md:h-[250px]">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[100px] bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white">Image</div>
              )}
            </div>

            <div className="flex flex-col justify-start">
              <div className="flex gap-3 mb-5 flex-wrap">
                {course.isLiteVersion && (
                  <span className="py-1.5 px-3.5 rounded-full text-sm font-semibold bg-[#e8e8e8] text-[#666]">Lite Version</span>
                )}
                <span className="py-1.5 px-3.5 rounded-full text-sm font-semibold bg-[#e3f2fd] text-[#1976d2]">
                  {course.difficulty || "Beginner"}
                </span>
                <span className="py-1.5 px-3.5 rounded-full text-sm font-semibold bg-[#f3e5f5] text-[#7b1fa2]">
                  {course.category || "General"}
                </span>
              </div>

              <h1 className="text-5xl font-bold text-dark-primary mb-5 leading-tight max-md:text-3xl max-sm:text-2xl">{course.title}</h1>

              <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3 max-sm:grid-cols-1">
                <div className="flex items-center gap-2 text-dark-secondary">
                  <FiClock /> {course.duration || "N/A"}
                </div>
                <div className="flex items-center gap-2 text-dark-secondary">
                  <FiDollarSign />{" "}
                  {course.isFree ? "Free" : `$${course.priceAmount}`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COURSE OVERVIEW */}
        <div className="mb-12 bg-light-tertiary rounded-lg p-10 shadow-card max-md:p-7">
          <h2 className="text-3xl font-bold text-dark-primary mb-6 pb-4 border-b-2 border-border max-sm:text-[22px]">Course Overview</h2>
          <p className="text-base leading-[1.8] text-dark-secondary">{course.description}</p>
        </div>

        {/* COURSE MODULES */}
        {course.modules?.length > 0 && (
          <div className="mb-12 bg-light-tertiary rounded-lg p-10 shadow-card max-md:p-7">
            <h2 className="text-3xl font-bold text-dark-primary mb-6 pb-4 border-b-2 border-border max-sm:text-[22px]">Course Modules</h2>

            {course.modules.map((module, index) => {
              const key = module._id || index;
              const embedUrl = toYouTubeEmbedUrl(module.videoUrl);

              return (
                <div key={key} className="bg-white border border-border rounded-md transition-all duration-300 overflow-hidden mb-5 hover:shadow-md hover:border-[#d0d0d0]">
                  <div
                    className="flex p-5 gap-5 cursor-pointer items-center bg-white hover:bg-[#fcfcfc]"
                    onClick={() => toggleModule(key)}
                  >
                    <h3 className="flex-1 text-lg font-semibold text-dark-primary">{module.title}</h3>
                    <span className="text-2xl text-dark-secondary font-light w-[30px] h-[30px] flex items-center justify-center rounded-full">{expandedModules[key] ? "−" : "+"}</span>
                  </div>

                  {expandedModules[key] && (
                    <div className="flex flex-wrap gap-4 pt-2.5 px-5 pb-5">
                      <p className="text-base text-dark-secondary leading-relaxed">{module.description}</p>

                      {embedUrl && (
                        <>
                          <button
                            onClick={() => toggleVideo(key)}
                            className="py-2 px-4 bg-accent text-white border-none rounded-sm text-base font-medium cursor-pointer transition-colors duration-300 hover:bg-accent-secondary"
                          >
                            Watch Video
                          </button>

                          {openVideos[key] && (
                            <iframe
                              src={embedUrl}
                              title={module.title}
                              allowFullScreen
                              className="w-full aspect-video rounded-md border-0"
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
            className="bg-dark-primary text-white border-none py-4 px-12 text-lg font-semibold rounded cursor-pointer transition-all duration-300 hover:bg-dark-secondary hover:-translate-y-0.5 active:translate-y-0"
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
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
    </div>
  );
}

export default CourseDetail;

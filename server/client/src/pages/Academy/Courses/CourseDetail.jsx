/* global process */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Components
import CheckoutForm from "../../../components/Shared/CheckoutForm";

import { FiClock, FiDollarSign } from "react-icons/fi";
import "./CourseDetail.css";

// Stripe init (outside component)
const stripePromise = loadStripe(
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

  const [clientSecret, setClientSecret] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  // ------------------------------
  // FETCH COURSE
  // ------------------------------
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/academy/courses/${id}`);
        if (!res.ok) throw new Error("Course not found");
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // ------------------------------
  // ENROLL / PAYMENT
  // ------------------------------
  const handleEnroll = async () => {
    if (!course) return;

    try {
      setEnrolling(true);

      // 1️⃣ Confirm logged-in user (cookie auth)
      const meRes = await fetch("/api/users/me", {
        credentials: "include",
      });

      if (!meRes.ok) {
        navigate(`/login?returnTo=/academy/courses/${course._id}`);
        return;
      }

      const user = await meRes.json();

      // 2️⃣ Create payment intent
      const payRes = await fetch("/api/payments/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          courseId: course._id,
          userId: user._id,
        }),
      });

      if (!payRes.ok) {
        const text = await payRes.text();
        throw new Error(text);
      }

      const data = await payRes.json();

      // 3️⃣ Free course → enroll immediately
      if (data.free) {
        await fetch(`/api/users/${user._id}/enroll-course/${course._id}`, {
          method: "POST",
          credentials: "include",
        });

        navigate("/academy/my-courses");
        return;
      }

      // 4️⃣ Paid course → Stripe checkout
      setClientSecret(data.clientSecret);
    } catch (err) {
      console.error("Enrollment failed:", err);
      alert("Enrollment failed. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  // ------------------------------
  // UI STATES
  // ------------------------------
  if (loading) return <p className="loading-message">Loading course...</p>;

  if (error || !course) {
    return (
      <div className="course-detail-page">
        <button onClick={() => navigate("/academy/courses")}>
          ← Back to Courses
        </button>
        <h2>Course not found</h2>
      </div>
    );
  }

  // ------------------------------
  // RENDER
  // ------------------------------
  return (
    <div className="course-detail-page">
      <div className="course-detail-container">
        <button
          className="back-button"
          onClick={() => navigate("/academy/courses")}
        >
          ← Back to Courses
        </button>

        {/* HEADER */}
        <h1>{course.title}</h1>

        <div className="course-meta">
          <span>
            <FiClock /> {course.duration || "Self-paced"}
          </span>
          <span>
            <FiDollarSign />{" "}
            {course.isFree ? "Free" : `$${course.priceAmount}`}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p>{course.description}</p>

        {/* ENROLLMENT */}
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
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
    </div>
  );
}

export default CourseDetail;

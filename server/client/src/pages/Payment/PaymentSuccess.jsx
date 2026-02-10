/* global process */
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./PaymentSuccess.css";

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [paymentIntent, setPaymentIntent] = useState(null);
  const [enrolling, setEnrolling] = useState(true);

  useEffect(() => {
    const enrollUserInCourse = async () => {
      try {
        const paymentIntentId = searchParams.get("payment_intent");
        const courseId = searchParams.get("courseId");

        setPaymentIntent(paymentIntentId);

        if (!courseId) {
          console.error("Missing courseId in URL");
          setEnrolling(false);
          return;
        }

        const apiUrl =
          process.env.REACT_APP_API_URL || "http://localhost:5000";

        // Get logged-in user
        const meRes = await fetch(`${apiUrl}/api/users/me`, {
          credentials: "include",
        });

        if (!meRes.ok) {
          navigate("/login?returnTo=/academy/my-courses");
          return;
        }

        const user = await meRes.json();

        // Enroll user in course
        await fetch(
          `${apiUrl}/api/users/${user._id}/enroll-course/${courseId}`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        setEnrolling(false);
      } catch (err) {
        console.error("Enrollment failed:", err);
        setEnrolling(false);
      }
    };

    enrollUserInCourse();
  }, [navigate, searchParams]);

  const handleGoToMyCourses = () => {
    navigate("/academy/my-courses");
  };

  const handleBrowseCourses = () => {
    navigate("/academy/courses");
  };

  return (
    <div className="payment-success-page">
      <div className="payment-success-container">
        <div className="success-icon">✅</div>

        <h1 className="success-title">Payment Successful! 🎉</h1>

        {enrolling ? (
          <p className="success-message">
            Finalizing your enrollment…
          </p>
        ) : (
          <p className="success-message">
            You now have full access to your course.
          </p>
        )}

        {paymentIntent && (
          <div className="payment-details">
            <p className="payment-id">
              Payment ID: <span>{paymentIntent.slice(0, 20)}…</span>
            </p>
          </div>
        )}

        <div className="success-actions">
          <button
            className="primary-button"
            onClick={handleGoToMyCourses}
            disabled={enrolling}
          >
            Go to My Courses
          </button>

          <button
            className="secondary-button"
            onClick={handleBrowseCourses}
          >
            Browse More Courses
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;

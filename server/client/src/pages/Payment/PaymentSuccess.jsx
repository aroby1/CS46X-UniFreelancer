/* global process */
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./PaymentSuccess.css";

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const paymentIntent = searchParams.get("payment_intent");

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

        <p className="success-message">
          Your payment was processed successfully.
          <br />
          Your course has been added to <strong>My Courses</strong>.
        </p>

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

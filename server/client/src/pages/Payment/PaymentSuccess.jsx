import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './PaymentSuccess.css';

function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentIntent, setPaymentIntent] = useState(null);

  useEffect(() => {
    // Get payment_intent from URL
    const pi = searchParams.get('payment_intent');
    setPaymentIntent(pi);
  }, [searchParams]);

  const handleGoToCourses = () => {
    navigate('/academy/courses');
  };

  const handleGoToMyCourses = () => {
    // Navigate to user's enrolled courses (you'll need to create this route)
    navigate('/academy/my-courses');
  };

  return (
    <div className="payment-success-page">
      <div className="payment-success-container">
        {/* Success Icon */}
        <div className="success-icon">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="40" cy="40" r="40" fill="#10B981" />
            <path
              d="M25 40L35 50L55 30"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="success-title">Payment Successful! 🎉</h1>
        <p className="success-message">
          Thank you for your purchase. You now have full access to your course.
        </p>

        {/* Payment Details */}
        {paymentIntent && (
          <div className="payment-details">
            <p className="payment-id">
              Payment ID: <span>{paymentIntent.substring(0, 20)}...</span>
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="success-actions">
          <button className="primary-button" onClick={handleGoToMyCourses}>
            Go to My Courses
          </button>
          <button className="secondary-button" onClick={handleGoToCourses}>
            Browse More Courses
          </button>
        </div>

        {/* Additional Info */}
        <div className="success-info">
          <p>
            A confirmation email has been sent to your email address.
            <br />
            You can start learning right away!
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
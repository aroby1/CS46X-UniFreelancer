import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5">
      <div className="bg-white rounded-lg py-16 px-10 max-w-[600px] w-full text-center shadow-xl sm:py-10 sm:px-6">
        {/* Success Icon */}
        <div className="flex justify-center mb-8 animate-scale-in">
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
        <h1 className="text-4xl sm:text-2xl font-bold text-dark mb-4">Payment Successful! 🎉</h1>
        <p className="text-lg sm:text-base text-muted mb-8 leading-relaxed">
          Thank you for your purchase. You now have full access to your course.
        </p>

        {/* Payment Details */}
        {paymentIntent && (
          <div className="bg-academy-soft-tertiary rounded p-5 mb-8">
            <p className="text-sm text-muted m-0">
              Payment ID: <span className="text-dark font-semibold font-mono">{paymentIntent.substring(0, 20)}...</span>
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mb-8">
          <button
            className="bg-accent text-white border-none rounded py-3.5 px-7 text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-accent-secondary hover:-translate-y-0.5 hover:shadow-accent"
            onClick={handleGoToMyCourses}
          >
            Go to My Courses
          </button>
          <button
            className="bg-transparent text-accent border-2 border-accent rounded py-3.5 px-7 text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-accent-muted hover:-translate-y-0.5"
            onClick={handleGoToCourses}
          >
            Browse More Courses
          </button>
        </div>

        {/* Additional Info */}
        <div className="border-t border-border pt-5">
          <p className="text-sm text-muted leading-relaxed m-0">
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

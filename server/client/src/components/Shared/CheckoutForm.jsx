import React, { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Wait for PaymentElement to be ready
  useEffect(() => {
    if (!stripe || !elements) {
      return;
    }

    // Give PaymentElement time to mount properly
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [stripe, elements]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.error("Stripe or Elements not loaded");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/academy/payment-success`,
        },
      });

      if (error) {
        // Payment failed - show error to user
        setErrorMessage(error.message);
        setIsSubmitting(false);
      }
      // If no error, user will be redirected to return_url
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMessage("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Loading payment form...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
      <PaymentElement 
        options={{
          layout: "tabs"
        }}
      />

      <button
        type="submit"
        disabled={!stripe || isSubmitting}
        style={{
          marginTop: "20px",
          padding: "12px 24px",
          backgroundColor: isSubmitting ? "#ccc" : "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          width: "100%",
          fontSize: "16px",
        }}
      >
        {isSubmitting ? "Processing..." : "Complete Payment"}
      </button>

      {errorMessage && (
        <div
          style={{
            color: "#d32f2f",
            marginTop: "16px",
            padding: "12px",
            backgroundColor: "#ffebee",
            borderRadius: "4px",
            fontSize: "14px",
          }}
        >
          {errorMessage}
        </div>
      )}
    </form>
  );
}

export default CheckoutForm;
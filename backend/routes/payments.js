const express = require("express");
const Stripe = require("stripe");
const Course = require("../models/CourseModel");

const router = express.Router();

// --------------------------------------------------
// Disable Stripe payments if key is missing (CI)
// --------------------------------------------------
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Stripe payments disabled: STRIPE_SECRET_KEY not set");

  router.post("/create-payment-intent", (req, res) => {
    return res.status(501).json({
      error: "Payments are disabled in this environment",
    });
  });

  module.exports = router;
  return;
}

// --------------------------------------------------
// Stripe is configured (local / prod)
// --------------------------------------------------
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intent", async (req, res) => {
  console.log("/create-payment-intent hit");
  console.log("Request body:", req.body);

  const { courseId, userId } = req.body;

  if (!courseId || !userId) {
    console.warn("Missing courseId or userId");
    return res.status(400).json({ error: "courseId and userId required" });
  }

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      console.warn("Course not found:", courseId);
      return res.status(404).json({ error: "Course not found" });
    }

    console.log("Course found:", {
      title: course.title,
      price: course.priceAmount,
      isFree: course.isFree,
    });

    // ------------------------------
    // FREE COURSE FLOW
    // ------------------------------
    if (course.isFree) {
      console.log("Free course → skipping Stripe");
      return res.json({ free: true });
    }

    const amountInCents = Math.round(course.priceAmount * 100);
    console.log("Creating PaymentIntent:", amountInCents, "cents");

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { courseId, userId },
    });

    console.log("PaymentIntent created:", paymentIntent.id);

    res.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (err) {
    console.error("Stripe backend error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

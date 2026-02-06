const express = require("express");
const Stripe = require("stripe");
const Course = require("../models/CourseModel");

const router = express.Router();

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Stripe payments disabled: STRIPE_SECRET_KEY not set");

  router.post("/create-payment-intent", (req, res) => {
    return res.status(501).json({
      error: "Payments are disabled in this environment",
    });
  });
} else {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  router.post("/create-payment-intent", async (req, res) => {
    const { courseId, userId } = req.body;

    if (!courseId || !userId) {
      return res.status(400).json({ error: "courseId and userId required" });
    }

    try {
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      if (course.isFree) {
        return res.json({ free: true });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(course.priceAmount * 100),
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        metadata: { courseId, userId },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Payment failed" });
    }
  });
}

module.exports = router;

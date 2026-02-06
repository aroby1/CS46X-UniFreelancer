const express = require("express");
const Stripe = require("stripe");
const User = require("../models/UserModel");

const router = express.Router();

// If Stripe is not configured (CI), disable this route safely
if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
  console.warn("Stripe webhook disabled: missing environment variables");

  router.post("/", (req, res) => {
    return res.status(200).json({ received: true });
  });

  module.exports = router;
  return;
}

// Stripe is fully configured
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/", (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    const { courseId, userId } = intent.metadata || {};

    if (courseId && userId) {
      User.findByIdAndUpdate(userId, {
        $addToSet: { enrolledCourses: courseId },
      }).catch(console.error);
    }
  }

  res.json({ received: true });
});

module.exports = router;

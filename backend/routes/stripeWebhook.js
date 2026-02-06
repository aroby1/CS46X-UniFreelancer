const express = require("express");
const Stripe = require("stripe");
const User = require("../models/UserModel");

const router = express.Router();

if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
  console.warn("Stripe webhook disabled: missing env vars");

  router.post("/", (req, res) => {
    res.status(200).json({ received: true });
  });
} else {
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
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const { courseId, userId } = event.data.object.metadata || {};
      if (courseId && userId) {
        User.findByIdAndUpdate(userId, {
          $addToSet: { enrolledCourses: courseId },
        }).catch(console.error);
      }
    }

    res.json({ received: true });
  });
}

module.exports = router;

const express = require("express");
const Stripe = require("stripe");
const User = require("../models/UserModel");

const router = express.Router();

if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
  console.warn("Stripe webhook disabled: missing env vars");

  router.post("/", (_req, res) => {
    res.status(200).json({ received: true });
  });

} else {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  router.post("/", async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ Correct Stripe event for completed checkout
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const { courseId, userId } = session.metadata || {};

      if (!courseId || !userId) {
        console.warn("Missing metadata on checkout session");
        return res.json({ received: true });
      }

      try {
        await User.findByIdAndUpdate(
          userId,
          { $addToSet: { enrolledCourses: courseId } },
          { new: true }
        );

        console.log(`User ${userId} enrolled in course ${courseId}`);
      } catch (err) {
        console.error("Failed to enroll user:", err);
      }
    }

    res.json({ received: true });
  });
}

module.exports = router;

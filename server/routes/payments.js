const express = require("express");
const Stripe = require("stripe");
const Course = require("../models/CourseModel");
const User = require("../models/UserModel");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Stripe payments disabled: STRIPE_SECRET_KEY not set");

  router.post("/create-checkout-session", (req, res) => {
    res.status(501).json({ error: "Payments disabled" });
  });

} else {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // user MUST be authenticated
  router.post("/create-checkout-session", protect, async (req, res) => {
    try {
      const { courseId } = req.body;

      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      // FREE COURSE: Enroll immediately
      if (course.isFree) {
        await User.findByIdAndUpdate(req.user._id, {
          $addToSet: { enrolledCourses: course._id }
        });
        return res.json({ free: true });
      }

      // PAID COURSE: Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: { 
              name: course.title,
              description: course.description || "Course enrollment"
            },
            unit_amount: Math.round(course.priceAmount * 100),
          },
          quantity: 1,
        }],
        success_url: `${process.env.FRONTEND_URL}/academy/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/academy/courses/${course._id}`,
        metadata: {
          courseId: course._id.toString(),
          userId: req.user._id.toString(),
        },
      });

      res.json({ url: session.url });
    } catch (err) {
      console.error("Checkout session error:", err);
      res.status(500).json({ error: err.message });
    }
  });
}

module.exports = router;
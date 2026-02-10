const express = require("express");
const Stripe = require("stripe");
const Course = require("../models/CourseModel");
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
  const { courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ error: "Course not found" });

  if (course.isFree) {
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { enrolledCourses: course._id }
    });
    return res.json({ free: true });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: course.title },
        unit_amount: course.priceAmount * 100,
      },
      quantity: 1,
    }],
    success_url: `${process.env.FRONTEND_URL}/academy/payment-success`,
    cancel_url: `${process.env.FRONTEND_URL}/academy/courses/${course._id}`,
    metadata: {
      courseId: course._id.toString(),
      userId: req.user._id.toString(),
    },
  });

  res.json({ url: session.url });
});

}

module.exports = router;

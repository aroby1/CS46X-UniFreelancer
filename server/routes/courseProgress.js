const express = require("express");
const User = require("../models/UserModel");
const Course = require("../models/CourseModel");
const AssignmentSubmission = require("../models/AssignmentSubmission");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ============================================
// GET course progress for a user
// ============================================
router.get("/:courseId/progress", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const progress = user.courseProgress.find(
      p => p.courseId.toString() === req.params.courseId
    );

    if (!progress) {
      return res.json({
        courseId: req.params.courseId,
        completedLessons: [],
        progressPercentage: 0,
        currentModuleId: null,
        currentLessonId: null
      });
    }

    res.json(progress);
  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// MARK lesson as complete
// ============================================
router.post("/:courseId/progress/lesson/:lessonId/complete", protect, async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    
    const user = await User.findById(req.user._id);
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Find or create progress entry
    let progress = user.courseProgress.find(
      p => p.courseId.toString() === courseId
    );

    if (!progress) {
      progress = {
        courseId,
        completedLessons: [],
        assignmentSubmissions: [],
        quizResults: [],
        lastAccessedAt: new Date()
      };
      user.courseProgress.push(progress);
    }

    // Add lesson to completed if not already there
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    // Update last accessed
    progress.lastAccessedAt = new Date();

    // Calculate progress percentage
    const totalLessons = course.modules.reduce((total, module) => {
      return total + (module.lessons?.length || 0);
    }, 0);

    progress.progressPercentage = totalLessons > 0
      ? Math.round((progress.completedLessons.length / totalLessons) * 100)
      : 0;

    await user.save();

    res.json({
      message: "Lesson marked as complete",
      progress: progress
    });

  } catch (err) {
    console.error("Error marking lesson complete:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// SUBMIT assignment - UPDATED VERSION
// ============================================
router.post("/:courseId/progress/assignment/:lessonId/submit", protect, async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { textSubmission, fileUrl, partAnswers } = req.body;

    const user = await User.findById(req.user._id);
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Find the module and assignment
    let assignmentData = null;
    let moduleName = '';
    let moduleId = null;

    for (const module of course.modules) {
      // Check if this module has an assignment and if the lessonId matches
      if (module.assignment && `${module._id}-assignment` === lessonId) {
        assignmentData = module.assignment;
        moduleName = module.title;
        moduleId = module._id;
        break;
      }
    }

    if (!assignmentData) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    // Calculate max score
    const maxScore = assignmentData.gradingCriteria.reduce((sum, criteria) => sum + criteria.points, 0);

    // Check if student already submitted this assignment
    const existingSubmission = await AssignmentSubmission.findOne({
      student: user._id,
      course: courseId,
      lessonId: lessonId
    });

    if (existingSubmission) {
      return res.status(400).json({ 
        error: "You have already submitted this assignment. It is pending grading." 
      });
    }

    // Create new submission document
    const submission = new AssignmentSubmission({
      student: user._id,
      studentName: user.name,
      studentEmail: user.email,
      course: courseId,
      courseName: course.title,
      module: moduleId,
      moduleName: moduleName,
      lessonId: lessonId,
      assignmentTitle: assignmentData.title,
      assignmentData: {
        parts: assignmentData.parts,
        gradingCriteria: assignmentData.gradingCriteria
      },
      partAnswers: partAnswers,
      fileUrl: fileUrl || '',
      maxScore: maxScore,
      passingScore: 70, // Default passing score
      instructor: course.instructor._id || course.instructor
    });

    await submission.save();

    // Update user progress
    let progress = user.courseProgress.find(
      p => p.courseId.toString() === courseId
    );

    if (!progress) {
      progress = {
        courseId,
        completedLessons: [],
        assignmentSubmissions: [],
        quizResults: [],
        lastAccessedAt: new Date()
      };
      user.courseProgress.push(progress);
    }

    // Add to assignmentSubmissions array (keep for backward compatibility)
    const progressSubmission = {
      lessonId,
      textSubmission: textSubmission || "",
      fileUrl: fileUrl || "",
      submittedAt: new Date()
    };

    const existingIndex = progress.assignmentSubmissions.findIndex(
      sub => sub.lessonId.toString() === lessonId
    );

    if (existingIndex >= 0) {
      progress.assignmentSubmissions[existingIndex] = progressSubmission;
    } else {
      progress.assignmentSubmissions.push(progressSubmission);
    }

    // Mark lesson as complete
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    progress.lastAccessedAt = new Date();

    await user.save();

    res.json({
      message: "Assignment submitted successfully. Your instructor will grade it soon.",
      submission: submission,
      progress: progress
    });

  } catch (err) {
    console.error("Error submitting assignment:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// SUBMIT quiz
// ============================================
router.post("/:courseId/progress/quiz/:lessonId/submit", protect, async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const { answers } = req.body; // array of user answers

    const user = await User.findById(req.user._id);
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Find the quiz lesson
    let quizLesson = null;
    for (const module of course.modules) {
      const lesson = module.lessons.find(l => l._id.toString() === lessonId);
      if (lesson) {
        quizLesson = lesson;
        break;
      }
    }

    if (!quizLesson || quizLesson.type !== 'quiz') {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Grade the quiz
    let correctAnswers = 0;
    const totalQuestions = quizLesson.questions.length;

    quizLesson.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      
      if (question.questionType === 'multiple-choice') {
        if (userAnswer === question.correctAnswer) {
          correctAnswers++;
        }
      } else if (question.questionType === 'short-answer') {
        // Case-insensitive comparison for short answers
        if (userAnswer?.toLowerCase().trim() === question.correctAnswer?.toLowerCase().trim()) {
          correctAnswers++;
        }
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= (quizLesson.passingScore || 70);

    let progress = user.courseProgress.find(
      p => p.courseId.toString() === courseId
    );

    if (!progress) {
      progress = {
        courseId,
        completedLessons: [],
        assignmentSubmissions: [],
        quizResults: [],
        lastAccessedAt: new Date()
      };
      user.courseProgress.push(progress);
    }

    // Save quiz result
    const quizResult = {
      lessonId,
      score,
      totalQuestions,
      correctAnswers,
      answers,
      passed,
      attemptedAt: new Date()
    };

    progress.quizResults.push(quizResult);

    // Mark as complete if passed
    if (passed && !progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    progress.lastAccessedAt = new Date();

    await user.save();

    res.json({
      message: passed ? "Quiz passed!" : "Quiz completed. Try again!",
      result: quizResult
    });

  } catch (err) {
    console.error("Error submitting quiz:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// SUBMIT final test
// ============================================
router.post("/:courseId/progress/test/submit", protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { answers } = req.body;

    const user = await User.findById(req.user._id);
    const course = await Course.findById(courseId);

    if (!course || !course.finalTest) {
      return res.status(404).json({ error: "Final test not found" });
    }

    // Grade the test
    let correctAnswers = 0;
    const totalQuestions = course.finalTest.questions.length;

    course.finalTest.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      if (userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= (course.finalTest.passingScore || 70);

    let progress = user.courseProgress.find(
      p => p.courseId.toString() === courseId
    );

    if (!progress) {
      return res.status(400).json({ error: "No progress found for this course" });
    }

    // Update test results
    progress.finalTestScore = score;
    progress.finalTestPassed = passed;
    progress.finalTestAttempts = (progress.finalTestAttempts || 0) + 1;
    progress.lastAccessedAt = new Date();

    // If passed, mark course as complete
    if (passed) {
      progress.isCompleted = true;
      progress.completedAt = new Date();
      progress.badgeEarned = true;
      progress.progressPercentage = 100;

      // Add to completedCourses if not already there
      if (!user.completedCourses.includes(courseId)) {
        user.completedCourses.push(courseId);
      }
    }

    await user.save();

    res.json({
      message: passed ? "Congratulations! You've completed the course!" : "Test completed. Keep trying!",
      score,
      passed,
      badgeEarned: passed,
      badge: passed ? course.badge : null
    });

  } catch (err) {
    console.error("Error submitting final test:", err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// UPDATE current position (for "continue where you left off")
// ============================================
router.post("/:courseId/progress/position", protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { moduleId, lessonId } = req.body;

    const user = await User.findById(req.user._id);

    let progress = user.courseProgress.find(
      p => p.courseId.toString() === courseId
    );

    if (!progress) {
      progress = {
        courseId,
        completedLessons: [],
        assignmentSubmissions: [],
        quizResults: [],
        currentModuleId: moduleId,
        currentLessonId: lessonId,
        lastAccessedAt: new Date()
      };
      user.courseProgress.push(progress);
    } else {
      progress.currentModuleId = moduleId;
      progress.currentLessonId = lessonId;
      progress.lastAccessedAt = new Date();
    }

    await user.save();

    res.json({ message: "Position updated", progress });

  } catch (err) {
    console.error("Error updating position:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
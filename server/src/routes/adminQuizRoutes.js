const express = require("express");
const router = express.Router();

const {
  createQuiz,
  addQuestion,
  getQuizQuestionsForAdmin,
  updateQuestion,
  deleteQuestion,
  getAllQuizzes,
  toggleQuizPublish,
  deleteQuiz,
  getAllResults,
  getQuestionByIndex
} = require("../controllers/adminQuizController");

const {
  authenticate,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

// ⚙️ Admin Routes — Protected by JWT + Role check
// -------------------------------------------------

// 🧭 Get all quizzes
router.get("/quizzes", authenticate, authorizeRoles("ADMIN"), getAllQuizzes);

// 🧩 Create new quiz
router.post("/quiz", authenticate, authorizeRoles("ADMIN"), createQuiz);

// ➕ Add question to quiz
router.post(
  "/quiz/:quizId/questions",
  authenticate,
  authorizeRoles("ADMIN"),
  addQuestion
);

// 📋 Get quiz questions (with correct answers for admin)
router.get(
  "/quiz/:quizId/questions",
  authenticate,
  authorizeRoles("ADMIN"),
  getQuizQuestionsForAdmin
);

// 🔁 Toggle publish/unpublish
router.patch(
  "/quiz/:id/toggle-publish",
  authenticate,
  authorizeRoles("ADMIN"),
  toggleQuizPublish
);

// ✏️ Update question by ID
router.put(
  "/questions/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  updateQuestion
);

// Previous Question
router.get(
  "/quiz/:quizId/question/:index",
  authenticate,
  authorizeRoles("ADMIN"),
  getQuestionByIndex
);


// ❌ Delete question by ID
router.delete(
  "/questions/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  deleteQuestion
);

// 🗑️ Delete quiz by ID
router.delete(
  "/quiz/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  deleteQuiz
);

// 🧾 Get all user results (✅ Protected properly now)
router.get("/results", authenticate, authorizeRoles("ADMIN"), getAllResults);

module.exports = router;





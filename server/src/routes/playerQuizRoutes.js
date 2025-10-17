const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const {
  getQuizQuestionsPlayer,
  submitQuizAnswers,
} = require("../controllers/playerQuizController");

// Public: fetch questions for player (must be authenticated)
router.get("/:quizId/questions", authenticate, getQuizQuestionsPlayer);

// Submit answers
router.post("/:quizId/submit", authenticate, submitQuizAnswers);

module.exports = router;


// server/src/controllers/quizController.js
// server/src/controllers/quizController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * 🧭 GET /api/quiz/:quizId/instructions
 * Returns quiz metadata (title, duration, totalMarks, question count)
 * Used by frontend instructions page.
 */
// ✅ GET /api/quiz/:quizId/instructions
exports.getQuizInstructions = async (req, res) => {
  try {
    const quizId = parseInt(req.params.quizId);

    if (Number.isNaN(quizId)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    // ✅ Select only fields that actually exist in your schema
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
        id: true,
        title: true,
        totalMarks: true,
        durationMinutes: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { questions: true } },
      },
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // ✅ Map response in frontend-friendly format
    const response = {
      id: quiz.id,
      title: quiz.title,
      totalMarks: quiz.totalMarks,
      durationMinutes: quiz.durationMinutes,
      totalQuestions: quiz._count.questions,
      isPublished: quiz.isPublished,
      negativeMarking: false, // placeholder
      attemptsAllowed: 1,     // placeholder
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("❌ GET INSTRUCTIONS ERROR:", err);
    res.status(500).json({ message: "Server error fetching instructions" });
  }
};


/**
 * 🧾 GET /api/quiz/published
 * Returns all published quizzes (for quiz selection page)
 */
exports.getPublishedQuizzes = async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { isPublished: true },
      orderBy: { id: "desc" },
      select: {
        id: true,
        title: true,
        durationMinutes: true,
        totalMarks: true,
        isPublished: true,
        _count: { select: { questions: true } },
      },
    });
    res.json(quizzes);
  } catch (err) {
    console.error("GET PUBLISHED QUIZZES ERROR:", err);
    res.status(500).json({ message: "Server error fetching quizzes" });
  }
};

/**
 * 🧩 GET /api/quiz/:quizId/meta
 * Returns quiz info for the instructions page (used by frontend /quiz/[quizId]/instructions)
 */
exports.getQuizMeta = async (req, res) => {
  try {
    const quizId = parseInt(req.params.quizId);
    if (Number.isNaN(quizId)) {
      return res.status(400).json({ message: "Invalid quiz ID" });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { _count: { select: { questions: true } } },
    });

    if (!quiz || !quiz.isPublished) {
      return res.status(404).json({ message: "Quiz not found or unpublished" });
    }

    res.json({
      id: quiz.id,
      title: quiz.title,
      durationMinutes: quiz.durationMinutes,
      totalMarks: quiz.totalMarks,
      totalQuestions: quiz._count.questions,
    });
  } catch (err) {
    console.error("GET QUIZ META ERROR:", err);
    res.status(500).json({ message: "Server error fetching quiz meta" });
  }
};


const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* -------------------------------------------------------------------------- */
/* 🧩 CREATE NEW QUIZ                                                         */
/* -------------------------------------------------------------------------- */
exports.createQuiz = async (req, res) => {
  try {
    const { title, totalMarks, durationMinutes, totalQuestions } = req.body;

    // Validation
    if (!title || !totalMarks || !durationMinutes || !totalQuestions) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create Quiz
    const quiz = await prisma.quiz.create({
      data: {
        title,
        totalMarks: parseFloat(totalMarks),
        durationMinutes: parseInt(durationMinutes),
        totalQuestions: parseInt(totalQuestions),
      },
    });

    console.log(`✅ Quiz Created: ${quiz.title} (ID: ${quiz.id})`);
    res.status(201).json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    console.error("❌ Error creating quiz:", error);
    res.status(500).json({ message: "Failed to create quiz" });
  }
};


/* -------------------------------------------------------------------------- */
/* ➕ ADD QUESTION TO QUIZ                                                    */
/* -------------------------------------------------------------------------- */
exports.addQuestion = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { text, options, correctOption, marks } = req.body;

    if (!quizId || !text || !options || correctOption === undefined) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const quizExists = await prisma.quiz.findUnique({
      where: { id: parseInt(quizId) },
    });

    if (!quizExists) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    const question = await prisma.question.create({
      data: {
        quizId: parseInt(quizId),
        text,
        options,
        correctOption: parseInt(correctOption),
        marks: parseFloat(marks) || 2.5,
      },
    });

    console.log(`✅ Question Added to Quiz #${quizId}: ${text}`);
    res.status(201).json({ message: "Question added successfully", question });
  } catch (error) {
    console.error("❌ Error adding question:", error);
    res.status(500).json({ message: "Failed to add question" });
  }
};

/* -------------------------------------------------------------------------- */
/* 📋 GET ALL QUESTIONS (ADMIN VERSION — INCLUDES ANSWERS)                   */
/* -------------------------------------------------------------------------- */
exports.getQuizQuestionsForAdmin = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(quizId) },
      include: { questions: true },
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    res.json({
      quizId: quiz.id,
      title: quiz.title,
      totalQuestions: quiz.questions.length,
      questions: quiz.questions,
    });
  } catch (error) {
    console.error("❌ Error fetching admin questions:", error);
    res.status(500).json({ message: "Failed to fetch questions" });
  }
};

/* -------------------------------------------------------------------------- */
/* ✏️ UPDATE QUESTION                                                        */
/* -------------------------------------------------------------------------- */
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, options, correctOption, marks } = req.body;

    if (!text || !options || correctOption === undefined) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const updated = await prisma.question.update({
      where: { id: parseInt(id) },
      data: {
        text,
        options,
        correctOption: parseInt(correctOption),
        marks: parseFloat(marks) || 2.5,
      },
    });

    console.log(`✏️ Updated Question #${id}`);
    res.json({ message: "Question updated successfully", updated });
  } catch (error) {
    console.error("❌ Error updating question:", error);
    res.status(500).json({ message: "Failed to update question" });
  }
};

/* -------------------------------------------------------------------------- */
/* ❌ DELETE QUESTION                                                        */
/* -------------------------------------------------------------------------- */
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.question.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: "Question not found." });
    }

    await prisma.question.delete({
      where: { id: parseInt(id) },
    });

    console.log(`🗑️ Deleted Question #${id}`);
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting question:", error);
    res.status(500).json({ message: "Failed to delete question" });
  }
};

// ✅ Get all quizzes for admin
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      orderBy: { id: "desc" },
      select: {
        id: true,
        title: true,
        totalMarks: true,
        durationMinutes: true,
        isPublished: true, // ✅ ADD THIS FIELD
        _count: { select: { questions: true } },
      },
    });

    res.json(quizzes);
  } catch (error) {
    console.error("❌ Error fetching quizzes:", error);
    res.status(500).json({ message: "Failed to fetch quizzes" });
  }
};


// ✅ Toggle Publish/Unpublish
exports.toggleQuizPublish = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(id) },
    });

    if (!quiz)
      return res.status(404).json({ message: "Quiz not found" });

    const updated = await prisma.quiz.update({
      where: { id: parseInt(id) },
      data: { isPublished: !quiz.isPublished }, // ✅ Persist change
    });

    res.json({
      message: `Quiz ${updated.isPublished ? "published" : "unpublished"} successfully!`,
      quiz: updated,
    });
  } catch (err) {
    console.error("❌ Toggle publish error:", err);
    res.status(500).json({ message: "Failed to update publish status" });
  }
};

// ✅ Delete a full quiz and its questions
exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    // First check if quiz exists
    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(id) },
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Delete all questions first (if using FK constraints)
    await prisma.question.deleteMany({
      where: { quizId: parseInt(id) },
    });

    // Then delete the quiz
    await prisma.quiz.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "✅ Quiz deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting quiz:", error);
    res.status(500).json({ message: "Failed to delete quiz" });
  }
};

/**
 * 🧾 GET /api/admin/results
 * Returns all user quiz results (only accessible to admins)
 */


exports.getAllResults = async (req, res) => {
  try {
    // ✅ Ensure only admin can access
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    const results = await prisma.result.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } }, // ✅ use 'name'
        quiz: { select: { id: true, title: true, totalMarks: true } },
      },
      orderBy: { submittedAt: "desc" },
    });

    // ✅ Correct mapping using 'name'
    const formatted = results.map((r) => ({
      id: r.id,
      userId: r.user?.id,
      name: r.user?.name || "(Deleted User)", // ✅ correct field
      email: r.user?.email || "—",
      quizTitle: r.quiz?.title || "Untitled Quiz",
      score: r.score,
      totalMarks: r.quiz?.totalMarks || 0,
      correctCount: r.correctCount,
      totalQuestions: r.totalQuestions,
      timeTakenSeconds: r.timeTakenSeconds,
      submittedAt: r.submittedAt,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("GET ADMIN RESULTS ERROR:", err);
    res.status(500).json({ message: "Server error fetching results" });
  }
};

// 📘 Get a single question by quizId and index (0-based)
exports.getQuestionByIndex = async (req, res) => {
  try {
    const quizId = parseInt(req.params.quizId);
    const index = parseInt(req.params.index);

    const questions = await prisma.question.findMany({
      where: { quizId },
      orderBy: { id: "asc" },
    });

    if (index < 0 || index >= questions.length) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json({ question: questions[index], index });
  } catch (err) {
    console.error("❌ getQuestionByIndex Error:", err);
    res.status(500).json({ message: "Server error fetching question" });
  }
};





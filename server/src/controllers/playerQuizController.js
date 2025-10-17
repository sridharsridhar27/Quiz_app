const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * GET /api/quiz/:quizId/questions
 * - Returns quiz metadata + questions (WITHOUT correctOption)
 * - Query params:
 *     ?random=true  -> shuffle questions server-side
 */
exports.getQuizQuestionsPlayer = async (req, res) => {
  try {
    const { quizId } = req.params;
    const randomize = req.query.random === "true";

    // Validate quiz
    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(quizId) },
      select: { id: true, title: true, durationMinutes: true, totalMarks: true, isPublished: true },
    });

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    if (!quiz.isPublished) return res.status(403).json({ message: "Quiz is not published" });

    // Fetch questions: exclude correctOption
    let questions = await prisma.question.findMany({
      where: { quizId: parseInt(quizId) },
      orderBy: { id: "asc" },
      select: {
        id: true,
        text: true,
        options: true,
        marks: true,
      },
    });

    if (randomize) {
      // Fisher-Yates shuffle
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }
    }

    res.json({
      quiz: {
        id: quiz.id,
        title: quiz.title,
        durationMinutes: quiz.durationMinutes,
        totalMarks: quiz.totalMarks,
      },
      totalQuestions: questions.length,
      questions,
    });
  } catch (err) {
    console.error("GET QUESTIONS ERROR:", err);
    res.status(500).json({ message: "Server error fetching questions" });
  }
};

/**
 * POST /api/quiz/:quizId/submit
 * Body: {
 *   answers: [{ questionId: number, selectedOption: number }],
 *   startedAt: ISOString (optional),
 *   endedAt: ISOString (optional)
 * }
 *
 * Response: { score, correctCount, totalQuestions, timeTakenSeconds, rank }
 */
exports.submitQuizAnswers = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { answers, startedAt, endedAt } = req.body;
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Answers are required" });
    }

    // ✅ Fetch quiz meta
    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(quizId) },
      select: { id: true, durationMinutes: true, totalMarks: true, isPublished: true },
    });
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // 🚫 Prevent duplicate submission
    const existingResult = await prisma.result.findFirst({
      where: { userId, quizId: parseInt(quizId) },
    });
    if (existingResult) {
      return res.status(403).json({ message: "You have already submitted this quiz" });
    }

    // ✅ Load correct answers
    const questionIds = answers.map((a) => parseInt(a.questionId));
    const dbQuestions = await prisma.question.findMany({
      where: { quizId: parseInt(quizId) },
      select: { id: true, correctOption: true, marks: true },
    });

    const qMap = {};
    dbQuestions.forEach((q) => (qMap[q.id] = q));

    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    const userAnswersData = [];

    // ✅ Evaluate answers
    for (const ans of answers) {
      const qId = parseInt(ans.questionId);
      const sel = Number(ans.selectedOption);

      if (!qMap[qId]) continue;

      userAnswersData.push({
        userId,
        questionId: qId,
        selectedOption: sel,
      });

      const q = qMap[qId];

      if (sel === -1 || isNaN(sel)) {
        skippedCount++;
      } else if (sel === q.correctOption) {
        score += Number(q.marks || 0);
        correctCount++;
      } else {
        wrongCount++;
      }
    }

    const totalQuestions = dbQuestions.length;
    const maxMarks = dbQuestions.reduce((sum, q) => sum + (q.marks || 0), 0);

    // ✅ Calculate time taken
    let timeTakenSeconds = 0;
    let timeTakenFormatted = "";
    if (startedAt && endedAt) {
      const start = new Date(startedAt).getTime();
      const end = new Date(endedAt).getTime();
      if (isNaN(start) || isNaN(end) || end < start) {
        return res.status(400).json({ message: "Invalid start/end time" });
      }
      timeTakenSeconds = Math.floor((end - start) / 1000);
      const minutes = Math.floor(timeTakenSeconds / 60);
      const seconds = timeTakenSeconds % 60;
      timeTakenFormatted = `${minutes}m ${seconds}s`;
    }

    // ✅ Save data in DB
    await prisma.$transaction(async (tx) => {
      if (userAnswersData.length > 0) {
        await tx.userAnswer.createMany({
          data: userAnswersData,
          skipDuplicates: true,
        });
      }

      await tx.result.create({
        data: {
          userId,
          quizId: parseInt(quizId),
          score,
          correctCount,
          totalQuestions,
          timeTakenSeconds,
        },
      });
    });


    // ✅ Send detailed response for Result Board
    res.json({
      message: "✅ Quiz submitted successfully",
      totalQuestions,
      maxMarks,
      obtainedMarks: score,
      correctCount,
      wrongCount,
      skippedCount,
      timeTakenSeconds,
      timeTakenFormatted,
    });
  } catch (err) {
    console.error("SUBMIT QUIZ ERROR:", err);
    if (err.code === "P2002") {
      return res.status(403).json({ message: "You have already submitted this quiz" });
    }
    res.status(500).json({ message: "Server error submitting quiz" });
  }
};

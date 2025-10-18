"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useTimer from "@/hooks/useTimer";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import Confetti from "react-confetti"; // 🎉 npm install react-confetti

function formatTime(seconds) {
  const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function QuizPlayer({ quiz, questions, quizId, onSubmitted }) {
  const totalQuestions = questions.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [startedAt] = useState(new Date().toISOString());
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  // ✅ Confetti safe render state
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Timer setup
  const durationSeconds = (quiz.durationMinutes || 45) * 60;
  const { secondsLeft } = useTimer({
    durationSeconds,
    onExpire: handleAutoSubmit,
    autoStart: true,
  });

  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (Object.keys(answers).length > 0 && !submitting && !submitted) {
        e.preventDefault();
        e.returnValue = "Are you sure you want to leave? Your answers will be lost.";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [answers, submitting, submitted]);

  function selectOption(questionId, optionIndex) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  }

  function goNext() {
    setCurrentIndex((i) => Math.min(totalQuestions - 1, i + 1));
  }
  function goPrev() {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }

  async function submitQuiz() {
    if (submitting || submitted) return;
    setSubmitting(true);

    const endedAt = new Date().toISOString();
    const payload = {
      answers: Object.entries(answers).map(([qId, selectedOption]) => ({
        questionId: Number(qId),
        selectedOption,
      })),
      startedAt,
      endedAt,
    };

    try {
      const token = localStorage.getItem("accessToken");
      const res = await api.post(`/quiz/${quizId}/submit`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setResult(res.data);
      setSubmitted(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000); // stop confetti

      onSubmitted && onSubmitted(res.data);
    } catch (err) {
      console.error("Submit error:", err);
      alert(err?.response?.data?.message || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  }

  function handleAutoSubmit() {
    if (submitting || submitted) return;
    alert("⏰ Time’s up! Submitting your quiz automatically...");
    submitQuiz();
  }

  const currentQuestion = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;
  const timeRatio = secondsLeft / durationSeconds;

  // ✅ RESULT SCREEN
  if (submitted && result) {
    const {
      totalQuestions,
      maxMarks,
      obtainedMarks,
      correctCount,
      wrongCount,
      skippedCount,
      timeTakenFormatted,
    } = result;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative flex flex-col items-center justify-center h-[85vh] text-center bg-white"
      >
        {/* 🎉 Confetti */}
        {showConfetti && windowSize.width > 0 && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={350}
            gravity={0.25}
            colors={["#6366F1", "#8B5CF6", "#10B981", "#F59E0B"]}
          />
        )}

        {/* 🧾 Result Board */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full"
        >
          <motion.h2
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-indigo-600 mb-6"
          >
            🏁 Quiz Submitted Successfully!
          </motion.h2>

          <div className="space-y-4 text-left text-gray-800">
            <ResultRow label="Total Questions" value={totalQuestions} delay={0.3} />
            <ResultRow label="Maximum Marks" value={maxMarks} delay={0.4} />
            <ResultRow
              label="Obtained Marks"
              value={obtainedMarks}
              color="text-indigo-500"
              delay={0.5}
            />
            <ResultRow
              label="Correct Answers"
              value={correctCount}
              color="text-green-600"
              delay={0.6}
            />
            <ResultRow
              label="Wrong Answers"
              value={wrongCount}
              color="text-red-500"
              delay={0.7}
            />
            <ResultRow
              label="Skipped Questions"
              value={skippedCount}
              color="text-yellow-500"
              delay={0.8}
            />
            <ResultRow
              label="Time Taken"
              value={timeTakenFormatted}
              color="text-gray-600"
              delay={0.9}
            />
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // 🧭 Normal Quiz View
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto bg-white"
    >
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6 overflow-hidden">
        <motion.div
          className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Timer + Question Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-600 font-medium">
          Question {currentIndex + 1} of {totalQuestions}
        </div>

        {/* Circular Timer */}
        <div className="relative w-12 h-12">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="3"
            />
            <motion.path
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#6366F1"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ pathLength: timeRatio }}
              transition={{ ease: "linear", duration: 1 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-gray-700">
            {formatTime(secondsLeft)}
          </div>
        </div>
      </div>

      {/* Animated Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion?.id}
          initial={{ opacity: 0, x: 40, scale: 0.97 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -40, scale: 0.97 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="bg-white p-6 rounded-2xl shadow-xl"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            {currentQuestion?.text}
          </h3>

          <div className="space-y-3">
            {currentQuestion?.options?.map((opt, idx) => {
              const selected = answers[currentQuestion.id] === idx;
              return (
                <motion.button
                  key={idx}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.1 }}
                  onClick={() => selectOption(currentQuestion.id, idx)}
                  className={`w-full text-left p-3 rounded-md border transition-all ${
                    selected
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="font-medium text-gray-800">
                    {String.fromCharCode(65 + idx)}. {opt}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 gap-2">
            <Button
              onClick={goPrev}
              disabled={currentIndex === 0}
              variant="outline"
              className="transition-all hover:scale-105"
            >
              Prev
            </Button>

            <Button
              onClick={() => {
                if (currentIndex < totalQuestions - 1) goNext();
                else submitQuiz();
              }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-all hover:scale-105"
            >
              {currentIndex < totalQuestions - 1
                ? "Next"
                : submitting
                ? "Submitting..."
                : "Submit Quiz"}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// ✅ Small helper component for clean animated result rows
function ResultRow({ label, value, color = "", delay = 0.2 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex justify-between border-b border-gray-100 pb-1"
    >
      <span>{label}:</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </motion.div>
  );
}


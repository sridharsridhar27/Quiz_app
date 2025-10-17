"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function AddQuestionForm() {
  const router = useRouter();
  const { quizId } = router.query;

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [maxQuestions, setMaxQuestions] = useState(40);
  const [initialized, setInitialized] = useState(false);

  /* --------------------------- FETCH EXISTING QUESTIONS --------------------------- */
  useEffect(() => {
    if (!quizId || initialized) return;

    async function fetchExistingQuestions() {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await api.get(`/admin/quiz/${quizId}/questions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // API should return { quiz, questions }
        const existingCount = Array.isArray(res.data.questions)
          ? res.data.questions.length
          : 0;

        setQuestionNumber(existingCount + 1);

        // Optional: dynamic maxQuestions based on quiz metadata
        // const quizTotalQuestions = res.data.quiz?.totalQuestions;
        // if (quizTotalQuestions) setMaxQuestions(quizTotalQuestions);

        setMaxQuestions(40); // default value
        setInitialized(true);
      } catch (err) {
        console.error("❌ Failed to load existing questions:", err);
        setMessage("❌ Failed to load quiz data.");
      }
    }

    fetchExistingQuestions();
  }, [quizId, initialized]);

  /* --------------------------- HANDLE OPTION CHANGE --------------------------- */
  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  /* --------------------------- HANDLE SUBMIT QUESTION --------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quizId) {
      alert("⚠️ Quiz ID not found. Please create a quiz first.");
      return;
    }

    // Basic validation
    if (!question.trim() || options.some((o) => !o.trim())) {
      setMessage("⚠️ Please fill question and all options.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("accessToken");
      await api.post(
        `/admin/quiz/${quizId}/questions`,
        {
          text: question,
          options,
          correctOption,
          marks: 2.5,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Success
      setMessage(`✅ Question ${questionNumber} added successfully!`);

      // Reset inputs
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectOption(0);

      // If this was the final question, redirect
      if (questionNumber >= maxQuestions) {
        setTimeout(() => {
          router.push(`/admin/manage-questions?quizId=${quizId}`);
        }, 900);
        return;
      }

      // Otherwise, go to next question
      setQuestionNumber((prev) => prev + 1);
    } catch (err) {
      console.error("❌ Error adding question:", err);
      setMessage("❌ Failed to add question");
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------- HANDLE FINISH --------------------------- */
  const handleFinish = () => {
    alert("🎯 Quiz setup completed successfully!");
    router.push("/admin");
  };

  /* --------------------------- CALCULATE PROGRESS --------------------------- */
  const progressPercent = Math.round((questionNumber / maxQuestions) * 100);

  /* --------------------------- RENDER UI --------------------------- */
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-xl p-8 shadow-2xl bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center mb-1">
          Add Questions for Quiz #{quizId}
        </h2>

        {/* Progress Bar */}
        <div className="my-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Question {questionNumber} of {maxQuestions}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-in-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <Input
            placeholder={`Enter Question ${questionNumber} Text`}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />

          {options.map((opt, idx) => (
            <Input
              key={idx}
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              required
            />
          ))}

          <div className="flex flex-col items-start space-y-2">
            <label className="font-medium">Correct Option (0–3):</label>
            <Input
              type="number"
              min="0"
              max="3"
              value={correctOption}
              onChange={(e) => setCorrectOption(Number(e.target.value))}
            />
          </div>

          <div className="flex gap-3 mt-4">
            {/* Always a submit button — label changes for final question */}
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : questionNumber < maxQuestions
                ? "Add & Next Question"
                : "Add & Finish Quiz"}
            </Button>
          </div>
        </form>

        {message && (
          <p
            className={`text-center mt-4 ${
              message.startsWith("✅") || message.startsWith("🎉")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </Card>
    </div>
  );
}




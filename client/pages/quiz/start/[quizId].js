"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import QuizPlayer from "@/components/QuizPlayer";
import { Card } from "@/components/ui/card";

export default function StartQuizPage() {
  const router = useRouter();
  const { quizId } = router.query;
  const { user, loading } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // ✅ Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user]);

  // ✅ Fetch quiz questions when quizId changes
  useEffect(() => {
    if (!quizId) return;
    fetchQuizQuestions();
  }, [quizId]);

  // 📦 Fetch quiz + questions data
  async function fetchQuizQuestions() {
  setLoadingQuestions(true);

  try {
    // ✅ Always attach access token manually
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("⚠️ Session expired. Please login again.");
      router.push("/login");
      return;
    }

    const res = await api.get(`/quiz/${quizId}/questions`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setQuiz(res.data.quiz);
    setQuestions(res.data.questions || []);
  } catch (err) {
    console.error("❌ Error fetching quiz:", err);

    // ✅ Handle specific cases
    const status = err.response?.status;

    if (status === 401 || status === 403) {
      alert("Your session has expired. Please log in again.");
      localStorage.removeItem("accessToken");
      router.push("/login");
      return;
    }

    alert("Failed to load quiz. Please try again later.");
    router.push("/quizzes");
  } finally {
    setLoadingQuestions(false);
  }
}


  // 📤 Handle quiz submission
  function handleSubmitted(data) {
    console.log("✅ Quiz submitted result:", data);
  }

  // ⏳ Loading state
  if (loadingQuestions)
    return (
      <p className="p-6 text-center text-gray-600 animate-pulse">
        Loading quiz...
      </p>
    );

  // 🚀 Render quiz player
  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-3xl mx-auto px-4">
        {quiz && questions.length > 0 ? (
          <QuizPlayer
            quiz={quiz}
            questions={questions}
            quizId={quizId}
            onSubmitted={handleSubmitted}
          />
        ) : (
          <Card className="p-6 text-center shadow-md bg-white/80">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">
              No Questions Found
            </h2>
            <p className="text-gray-600">
              This quiz has no questions available.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

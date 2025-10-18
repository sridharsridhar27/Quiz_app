"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function QuizSelectionPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await api.get("/quiz/published");
      setQuizzes(res.data);
    } catch (err) {
      console.error("❌ Failed to load quizzes:", err);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-white px-4">
      <Card className="w-full max-w-4xl p-8 bg-white shadow-2xl rounded-2xl border border-gray-200">
        <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          🧩 Select a Quiz to Begin
        </h1>

        {quizzes.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            No published quizzes yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="p-6 rounded-xl border border-gray-200 shadow-md bg-white hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                <h2 className="text-xl font-semibold mb-2 text-indigo-700">
                  {quiz.title}
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                  Duration: {quiz.durationMinutes} mins | Marks:{" "}
                  {quiz.totalMarks}
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  {quiz._count?.questions ?? 0} questions
                </p>
                <Button
                  onClick={() => router.push(`/quiz/${quiz.id}/instructions`)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white transition-all"
                >
                  Start Quiz 🚀
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}


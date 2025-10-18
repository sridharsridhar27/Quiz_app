"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function CreateQuizForm() {
  const [form, setForm] = useState({
    title: "",
    totalMarks: 100,
    durationMinutes: 45,
    totalQuestions: 40,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await api.post("/admin/quiz", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const quizId = res.data.quiz.id;
      alert("✅ Quiz created successfully!");
      router.push(`/admin/add-question?quizId=${quizId}`);
    } catch (err) {
      console.error("❌ Error creating quiz:", err);
      alert("Failed to create quiz. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-2xl rounded-2xl bg-white">
          <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            🧠 Create New Quiz
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quiz Title
              </label>
              <Input
                name="title"
                placeholder="Enter quiz title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Total Marks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Marks
              </label>
              <Input
                name="totalMarks"
                type="number"
                placeholder="e.g., 100"
                value={form.totalMarks}
                onChange={handleChange}
                required
              />
            </div>

            {/* Total Questions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Questions
              </label>
              <Input
                name="totalQuestions"
                type="number"
                placeholder="e.g., 10"
                value={form.totalQuestions}
                onChange={handleChange}
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <Input
                name="durationMinutes"
                type="number"
                placeholder="e.g., 30"
                value={form.durationMinutes}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 transition-all"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Quiz"}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}



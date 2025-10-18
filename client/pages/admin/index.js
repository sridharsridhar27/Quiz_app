"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/admin/quizzes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizzes(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch quizzes:", err);
      setMessage("⚠️ Could not load quizzes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("🗑️ Delete this quiz and all questions?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      await api.delete(`/admin/quiz/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("✅ Quiz deleted successfully!");
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("❌ Failed to delete quiz:", err);
      setMessage("❌ Could not delete quiz");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      setUpdatingId(id);
      const token = localStorage.getItem("accessToken");

      const res = await api.patch(
        `/admin/quiz/${id}/toggle-publish`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQuizzes((prev) =>
        prev.map((quiz) =>
          quiz.id === id
            ? { ...quiz, isPublished: !quiz.isPublished }
            : quiz
        )
      );

      setMessage(res.data.message);
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      console.error("❌ Toggle publish failed:", err);
      setMessage("❌ Could not update publish status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-12 px-4 flex justify-center bg-white"
    >
      <Card className="w-full max-w-6xl p-8 bg-white shadow-2xl rounded-3xl border border-gray-200">
        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          🧭 Admin Dashboard
        </motion.h1>

        {/* 🔹 Top Actions */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Button
            onClick={() => router.push("/admin/results")}
            className="bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 shadow-lg text-white font-semibold px-6 py-2 min-w-[160px] h-10 rounded-lg transition-all transform hover:scale-[1.03]"
          >
            📊 View Results
          </Button>

          <Button
            onClick={() => router.push("/admin/create-quiz")}
            className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:opacity-90 shadow-lg text-white font-semibold px-6 py-2 min-w-[160px] h-10 rounded-lg transition-all transform hover:scale-[1.03]"
          >
            ➕ Create Quiz
          </Button>
        </motion.div>

        {/* 🧾 Message */}
        <AnimatePresence>
          {message && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`text-center mb-6 font-semibold ${
                message.startsWith("✅")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>

        {/* 🧠 Table */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-12 w-12 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
          </div>
        ) : quizzes.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 italic"
          >
            No quizzes created yet.
          </motion.p>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05 },
              },
            }}
            className="overflow-x-auto rounded-2xl border border-gray-200"
          >
            <table className="min-w-full text-sm overflow-hidden bg-white">
              <thead className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="p-4 text-left">#</th>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Duration</th>
                  <th className="p-4 text-left">Total Marks</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {quizzes.map((quiz, index) => (
                  <motion.tr
                    key={quiz.id}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="border-b border-gray-100 hover:bg-indigo-50 transition-all"
                  >
                    <td className="p-4 font-semibold text-gray-700">
                      {index + 1}
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      {quiz.title}
                    </td>
                    <td className="p-4 text-gray-700">
                      {quiz.durationMinutes} mins
                    </td>
                    <td className="p-4 text-gray-700">
                      {quiz.totalMarks}
                    </td>

                    <td className="p-4 text-center">
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <Button
                          onClick={() => handleTogglePublish(quiz.id)}
                          disabled={updatingId === quiz.id}
                          className={`min-w-[120px] h-9 text-xs font-semibold rounded-full transition-all duration-300 shadow-md ${
                            quiz.isPublished
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white"
                              : "bg-gradient-to-r from-gray-400 to-gray-500 hover:opacity-90 text-white"
                          }`}
                        >
                          {updatingId === quiz.id
                            ? "Updating..."
                            : quiz.isPublished
                            ? "Published"
                            : "Unpublished"}
                        </Button>
                      </motion.div>
                    </td>

                    <td className="p-4 flex justify-center gap-3">
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Link
                          href={`/admin/add-question?quizId=${quiz.id}`}
                          className="inline-flex justify-center items-center min-w-[100px] h-9 bg-gradient-to-r from-green-500 to-lime-500 hover:opacity-90 text-white rounded-md shadow-sm font-medium transition-all text-center"
                        >
                          ➕ Add
                        </Link>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Link
                          href={`/admin/manage-questions?quizId=${quiz.id}`}
                          className="inline-flex justify-center items-center min-w-[100px] h-9 bg-gradient-to-r from-blue-500 to-cyan-500 hover:opacity-90 text-white rounded-md shadow-sm font-medium transition-all text-center"
                        >
                          👁️ View
                        </Link>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Button
                          onClick={() => handleDelete(quiz.id)}
                          className="min-w-[100px] h-9 bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90 text-white rounded-md shadow-sm font-medium"
                        >
                          🗑️ Delete
                        </Button>
                      </motion.div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}




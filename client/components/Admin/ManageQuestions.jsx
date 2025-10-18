"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export default function ManageQuestions() {
  const router = useRouter();
  const { quizId } = router.query;
  const [questions, setQuestions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!quizId) return;
    fetchQuestions();
  }, [quizId]);

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await api.get(`/admin/quiz/${quizId}/questions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setQuestions(Array.isArray(data.questions) ? data.questions : []);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("🗑️ Delete this question permanently?")) return;
    try {
      const token = localStorage.getItem("accessToken");
      await api.delete(`/admin/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Question deleted successfully!");
      fetchQuestions();
    } catch (err) {
      console.error("Delete failed:", err);
      setMessage("❌ Failed to delete question.");
    }
  };

  const handleEditSave = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await api.put(`/admin/questions/${id}`, editing, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Question updated!");
      setEditing(null);
      fetchQuestions();
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("❌ Failed to update question.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center min-h-screen bg-white py-10 px-4"
    >
      <Card className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl p-8 border border-gray-200 transition-all">
        <motion.h2
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          🧠 Manage Quiz Questions
        </motion.h2>

        {/* ✅ Animated Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              key="message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className={`mb-6 text-center font-semibold ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🔄 Loader */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-12 w-12 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
          </div>
        ) : questions.length === 0 ? (
          <p className="text-center text-gray-500 italic py-10">
            No questions added yet for this quiz.
          </p>
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
            className="overflow-x-auto"
          >
            <table className="min-w-full border border-gray-200 rounded-2xl overflow-hidden text-sm bg-white">
              <thead className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left w-1/3">Question</th>
                  <th className="p-3 text-left w-1/3">Options</th>
                  <th className="p-3 text-center">Correct</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q, index) => (
                  <motion.tr
                    key={q.id}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="border-b border-gray-100 hover:bg-indigo-50 transition-all"
                  >
                    <td className="p-3 font-semibold text-gray-700">
                      {index + 1}
                    </td>

                    {/* Question */}
                    <td className="p-3">
                      {editing?.id === q.id ? (
                        <Input
                          value={editing.text}
                          onChange={(e) =>
                            setEditing({ ...editing, text: e.target.value })
                          }
                          className="text-gray-900"
                        />
                      ) : (
                        <span className="font-medium text-gray-900">
                          {q.text}
                        </span>
                      )}
                    </td>

                    {/* Options */}
                    <td className="p-3 space-y-1">
                      {editing?.id === q.id
                        ? editing.options.map((opt, i) => (
                            <Input
                              key={i}
                              value={opt}
                              className="mb-2"
                              onChange={(e) => {
                                const updated = [...editing.options];
                                updated[i] = e.target.value;
                                setEditing({ ...editing, options: updated });
                              }}
                            />
                          ))
                        : q.options.map((opt, i) => (
                            <p key={i} className="text-gray-700">
                              • {opt}
                            </p>
                          ))}
                    </td>

                    {/* Correct Option */}
                    <td className="p-3 text-center">
                      {editing?.id === q.id ? (
                        <Input
                          type="number"
                          min="0"
                          max="3"
                          value={editing.correctOption}
                          onChange={(e) =>
                            setEditing({
                              ...editing,
                              correctOption: Number(e.target.value),
                            })
                          }
                        />
                      ) : (
                        <span className="font-semibold text-indigo-600">
                          {q.correctOption}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-center flex justify-center gap-3 flex-wrap">
                      {editing?.id === q.id ? (
                        <>
                          <Button
                            onClick={() => handleEditSave(q.id)}
                            className="min-w-[100px] h-9 bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white rounded-md font-medium"
                          >
                            💾 Save
                          </Button>
                          <Button
                            onClick={() => setEditing(null)}
                            className="min-w-[100px] h-9 bg-gradient-to-r from-gray-500 to-gray-600 hover:opacity-90 text-white rounded-md font-medium"
                          >
                            ✖ Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => setEditing(q)}
                            className="min-w-[100px] h-9 bg-gradient-to-r from-indigo-500 to-blue-600 hover:opacity-90 text-white rounded-md font-medium"
                          >
                            ✏️ Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(q.id)}
                            className="min-w-[100px] h-9 bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90 text-white rounded-md font-medium"
                          >
                            🗑️ Delete
                          </Button>
                        </>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* 🔙 Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex justify-center"
        >
          <Button
            onClick={() => router.push("/admin")}
            className="min-w-[180px] h-10 bg-gradient-to-r from-gray-800 to-gray-900 hover:opacity-90 text-white font-semibold rounded-lg shadow-md"
          >
            ← Back to Dashboard
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
}

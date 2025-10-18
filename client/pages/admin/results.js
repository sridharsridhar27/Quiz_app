"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function AdminResultsPage() {
  const [results, setResults] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchResults();
  }, []);

  async function fetchResults() {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/admin/results", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch results:", err);
      setError("⚠️ Failed to fetch results. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Extract all unique quiz titles
  const quizTitles = useMemo(() => {
    const titles = results.map((r) => r.quizTitle);
    return ["All", ...new Set(titles)];
  }, [results]);

  // ✅ Filter + Search
  useEffect(() => {
    let data = [...results];
    if (selectedQuiz !== "All") {
      data = data.filter((r) => r.quizTitle === selectedQuiz);
    }
    if (search.trim()) {
      const lower = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.name.toLowerCase().includes(lower) ||
          r.email.toLowerCase().includes(lower)
      );
    }
    setFiltered(data);
  }, [results, selectedQuiz, search]);

  return (
    <div className="min-h-screen py-10 bg-white px-4">
      <Card className="max-w-7xl mx-auto p-8 shadow-2xl bg-white border border-gray-200 rounded-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          📊 User Results Dashboard
        </h1>

        {/* 🧭 Filter & Search Bar */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          {/* Quiz Filter */}
          <select
            className="w-full md:w-1/3 border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-200"
            value={selectedQuiz}
            onChange={(e) => setSelectedQuiz(e.target.value)}
          >
            {quizTitles.map((title, i) => (
              <option key={i} value={title}>
                {title}
              </option>
            ))}
          </select>

          {/* Search Box */}
          <Input
            type="text"
            placeholder="🔍 Search by user name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3"
          />
        </div>

        {/* 🕒 Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-600"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-600 font-medium">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 italic">No results found.</p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="overflow-x-auto"
          >
            <table className="min-w-full border border-gray-200 rounded-lg text-sm bg-white">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Quiz</th>
                  <th className="p-3 text-center">Score</th>
                  <th className="p-3 text-center">Total Marks</th>
                  <th className="p-3 text-center">Correct</th>
                  <th className="p-3 text-center">Total Qs</th>
                  <th className="p-3 text-center">Time</th>
                  <th className="p-3 text-center">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.02 }}
                    className="border-b border-gray-100 hover:bg-indigo-50 transition-all"
                  >
                    <td className="p-3">{i + 1}</td>
                    <td className="p-3 font-medium text-gray-900">{r.name}</td>
                    <td className="p-3 text-gray-700">{r.email}</td>
                    <td className="p-3 text-gray-700">{r.quizTitle}</td>
                    <td className="p-3 text-center text-indigo-600 font-semibold">
                      {r.score}
                    </td>
                    <td className="p-3 text-center">{r.totalMarks}</td>
                    <td className="p-3 text-center text-green-600 font-semibold">
                      {r.correctCount}
                    </td>
                    <td className="p-3 text-center">{r.totalQuestions}</td>
                    <td className="p-3 text-center text-sm text-gray-600">
                      {r.timeTakenSeconds}s
                    </td>
                    <td className="p-3 text-center text-sm text-gray-600">
                      {new Date(r.submittedAt).toLocaleString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </Card>
    </div>
  );
}

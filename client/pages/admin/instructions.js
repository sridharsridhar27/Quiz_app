"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function AdminInstructions() {
  const [form, setForm] = useState({
    title: "",
    instructions: "",
    durationMinutes: "",
    totalQuestions: "",
    maxMarks: "",
    negativeMarking: false,
    attemptsAllowed: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get("/quiz/instructions")
      .then((res) => setForm(res.data))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/quiz/instructions", form);
      setMessage("✅ Saved successfully!");
    } catch {
      setMessage("❌ Failed to save. Make sure you’re logged in as Admin.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4 bg-white">
      <Card className="max-w-2xl w-full bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          ✏️ Edit Quiz Instructions
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Quiz Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <textarea
            className="w-full rounded-lg border border-gray-300 p-3 h-40 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
            placeholder="Write quiz instructions here..."
            value={form.instructions}
            onChange={(e) =>
              setForm({ ...form, instructions: e.target.value })
            }
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              placeholder="Duration (min)"
              value={form.durationMinutes}
              onChange={(e) =>
                setForm({ ...form, durationMinutes: e.target.value })
              }
              required
            />
            <Input
              type="number"
              placeholder="Total Questions"
              value={form.totalQuestions}
              onChange={(e) =>
                setForm({ ...form, totalQuestions: e.target.value })
              }
              required
            />
            <Input
              type="number"
              placeholder="Max Marks"
              value={form.maxMarks}
              onChange={(e) => setForm({ ...form, maxMarks: e.target.value })}
              required
            />
            <Input
              type="number"
              placeholder="Attempts Allowed"
              value={form.attemptsAllowed}
              onChange={(e) =>
                setForm({ ...form, attemptsAllowed: e.target.value })
              }
              required
            />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={form.negativeMarking}
              onChange={(e) =>
                setForm({ ...form, negativeMarking: e.target.checked })
              }
              className="w-4 h-4 accent-indigo-600 cursor-pointer"
            />
            <label className="text-sm text-gray-700">
              No Negative Marking
            </label>
          </div>

          <Button
            type="submit"
            className="w-full mt-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-medium transition-all"
          >
            Save Instructions
          </Button>
        </form>

        {message && (
          <p className="text-center mt-4 font-medium text-gray-700">
            {message}
          </p>
        )}
      </Card>
    </div>
  );
}

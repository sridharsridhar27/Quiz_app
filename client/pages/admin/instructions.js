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
    api.get("/quiz/instructions")
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
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <Card className="max-w-2xl w-full bg-white/80 shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Edit Quiz Instructions</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Quiz Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea
            className="w-full rounded-lg border border-gray-300 p-3 h-40 focus:ring-2 focus:ring-blue-200"
            placeholder="Write quiz instructions here..."
            value={form.instructions}
            onChange={(e) => setForm({ ...form, instructions: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input type="number" placeholder="Duration (min)" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} />
            <Input type="number" placeholder="Total Questions" value={form.totalQuestions} onChange={(e) => setForm({ ...form, totalQuestions: e.target.value })} />
            <Input type="number" placeholder="Max Marks" value={form.maxMarks} onChange={(e) => setForm({ ...form, maxMarks: e.target.value })} />
            <Input type="number" placeholder="Attempts Allowed" value={form.attemptsAllowed} onChange={(e) => setForm({ ...form, attemptsAllowed: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.negativeMarking}
              onChange={(e) => setForm({ ...form, negativeMarking: e.target.checked })}
            />
            <label>No Negative Marking</label>
          </div>
          <Button className="w-full mt-4">Save</Button>
        </form>
        {message && <p className="text-center text-gray-600 mt-4">{message}</p>}
      </Card>
    </div>
  );
}

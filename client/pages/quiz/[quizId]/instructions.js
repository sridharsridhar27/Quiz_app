"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {api} from "@/lib/api"; // ✅ FIXED import
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, HelpCircle, Trophy, AlertCircle, Shield, Zap, CheckCircle } from "lucide-react";

export default function InstructionsPage() {
  const router = useRouter();
  const { quizId } = router.query;
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    if (!quizId) return;
    fetchMeta();
  }, [quizId]);

  const fetchMeta = async () => {
    try {
      const res = await api.get(`/quiz/${quizId}/instructions`); // ✅ FIXED endpoint
      setMeta(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch quiz meta:", err);
    }
  };

  if (!meta) return <p className="text-center mt-10 text-gray-500">Loading instructions...</p>;

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <Card className="max-w-2xl w-full bg-white/80 shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Instructions</h1>

        <ul className="space-y-3 text-gray-700 leading-relaxed mb-6">
          <li className="flex items-start gap-2"><Clock className="w-5 h-5 text-blue-600 mt-1" /> Duration: {meta.durationMinutes} minutes</li>
          <li className="flex items-start gap-2"><HelpCircle className="w-5 h-5 text-blue-600 mt-1" /> Questions: {meta.totalQuestions}</li>
          <li className="flex items-start gap-2"><Trophy className="w-5 h-5 text-blue-600 mt-1" /> Maximum Marks: {meta.totalMarks}</li>
          <li className="flex items-start gap-2"><AlertCircle className="w-5 h-5 text-blue-600 mt-1" /> Negative Marking: {meta.negativeMarking ? "Yes" : "No"}</li>
          <li className="flex items-start gap-2"><Shield className="w-5 h-5 text-blue-600 mt-1" /> Attempts: {meta.attemptsAllowed}</li>
          <li className="flex items-start gap-2"><Zap className="w-5 h-5 text-blue-600 mt-1" /> Start: Click “Start Quiz” to begin</li>
        </ul>

        <div className="flex justify-center">
          <Button
            onClick={() => router.push(`/quiz/start/${quizId}`)}
            className="w-48 bg-blue-600 hover:bg-blue-700 transition-all"
          >
            Start Quiz
          </Button>
        </div>
      </Card>
    </div>
  );
}



import Link from "next/link";
import { useEffect, useState } from "react";
import  {api}  from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QuizzesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user]);

  useEffect(() => {
    fetchPublished();
  }, []);

  async function fetchPublished() {
    try {
      const res = await api.get("/quiz/published");
      setQuizzes(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingList(false);
    }
  }

  return (
    <div className="min-h-screen py-12 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Select a Quiz</h1>

        {loadingList ? (
          <p>Loading...</p>
        ) : quizzes.length === 0 ? (
          <p>No quizzes are published yet.</p>
        ) : (
          <div className="grid gap-4">
            {quizzes.map((q) => (
              <Card key={q.id} className="p-4 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{q.title}</h2>
                  <p className="text-sm text-gray-600">
                    {q._count?.questions || 0} questions — {q.durationMinutes} mins
                  </p>
                </div>
                <div>
                  <Link href={`/quiz/${q.id}/instructions`}>
                    <Button>Open</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

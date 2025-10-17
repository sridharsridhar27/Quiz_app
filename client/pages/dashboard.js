"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">Not logged in</p>;

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-[400px] text-center">
        <h1 className="text-3xl font-semibold text-blue-700 mb-3">
          Welcome, {user.name} 👋
        </h1>
        <p className="text-gray-600 mb-6">{user.email}</p>
        <Button onClick={logout} variant="outline" className="w-full">Logout</Button>
      </Card>
    </div>
  );
}

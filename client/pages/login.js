"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const { login, isAuthLoading, loading } = useAuth(); // loading = initial auth check
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form.email, form.password);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center items-center min-h-[80vh] px-4 bg-white"
    >
      <Card className="w-96 p-6 shadow-2xl bg-white border border-gray-200 rounded-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Login to Continue
        </h2>

        {/* ✨ AnimatePresence for skeleton shimmer */}
        <AnimatePresence mode="wait">
          {loading ? (
            // Skeleton Loading State
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 animate-pulse"
            >
              <div className="h-10 bg-gray-200 rounded-md"></div>
              <div className="h-10 bg-gray-200 rounded-md"></div>
              <div className="h-10 bg-gray-300 rounded-md w-full"></div>
            </motion.div>
          ) : (
            // Actual Form
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <Button
                className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-medium transition-all"
                type="submit"
                disabled={isAuthLoading}
              >
                {isAuthLoading ? "Logging in..." : "Login"}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

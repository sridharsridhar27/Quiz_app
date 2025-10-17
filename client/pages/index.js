"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      {/* ✨ Animated Background Blurs */}
      

      {/* 🧭 Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl p-10 text-center"
      >
        {/* 🎯 Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          QUINVEST Quiz App
        </motion.h1>

        {/* 💬 Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
        >
          Register or login to begin your Quiz Journey
        </motion.p>

        {/* 🔘 Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/login">
            <Button className="w-40 bg-gradient-to-r from-indigo-500 to-blue-600 hover:opacity-90 text-white font-semibold text-lg rounded-xl shadow-lg transition-all transform hover:scale-[1.03]">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button className="w-40 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white font-semibold text-lg rounded-xl shadow-lg transition-all transform hover:scale-[1.03]">
              Register
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* 🌟 Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-10 text-gray-500 dark:text-gray-400 text-sm"
      >
      </motion.p>
    </div>
  );
}



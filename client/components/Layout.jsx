"use client";

import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-all duration-500">
      
      {/* 🧭 Navbar */}
      <Navbar />

      {/* 📜 Main Content */}
      <main className="relative z-10 pt-20 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}






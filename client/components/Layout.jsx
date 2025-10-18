"use client";

import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
<div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      
      {/* 🧭 Navbar */}
      <Navbar />

      {/* 📜 Main Content */}
      <main className="relative z-10 pt-20 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}






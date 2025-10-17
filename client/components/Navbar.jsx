"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full z-50 bg-white/70 dark:bg-gray-900/50 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-[0_2px_20px_rgba(0,0,0,0.05)] transition-all"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3 md:py-4">
        {/* 🧭 Brand Logo */}
        <Link
          href="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight hover:opacity-90 transition-opacity"
        >
          Quinvest<span className="text-gray-700 dark:text-gray-300">Quiz</span>
        </Link>

        {/* 📱 Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        </button>

        {/* 🔗 Desktop Links */}
        <div className="hidden md:flex gap-4 items-center">
          {!user ? (
            <>
              <Link href="/login">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:opacity-90 text-white rounded-md px-5"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white rounded-md px-5"
                >
                  Register
                </Button>
              </Link>
            </>
          ) : (
            <>
              {user.role === "ADMIN" ? (
                <Link href="/admin">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white rounded-md px-5"
                  >
                    Admin Panel
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 text-white rounded-md px-5"
                  >
                    Dashboard
                  </Button>
                </Link>
              )}

              <Button
                onClick={logout}
                size="sm"
                className="bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90 text-white rounded-md px-5"
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 📱 Mobile Dropdown Menu */}
      <motion.div
        initial={false}
        animate={{ height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 px-6 py-3 flex flex-col gap-3 shadow-lg"
      >
        {!user ? (
          <>
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:opacity-90 text-white rounded-md">
                Login
              </Button>
            </Link>
            <Link href="/register" onClick={() => setMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 text-white rounded-md">
                Register
              </Button>
            </Link>
          </>
        ) : (
          <>
            {user.role === "ADMIN" ? (
              <Link href="/admin" onClick={() => setMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-white rounded-md">
                  Admin Panel
                </Button>
              </Link>
            ) : (
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 text-white rounded-md">
                  Dashboard
                </Button>
              </Link>
            )}
            <Button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90 text-white rounded-md"
            >
              Logout
            </Button>
          </>
        )}
      </motion.div>
    </motion.nav>
  );
}



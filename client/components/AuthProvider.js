"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react"; // for spinner icon

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // initial auth check
  const [isAuthLoading, setIsAuthLoading] = useState(false); // for login/register
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((res) => {
        console.log("✅ User restored:", res.data);
        setUser(res.data);
      })
      .catch(async (err) => {
        console.warn("⚠️ Token may be expired, attempting refresh...");
        try {
          const refreshRes = await api.post("/auth/refresh");
          const newAccessToken = refreshRes.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);
          const meRes = await api.get("/auth/me");
          setUser(meRes.data);
        } catch (refreshErr) {
          console.error("❌ Auto-refresh failed:", refreshErr);
          setUser(null);
          localStorage.removeItem("accessToken");
        }
      })
      .finally(() => setLoading(false));
  }, []);
    


  // 📝 Register
  const register = async (formData) => {
    setIsAuthLoading(true);
    try {
      await api.post("/auth/register", formData);
      router.push("/login");
    } catch (err) {
      alert("Registration failed. Please try again.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  //login
  const login = async (email, password) => {
  setIsAuthLoading(true);
  try {
    const res = await api.post("/auth/login", { email, password });
    const { accessToken, refreshToken, user } = res.data;

    // ✅ Save tokens and set user
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    setUser(user);

    console.log("✅ User logged in successfully");

    // ✅ Redirect by role
    if (user.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/quiz");
    }
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    // ✅ Gracefully handle backend messages
    if (err.response) {
      const status = err.response.status;
      const msg = err.response.data?.message || "Unknown error";

      if (status === 401) {
        // Handle unauthorized user (not registered or wrong password)
        if (msg.includes("not found")) {
          // 🧭 User not registered
          if (confirm("⚠️ Account not found. Would you like to register?")) {
            router.push("/register");
          } else {
            alert("Please register to continue.");
          }
        } else if (msg.includes("Invalid credentials")) {
          alert("❌ Incorrect password. Please try again.");
        } else {
          alert("⚠️ Unauthorized. Please check your details.");
        }
      } else if (status === 500) {
        alert("🚨 Server error. Please try again later.");
      } else {
        alert(`⚠️ Error: ${msg}`);
      }
    } else if (err.request) {
      alert("🌐 Network issue. Please check your connection.");
    } else {
      alert("🚨 Something went wrong. Please try again later.");
    }
  } finally {
    setIsAuthLoading(false);
  }
};

  // 🚪 Logout
  const logout = async () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, isAuthLoading }}
    >
      {/* ✅ Global Loading Overlay */}
      <AnimatePresence>
        {isAuthLoading && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex flex-col items-center space-y-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              <Loader2 className="animate-spin text-indigo-600 w-10 h-10" />
              <p className="text-indigo-700 dark:text-indigo-300 font-medium">
                Please wait...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

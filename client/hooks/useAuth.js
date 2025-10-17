
"use client";

import { useContext } from "react";
import { AuthContext } from "@/components/AuthProvider"; // ✅ alias path

export const useAuth = () => useContext(AuthContext);


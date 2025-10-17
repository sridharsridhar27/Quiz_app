// client/lib/api.js
import axios from "axios";

// ✅ Create Axios instance with baseURL and credentials
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

// ✅ Automatically attach access token from localStorage to each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Automatically refresh token if expired (when 403 occurs)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 403 (token expired) and it's not already retried
    if (
  (
    error.response?.status === 401 || 
    error.response?.status === 403
  ) &&
  !originalRequest._retry &&
  !originalRequest.url.includes("/auth/refresh")
){
      originalRequest._retry = true;
      try {
        // Request a new access token using the refresh token
        const res = await api.post("/auth/refresh");
        const newAccessToken = res.data.accessToken;

        // Store new access token
        localStorage.setItem("accessToken", newAccessToken);

        // Update default and current request headers
        api.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshErr) {
        console.error("🔴 Token refresh failed:", refreshErr);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Force logout
      }
    }

    // Pass any other errors
    return Promise.reject(error);
  }
);




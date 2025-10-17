import axios from "axios";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // send refresh token cookie
  headers: { "Content-Type": "application/json" },
});

// refresh access token automatically
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshRes = await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
        const newAccess = refreshRes.data.accessToken;
        localStorage.setItem("accessToken", newAccess);
        api.defaults.headers["Authorization"] = `Bearer ${newAccess}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export const setAccessToken = (token) => localStorage.setItem("accessToken", token);
export const getAccessToken = () => localStorage.getItem("accessToken");
export const removeAccessToken = () => localStorage.removeItem("accessToken");


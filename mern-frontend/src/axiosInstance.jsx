// src/axiosInstance.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// 🚫 Ne koristi se više Authorization ni localStorage

axiosInstance.interceptors.request.use(
  (config) => {
    const method = config.method?.toLowerCase();
    if (["post", "put", "delete"].includes(method)) {
      const csrfToken = localStorage.getItem("csrfToken");
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ⛔ Globalna fallback funkcija za logout
function logoutUser() {
  document.cookie = "accessToken=; Max-Age=0; path=/; secure; SameSite=None";
  document.cookie = "refreshToken=; Max-Age=0; path=/; secure; SameSite=None";
  window.location.href = "/login";
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn("⛔️ 401 interceptor — pokušaj refresh");
      originalRequest._retry = true;
      try {
        await axios.post(`${API_BASE}/refresh-token`, {}, { withCredentials: true });
        console.log("✅ Refresh uspešan!");
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        console.error("❌ Refresh token fail:", refreshErr.response?.data || refreshErr.message);
        localStorage.removeItem("csrfToken");
        logoutUser();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

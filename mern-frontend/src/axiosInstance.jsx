// src/axiosInstance.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Važno za cookie-based auth (access/refresh token)
});

// 🔐 Request Interceptor – dodaj CSRF token ako postoji
axiosInstance.interceptors.request.use(
  (config) => {
    const method = config.method?.toLowerCase();
    if (["post", "put", "delete", "patch"].includes(method)) {
      const csrfToken = localStorage.getItem("csrfToken");
      if (csrfToken) {
        config.headers = {
          ...(config.headers || {}),
          "X-CSRF-Token": csrfToken,
        };
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚪 Automatski logout ako osvežavanje ne uspe
function logoutUser() {
  document.cookie = "accessToken=; Max-Age=0; path=/; secure; SameSite=None";
  document.cookie = "refreshToken=; Max-Age=0; path=/; secure; SameSite=None";
  localStorage.removeItem("csrfToken");
  window.location.href = "/login";
}

// 🔁 Response Interceptor – automatski refresh token na 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn("🔁 401 – pokušaj refresh...");
      originalRequest._retry = true;
      try {
        const csrfToken = localStorage.getItem("csrfToken");
        await axiosInstance.post("/refresh-token", {}, {
          headers: {
            ...(originalRequest.headers || {}),
            "X-CSRF-Token": csrfToken,
          },
        });
        console.log("✅ Refresh uspešan, retry originalnog zahteva");
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        console.error("❌ Refresh token fail:", refreshErr.response?.data || refreshErr.message);
        logoutUser();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

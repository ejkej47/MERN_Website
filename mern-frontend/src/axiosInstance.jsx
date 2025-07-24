// src/axiosInstance.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // omogućava slanje cookie-ja (npr. accessToken, refreshToken)
});

// ✅ Automatski dodaj CSRF token za sve mutirajuće zahteve
axiosInstance.interceptors.request.use(
  (config) => {
    const method = config.method?.toLowerCase();
    if (["post", "put", "delete", "patch"].includes(method)) {
      const csrfToken = localStorage.getItem("csrfToken");
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ⛔ Logout fallback
function logoutUser() {
  document.cookie = "accessToken=; Max-Age=0; path=/; secure; SameSite=None";
  document.cookie = "refreshToken=; Max-Age=0; path=/; secure; SameSite=None";
  window.location.href = "/login";
}

// ✅ Interceptor za automatski refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn("⛔️ 401 interceptor — pokušaj refresh");
      originalRequest._retry = true;
      try {
        const csrfToken = localStorage.getItem("csrfToken"); // ⬅️ Dodato
        await axiosInstance.post(
          "/refresh-token",
          {},
          {
            headers: {
              "X-CSRF-Token": csrfToken,
            },
          }
        );
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

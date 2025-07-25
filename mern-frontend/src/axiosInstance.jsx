// src/axiosInstance.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// 🔐 Dodaj CSRF token za mutirajuće zahteve
axiosInstance.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase();
  if (["post", "put", "patch", "delete"].includes(method)) {
    const csrf = localStorage.getItem("csrfToken");
    if (csrf) config.headers["X-CSRF-Token"] = csrf;
  }
  return config;
}, Promise.reject);

// 🚪 Logout fallback
function logoutUser() {
  document.cookie = "accessToken=; Max-Age=0; path=/; secure; SameSite=None";
  document.cookie = "refreshToken=; Max-Age=0; path=/; secure; SameSite=None";
  window.location.href = "/login";
}

// 🔄 Refresh token automatski na 401
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        await axiosInstance.post("/refresh-token", {}, {
          headers: {
            "X-CSRF-Token": localStorage.getItem("csrfToken"),
          },
        });
        return axiosInstance(original);
      } catch (refreshErr) {
        console.error("❌ Refresh fail:", refreshErr.response?.data || refreshErr.message);
        localStorage.removeItem("csrfToken");
        logoutUser();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;

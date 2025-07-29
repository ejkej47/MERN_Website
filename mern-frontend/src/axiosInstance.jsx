// src/axiosInstance.js
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// ✅ Automatski dodaj CSRF token za mutirajuće zahteve
axiosInstance.interceptors.request.use(
  (config) => {
    const method = config.method?.toLowerCase();
    const csrfToken = Cookies.get("_csrf");

    if (csrfToken && ["post", "put", "delete", "patch"].includes(method)) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Refresh token interceptor sa retry mehanizmom
let isRefreshing = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshing
    ) {
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const csrfToken = Cookies.get("_csrf");

        await axiosInstance.post(
          "/refresh-token",
          {},
          {
            headers: {
              "X-CSRF-Token": csrfToken,
            },
          }
        );

        isRefreshing = false;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        isRefreshing = false;
        ["accessToken", "refreshToken"].forEach((name) => {
          document.cookie = `${name}=; Max-Age=0; path=/; secure; SameSite=None`;
        });
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

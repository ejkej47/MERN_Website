// src/axiosInstance.js
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// ✅ Dodaj CSRF token automatski za POST/PUT/DELETE/PATCH
axiosInstance.interceptors.request.use(
  (config) => {
    const method = config.method?.toLowerCase();
    const csrfToken = Cookies.get("_csrf");

    if (csrfToken && ["post", "put", "delete", "patch"].includes(method)) {
      config.headers = {
        ...config.headers,
        "X-CSRF-Token": csrfToken,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Refresh token interceptor (bez redirekcije, ali retry original request)
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

        console.log("🔁 401 – pokušavam refresh token...");
        await axiosInstance.post(
          "/refresh-token",
          {},
          {
            headers: {
              ...originalRequest.headers,
              "X-CSRF-Token": csrfToken,
            },
          }
        );

        console.log("✅ Refresh uspešan, retry originalnog zahteva");
        isRefreshing = false;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        console.error(
          "❌ Refresh token nije uspeo:",
          refreshErr.response?.data || refreshErr.message
        );
        isRefreshing = false;

        // ✅ Brišemo cookie-je u slučaju neuspeha
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

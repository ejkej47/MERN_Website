// src/axiosInstance.js
import axios from "axios";

// ✅ Tvoj backend URL
const API_BASE = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // bitno za cookie-auth
});

// ✅ Utility za čitanje cookie-ja
function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return decodeURIComponent(match[2]);
}

// ✅ Interceptor za CSRF token iz cookie-ja
axiosInstance.interceptors.request.use(
  (config) => {
    const csrfToken = getCookie("_csrf"); // čitamo čitljiv cookie
    if (csrfToken) {
      config.headers["x-csrf-token"] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

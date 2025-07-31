// src/axiosInstance.local.js
import axios from "axios";

// Čitanje cookie-ja iz dokumenta
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const method = config.method?.toLowerCase();
    const needsCsrf = ["post", "put", "patch", "delete"].includes(method);

    if (needsCsrf) {
      const token = getCookie("_csrf");
      if (token) {
        config.headers["x-csrf-token"] = token;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

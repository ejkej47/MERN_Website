import axios from "axios";

// CSRF token iz cookie-ja
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // mora za cookie-auth
});

// 🚨 Dodaj CSRF token u header (double submit pattern)
axiosInstance.interceptors.request.use(
  (config) => {
    const csrfToken = getCookie("_csrf");
    if (csrfToken && ["post", "put", "patch", "delete"].includes(config.method)) {
      config.headers["x-csrf-token"] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

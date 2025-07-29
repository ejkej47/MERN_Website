import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Globalni CSRF token (opciono — možeš i u memoriji)
let csrfToken = "";

export const setCsrfToken = (token) => {
  csrfToken = token;
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (csrfToken && ["post", "put", "delete"].includes(config.method)) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

// src/axiosInstance.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // omogućava slanje HTTP-only cookies
});

// Interceptor za request
axiosInstance.interceptors.request.use(
  async (config) => {
    const method = config.method?.toLowerCase();

    // 1) CSRF token za POST/PUT/DELETE
    if (["post", "put", "delete"].includes(method)) {
      let csrfToken = localStorage.getItem("csrfToken");

      // Ako nema u localStorage, povuci
      if (!csrfToken) {
        try {
          const { data } = await axios.get(`${API_BASE}/csrf-token`, {
            withCredentials: true,
          });
          csrfToken = data.csrfToken;
          localStorage.setItem("csrfToken", csrfToken);
        } catch (err) {
          console.error("❌ Ne mogu da dohvatim CSRF token:", err);
        }
      }

      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
    }

    // 2) Authorization header ako postoji access token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor za response (refresh token ako istekne access)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshRes = await axios.post(
          `${API_BASE}/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshRes.data.token;
        localStorage.setItem("token", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        console.error("❌ Token refresh failed:", refreshErr);
        localStorage.removeItem("token");
        localStorage.removeItem("csrfToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

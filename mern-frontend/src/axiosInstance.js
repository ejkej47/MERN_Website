// src/axiosInstance.js
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // omogućava slanje HTTP-only cookies
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const method = config.method && config.method.toLowerCase();

    // 1) Za POST/PUT/DELETE: najpre dohvatamo CSRF token
    if (["post", "put", "delete"].includes(method)) {
      // ako još nismo učitali CSRF
      if (!axiosInstance.defaults.headers["X-CSRF-Token"]) {
        try {
          const { data } = await axios.get(`${API_BASE}/csrf-token`, {
            withCredentials: true,
          });
          const csrfToken = data.csrfToken;
          // postavimo ga globalno i za ovaj zahtev
          axiosInstance.defaults.headers["X-CSRF-Token"] = null;
          config.headers["X-CSRF-Token"] = csrfToken;
        } catch (err) {
          console.error("Ne mogu da dohvatim CSRF token", err);
        }
      } else {
        // već imamo globalni CSRF token
        config.headers["X-CSRF-Token"] =
          axiosInstance.defaults.headers["X-CSRF-Token"];
      }
    }

    // 2) Dodaj Authorization header ako postoji access token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ako je access token istekao i još nije próbano osvežavanje
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // refresh token u cookie-u
        const refreshRes = await axios.post(
          `${API_BASE}/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshRes.data.token;
        console.log("Access token uspešno osvežen:", newToken);
        localStorage.setItem("token", newToken);

        // i ponovo pošalji originalni zahtev
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        console.error("Token refresh failed", refreshErr);
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

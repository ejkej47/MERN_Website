// src/axiosInstance.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // omogućava slanje HTTP-only cookies
});

// Interceptor za request
axiosInstance.interceptors.request.use(
  (config) => {
    const method = config.method?.toLowerCase();

    // ✅ 1) Dodaj CSRF token za mutirajuće zahteve
    if (["post", "put", "delete"].includes(method)) {
      const csrfToken = localStorage.getItem("csrfToken");
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
    }

    // ❌ 2) Više NE DODAJEMO Authorization header iz localStorage tokena
    // (token je već u HTTP-only cookie koji se šalje automatski)

    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor za response — pokušaj refresh tokena ako je 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
  console.warn("⛔️ 401 interceptor — pokušaj refresh");
  originalRequest._retry = true;
  try {
    const refreshRes = await axios.post(
      `${API_BASE}/refresh-token`,
      {},
      { withCredentials: true }
    );
    console.log("✅ Refresh uspešan!");
    return axiosInstance(originalRequest);
  } catch (refreshErr) {
    console.error("❌ Refresh token fail u interceptoru:", refreshErr.response?.data || refreshErr.message);
    localStorage.removeItem("csrfToken");
    //window.location.href = "/login"; // ovde se desi reload/flicker
  }
}


    return Promise.reject(error);
  }
);

export default axiosInstance;

// src/axiosInstance.jsx
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // ✅ potrebno za cookie-based auth
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const method = config.method?.toLowerCase();
    const needsCsrf = ["post", "put", "patch", "delete"].includes(method);

    if (needsCsrf) {
      // 🎯 UVEK fetchuj token pre svakog osjetljivog zahteva
      try {
        const res = await axiosInstance.get("/csrf-token");
        const token = res.data.csrfToken;

        if (token) {
          config.headers["x-csrf-token"] = token;
        }
      } catch (err) {
        console.warn("⚠️ Neuspešan pokušaj dohvata CSRF tokena:", err.message);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

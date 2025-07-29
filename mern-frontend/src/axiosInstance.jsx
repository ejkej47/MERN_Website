import axios from "axios";
import { getCachedCsrfToken, setCachedCsrfToken } from "./utils/csrfMeta";

// Pročitaj cookie ručno
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

// Glavni instanca
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// 🔁 Request transformer za CSRF token
axiosInstance.interceptors.request.use(
  async (config) => {
    const method = config.method?.toLowerCase();
    const needsCsrf = ["post", "put", "patch", "delete"].includes(method);

    if (needsCsrf) {
      // 🧠 1. Pokušaj da koristiš keširani token
      let token = getCachedCsrfToken();

      // ❌ 2. Ako keš ne postoji, pokušaj iz cookie-ja
      if (!token) {
        token = getCookie("_csrf");
      }

      // 🔁 3. Ako i dalje nemaš, pozovi backend
      if (!token) {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/csrf-token`, {
            withCredentials: true,
          });
          token = res.data.csrfToken;
          setCachedCsrfToken(token); // 🧠 keširaj
        } catch (err) {
          console.warn("⚠️ Failed to fetch CSRF token:", err);
        }
      }

      if (token) {
        config.headers["x-csrf-token"] = token;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

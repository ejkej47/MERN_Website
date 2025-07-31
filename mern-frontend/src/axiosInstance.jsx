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

      // 🔁 3. Ako i dalje nemaš, pozovi backend
      if (!token) {
        try {
          const res = await axiosInstance.get("/csrf-token"); // koristi istu instancu
          token = res.data.csrfToken;
          setCachedCsrfToken(token);
        } catch (err) {
          console.warn("⚠️ Neuspešno dohvatanje CSRF tokena:", err);
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

import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const tryRefreshToken = async () => {
    try {
      const res = await axiosInstance.post("/refresh-token");
      console.log("🔁 Refresh token uspešan:", res.status);

      const res2 = await axiosInstance.get("/me");
      setUser(res2.data.user);
    } catch (err) {
      console.error("❌ Refresh token neuspešan:", err.message);
      localStorage.removeItem("hasSession");
      setUser(null);
    }
  };

  const fetchUser = async () => {
    try {
      if (import.meta.env.MODE === "production") {
        const csrfRes = await axiosInstance.get("/csrf-token");
        if (csrfRes.data.csrfToken) {
          localStorage.setItem("csrfToken", csrfRes.data.csrfToken);
          console.log("🛡️ CSRF token postavljen:", csrfRes.data.csrfToken);
        }
      }

      const res = await axiosInstance.get("/me");
      setUser(res.data.user);
      console.log("✅ Autentifikovan:", res.data.user);
    } catch (err) {
      if (err.response?.status === 401) {
        console.log("🔁 /me vraća 401, pokušaj refresh...");
        await tryRefreshToken();
      } else {
        console.error("❌ fetchUser nije uspeo:", err.message);
        localStorage.removeItem("hasSession");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    console.log("🚪 Login uspešan:", userData);
    setUser(userData);
    localStorage.setItem("hasSession", "true");
    setLoading(false);
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/logout");
      console.log("✅ Logout uspešan");
    } catch (err) {
      console.error("❌ Logout greška:", err.response?.data || err.message);
    } finally {
      document.cookie = "accessToken=; Max-Age=0; path=/; secure; SameSite=None";
      document.cookie = "refreshToken=; Max-Age=0; path=/; secure; SameSite=None";
      document.cookie = "_csrf=; Max-Age=0; path=/; secure; SameSite=None";
      localStorage.removeItem("csrfToken");
      localStorage.removeItem("hasSession");
      setUser(null);
      setLoading(false);
      navigate("/login");
    }
  };

  useEffect(() => {
    const hasSession = localStorage.getItem("hasSession") === "true";
    const protectedPaths = ["/my-courses"];
    const isProtected = protectedPaths.includes(location.pathname);

    // 🔒 Ako je zaštićena ruta — uvek pokušaj fetch
    if (isProtected) {
      fetchUser();
      return;
    }

    // 🌍 Ako je javna ruta i znamo da postoji sesija — pokušaj da dobiješ user-a
    if (hasSession && !user) {
      fetchUser();
      return;
    }

    // ✅ Inače — nije potrebno čekati
    setLoading(false);
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

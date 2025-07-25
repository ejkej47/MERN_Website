import { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axiosInstance from "../axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate(); // ✅ pomeren ovde

  // 🔐 Dobavljanje korisnika + CSRF tokena
  const fetchUser = async () => {
    try {
      const csrfRes = await axiosInstance.get("/csrf-token");
      if (csrfRes.data.csrfToken) {
        localStorage.setItem("csrfToken", csrfRes.data.csrfToken);
        console.log("🛡️ CSRF token postavljen:", csrfRes.data.csrfToken);
      }

      const res = await axiosInstance.get("/me");
      setUser(res.data.user);
      console.log("✅ Autentifikovan:", res.data.user);
    } catch (err) {
      console.error("❌ Refresh token neuspešan:", err.message);
      localStorage.removeItem("csrfToken");
      setUser(null); // Dodaj ovo
    }
     finally {
      setLoading(false);
    }
  };

  // 🔁 Pokušaj automatskog refreshovanja
  const tryRefreshToken = async () => {
    try {
      const refreshRes = await axiosInstance.post("/refresh-token", {}, {
        headers: {
          "X-CSRF-Token": Cookies.get("_csrf")
        },
      });
      console.log("🔁 Refresh token uspešan:", refreshRes.status);

      const res2 = await axiosInstance.get("/me");
      setUser(res2.data.user);
    } catch (err) {
      console.error("❌ Refresh token neuspešan:", err.message);
      localStorage.removeItem("csrfToken");
      setUser(null);
    }
  };

  // 🚪 Login — setuj user
  const login = (userData) => {
    setUser(userData);
  };

  // 🚪 Logout — izbaci korisnika i očisti sve
  const logout = async () => {
    try {
      await axiosInstance.post("/logout", {}, {
        headers: {
          "X-CSRF-Token": Cookies.get("_csrf")
        },
      });
      console.log("✅ Logout uspešan");
    } catch (err) {
      console.error("❌ Logout greška:", err.response?.data || err.message);
    } finally {
      document.cookie = "accessToken=; Max-Age=0; path=/; secure; SameSite=None";
      document.cookie = "refreshToken=; Max-Age=0; path=/; secure; SameSite=None";
      document.cookie = "_csrf=; Max-Age=0; path=/; secure; SameSite=None";

      localStorage.removeItem("csrfToken");
      setUser(null);
      navigate("/login"); // ✅ bez reload
    }
  };

  // 👁️ Provera putanje (public vs protected)
  useEffect(() => {
    const publicPaths = ["/login", "/register", "/forgot-password"];
    const isPublic = publicPaths.includes(location.pathname);

    if (!isPublic) {
      fetchUser();
    } else {
      setLoading(false);
    }
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

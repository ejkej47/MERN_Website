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
      setUser(null);
    }
  };

  const fetchUser = async () => {
    try {
      // ✅ U svakom okruženju pozivamo /csrf-token pre prvog POST-a
      await axiosInstance.get("/csrf-token");
      console.log("🛡️ CSRF token zatražen i cookie postavljen");

      const res = await axiosInstance.get("/me");
      setUser(res.data.user);
      console.log("✅ Autentifikovan:", res.data.user);
    } catch (err) {
      if (err.response?.status === 401) {
        console.log("🔁 /me vraća 401, pokušaj refresh...");
        await tryRefreshToken();
      } else {
        console.error("❌ fetchUser nije uspeo:", err.message);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    console.log("🚪 Login uspešan:", userData);
    setUser(userData);
    setLoading(false);
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/logout");
      console.log("✅ Logout uspešan");
    } catch (err) {
      console.error("❌ Logout greška:", err.response?.data || err.message);
    } finally {
      // ✅ Očisti sve cookie-je
      ["accessToken", "refreshToken", "_csrf"].forEach((name) => {
        document.cookie = `${name}=; Max-Age=0; path=/; secure; SameSite=None`;
      });

      setUser(null);
      setLoading(false);
      navigate("/login");
    }
  };

  useEffect(() => {
    const protectedPaths = ["/my-courses"];
    const isProtected = protectedPaths.includes(location.pathname);

    if (isProtected || !user) {
      fetchUser();
      return;
    }

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

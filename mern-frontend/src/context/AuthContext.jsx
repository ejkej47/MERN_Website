import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Prati da li je proverena sesija

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // ⬇️ Prvo uzmi CSRF token i smesti ga u localStorage
        const csrfRes = await axiosInstance.get("/csrf-token");
        localStorage.setItem("csrfToken", csrfRes.data.csrfToken);
        console.log("🛡️ CSRF token postavljen:", csrfRes.data.csrfToken);

        // ⬇️ Provera da li korisnik postoji
        console.log("🔁 Provera /me...");
        const res = await axiosInstance.get("/me");
        setUser(res.data.user);
        console.log("✅ user:", res.data.user);
      } catch (err) {
        if (err.response?.status === 401) {
          console.warn("🔁 /me nije autorizovan, pokušaj refresh...");
          try {
          await axiosInstance.post("/refresh-token", {});
            const res2 = await axiosInstance.get("/me");
            setUser(res2.data.user);
            console.log("✅ refresh uspešan user:", res2.data.user);
          } catch (refreshErr) {
            console.error("❌ Refresh neuspešan u AuthContext:", refreshErr.message);
            setUser(null);
          }
        } else {
          console.log("❌ /me error:", err.message);
          setUser(null);
        }
      } finally {
        console.log("⏹️ loading: false");
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
  try {
    await axiosInstance.post("/logout", {});
  } catch (err) {
    console.error("❌ Logout greška:", err.message);
  } finally {
    setUser(null); // Resetuj korisnika
  }
};


  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

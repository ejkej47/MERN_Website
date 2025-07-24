import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Prati da li je proverena sesija

  useEffect(() => {
  const fetchUser = async () => {
    try {
      console.log("🔁 Provera /me...");
      const res = await axiosInstance.get("/me");
      setUser(res.data.user);
      console.log("✅ user:", res.data.user);
    } catch (err) {
      if (err.response?.status === 401) {
        console.warn("🔁 /me nije autorizovan, pokušaj refresh...");
        try {
          await axiosInstance.post("/refresh-token");
          const res2 = await axiosInstance.get("/me");
          setUser(res2.data.user);
          console.log("✅ refresh uspešan user:", res2.data.user);
        } catch (refreshErr) {
          console.error("❌ Refresh neuspešan u AuthContext:", refreshErr.message);
          localStorage.setItem("forceLogout", "1");
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

  // ⬇️ OVO DODAJ ODMAH POSLE GORNJEG useEffect-a
  useEffect(() => {
    if (localStorage.getItem("forceLogout") === "1") {
      localStorage.removeItem("forceLogout");
      logout();
    }
  }, []);




  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
  try {
    await axiosInstance.post("/logout", null, {
      withCredentials: true, // ⬅️ Obavezno da bi poslao cookie
    });
  } catch (err) {
    console.error("❌ Logout greška:", err.message);
  }

  localStorage.removeItem("user");
  setUser(null);
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

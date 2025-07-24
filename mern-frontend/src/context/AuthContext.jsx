import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Prati da li je proverena sesija

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/me");
      const user = res.data.user;
      console.log("✅ Pronađen user:", user);
      if (user) setUser(user);
    } catch (err) {
      if (err.response?.status === 401) {
        try {
          console.log("🔁 Pokušaj refresh tokena...");
          await axiosInstance.post("/refresh", null, { withCredentials: true });
          const res2 = await axiosInstance.get("/me");
          console.log("✅ Refreshed user:", res2.data.user);
          setUser(res2.data.user);
        } catch (refreshErr) {
          console.log("❌ Refresh neuspešan");
          setUser(null);
        }
      } else {
        console.log("❌ fetchUser greška:", err.message);
        setUser(null);
      }
    } finally {
      console.log("🏁 Loading završeno");
      setLoading(false);
    }
  };

    fetchUser();
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

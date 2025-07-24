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
        if (user) setUser(user);
      } catch (err) {
        console.log("❌ Nema aktivnog korisnika:", err.message);
        setUser(null);
      } finally {
        setLoading(false); // ✅ Obavezno postavi da je gotovo
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

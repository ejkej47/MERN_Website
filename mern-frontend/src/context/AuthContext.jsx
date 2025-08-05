// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/me");
      setUser(res.data.user);
    } catch (err) {
      console.warn("⛔ Neautorizovan:", err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      await fetchUser(); // backend već postavlja cookie
      navigate("/");
    } catch (err) {
      console.error("❌ Greška pri login-u:", err.message);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/logout");
    } catch (err) {
      console.warn("⚠️ Logout greška:", err.message);
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  // ✅ Pozivamo fetchUser() odmah kad se aplikacija pokrene
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

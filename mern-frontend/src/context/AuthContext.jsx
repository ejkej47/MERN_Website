// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // 📌 Uklonjeno: više ne moramo ručno pozivati /csrf-token
  // jer to sada radi axiosInstance automatski kad zatreba

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/me");
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post("/logout");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout greška:", err);
    }
  };

  useEffect(() => {
    const publicPaths = ["/", "/courses", "/login", "/register", "/forgot-password"];
    const isPublic = publicPaths.includes(location.pathname);

    if (!isPublic) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

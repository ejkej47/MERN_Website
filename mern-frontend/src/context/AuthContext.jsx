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

  // ✅ Pokuša da povuče korisnika pomoću accessToken-a
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/me");
      setUser(res.data.user);
    } catch (err) {
      console.warn("Neautorizovan pristup ili greška:", err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Login metoda — dobija podatke iz /login
  const login = async ({ accessToken, refreshToken }) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    try {
      const res = await axiosInstance.get("/me");
      setUser(res.data.user);
      navigate("/"); // ✅ možeš prebaciti korisnika odmah nakon login-a
    } catch (err) {
      console.error("Greška pri dohvatu korisnika nakon login-a:", err.message);
      setUser(null);
    }
  };


  // ✅ Logout metoda — briše token i korisnika
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await axiosInstance.post("/logout", { refreshToken });
    } catch (err) {
      console.warn("Greška pri logout-u:", err.message);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      navigate("/login");
    }
  };

  // ✅ Na promeni rute, ako nije public, proveri korisnika
  useEffect(() => {
    const publicPaths = [
      "/", "/courses", "/login", "/register", "/forgot-password"
    ];
    const isPublic = publicPaths.some(path => location.pathname.startsWith(path));

    if (!isPublic) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

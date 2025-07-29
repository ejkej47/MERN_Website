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

  const csrfToken = useCsrfToken();

 useEffect(() => {
  const getCsrfToken = async () => {
    try {
      await axiosInstance.get("/csrf-token"); // pokupi _csrf cookie
    } catch (err) {
      console.error("Greška pri dohvat CSRF tokena:", err);
    }
  };

  getCsrfToken();
}, []);


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

    // ⛔ Čekaj da csrfToken stigne
    if (!csrfToken) return;

    if (!isPublic) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [location.pathname, csrfToken]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

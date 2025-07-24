// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Dodato za inicijalni load

  // Provera da li korisnik već ima validan token (npr. posle Google logina)
  useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/me");
      const user = res.data.user;
      if (user) setUser(user);
    } catch (err) {
      console.log("Nema aktivnog korisnika");
    }
  };

  fetchUser();
}, []);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
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

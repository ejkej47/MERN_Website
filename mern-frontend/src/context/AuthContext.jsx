import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // da ne prikaže app dok ne proveri sesiju

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 🎯 Prvo uzmi CSRF token
        const csrfRes = await axiosInstance.get("/csrf-token");
        const csrfToken = csrfRes.data.csrfToken;
        if (csrfToken) {
          localStorage.setItem("csrfToken", csrfToken);
          console.log("🛡️ CSRF token postavljen:", csrfToken);
        }

        // 🎯 Zatim pokušaj da dobavi aktivnog korisnika
        console.log("🔍 Provera /me...");
        const res = await axiosInstance.get("/me");
        setUser(res.data.user);
        console.log("✅ Autentifikovan korisnik:", res.data.user);
      } catch (err) {
        if (err.response?.status === 401) {
          // Pokušaj refresh ako je unauthorized
          console.warn("⚠️ /me nije autorizovan, pokušavam refresh...");
          try {
            const refreshRes = await axiosInstance.post("/refresh-token", {}, {
              headers: {
                "X-CSRF-Token": localStorage.getItem("csrfToken"),
              },
            });
            console.log("🔁 Refresh uspešan:", refreshRes.status);

            // Pokušaj ponovo /me
            const res2 = await axiosInstance.get("/me");
            setUser(res2.data.user);
            console.log("✅ Refresh korisnik:", res2.data.user);
          } catch (refreshErr) {
            console.error("❌ Refresh neuspešan:", refreshErr.message);
            localStorage.removeItem("csrfToken");
            setUser(null);
          }
        } else {
          console.error("❌ Greška pri /me:", err.message);
          setUser(null);
        }
      } finally {
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
      await axiosInstance.post("/logout", {}, {
        headers: {
          "X-CSRF-Token": localStorage.getItem("csrfToken"),
        },
      });
    } catch (err) {
      console.error("❌ Logout greška:", err.message);
    } finally {
      localStorage.removeItem("csrfToken");
      setUser(null);
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

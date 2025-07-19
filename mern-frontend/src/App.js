import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import axiosInstance from "./axiosInstance";

// === Zaštićena ruta ===
function ProtectedRoute({ loggedIn, children }) {
  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// === Dashboard sa automatskim redirectom ako token ne postoji ===
function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      navigate("/login");
    } else {
      if (userData) {
        setUser(JSON.parse(userData));
      }

      // Pozivanje zaštićene rute
      const handleProtectedRequest = async () => {
        try {
          const res = await axiosInstance.get("/protected");
          const data = res.data;
          console.log("Zaštićeni podaci:", data);
        } catch (err) {
          console.error("Greška pri pristupu zaštićenoj ruti:", err);
        }
      };

      handleProtectedRequest();
    }
  }, [navigate]);

  return (
    <div>
      <h2>Uspešno ste prijavljeni!</h2>
      {user && (
        <>
          {user.image && <img src={user.image} alt="Profilna" width={100} style={{ borderRadius: "50%" }} />}
          <p><strong>Email:</strong> {user.email}</p>
        </>
      )}
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}

// === LoginSuccess za Google login ===
function LoginSuccess({ onLogin }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const email = params.get("email");
    const image = params.get("image");

    if (token && email) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ email, image }));
      if (onLogin) onLogin();
      navigate("/dashboard");
    }
  }, [location, onLogin, navigate]);

  return <p>Prijavljujemo vas preko Google-a...</p>;
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setLoggedIn(false);
    }
  };

  return (
    <Routes>
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm onLogin={() => setLoggedIn(true)} />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute loggedIn={loggedIn}>
            <Dashboard onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route path="/login-success" element={<LoginSuccess onLogin={() => setLoggedIn(true)} />} />
      <Route path="*" element={<Navigate to={loggedIn ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default App;

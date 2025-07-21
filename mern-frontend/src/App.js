import React from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import { useAuth } from "./context/AuthContext";
import axiosInstance from "./axiosInstance";
import CourseList from "./components/CourseList";
import MyCourses from "./components/MyCourses";
import ForgotPassword from "./components/ForgotPassword";


// === Zaštićena ruta ===
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// === Dashboard ===
function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      axiosInstance.get("/protected")
        .then(res => {
          console.log("Zaštićeni podaci:", res.data);
        })
        .catch(err => {
          console.error("Greška pri pristupu zaštićenoj ruti:", err);
        });
    }
  }, [user, navigate]);

  return (
    <div>
      <h2>Uspešno ste prijavljeni!</h2>
      {user && (
        <>
          {user.image && <img src={user.image} alt="Profilna" width={100} style={{ borderRadius: "50%" }} />}
          <p><strong>Email:</strong> {user.email}</p>
        </>
      )}
      <button onClick={logout}>Logout</button>
    </div>
  );
}

// === LoginSuccess (Google login) ===
function LoginSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const email = params.get("email");
    const image = params.get("image");

    if (token && email) {
      login({ email, image }, token);
      navigate("/dashboard");
    }
  }, [location, login, navigate]);

  return <p>Prijavljujemo vas preko Google-a...</p>;
}

function App() {
  const { user, login } = useAuth();

  return (
    <Routes>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/courses" element={<CourseList />} />
      <Route path="/my-courses" element={<MyCourses />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm onLogin={login} />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/login-success" element={<LoginSuccess />} />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default App;

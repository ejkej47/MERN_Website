// App.js (ažuriran default prikaz kurseva)
import React from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";

import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import { useAuth } from "./context/AuthContext";
import axiosInstance from "./axiosInstance";
import CourseDetail from "./components/Course/CourseDetail";
import CourseList from "./components/Course/CourseList";
import MyCourses from "./components/Course/MyCourses";

import ForgotPassword from "./components/ForgotPassword";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  React.useEffect(() => {
    if (!user) navigate("/login");
    else {
      axiosInstance.get("/protected")
        .then(res => console.log("Zaštićeni podaci:", res.data))
        .catch(err => console.error("Greška pri pristupu zaštićenoj ruti:", err));
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
      navigate("/courses");
    }
  }, [location, login, navigate]);

  return <p>Prijavljujemo vas preko Google-a...</p>;
}

function App() {
  const { user, login } = useAuth();

  return (
    <Routes>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm onLogin={login} />} />
      <Route path="/login-success" element={<LoginSuccess />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      {/* kursevi */}
      <Route path="/courses" element={<CourseList />} />
      <Route path="/course/:slug" element={<CourseDetail />} />

      {/* default redirect na kurseve umesto dashboard/login */}
      <Route path="*" element={<Navigate to="/courses" />} />
    </Routes>
  );
}

export default App;

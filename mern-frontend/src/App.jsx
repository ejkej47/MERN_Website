import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import axiosInstance from "./axiosInstance"; // ✅ koristi instancu, ne direktno axios
import Layout from "./components/Layout";
import LandingPage from "./components/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./components/ForgotPassword";
import CourseList from "./components/Course/CourseList";
import CourseDetail from "./components/Course/CourseDetail";
import MyCourses from "./components/Course/MyCourses";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginSuccess from "./components/LoginSuccess";

function App() {
  // ✅ Dohvatanje CSRF tokena pri mountu
  useEffect(() => {
    axiosInstance.get("/csrf-token")
      .then(res => {
        localStorage.setItem("csrfToken", res.data.csrfToken);
      })
      .catch(err => {
        console.error("❌ Greska pri dohvatanju CSRF tokena:", err);
      });
  }, []);

  return (
    <Routes>
      {/* Google login success (van Layouta jer ne treba navbar u redirect fazi) */}
      <Route path="/login-success" element={<LoginSuccess />} />

      {/* Sve ostalo u Layoutu */}
      <Route path="/" element={<Layout />}>
        {/* Početna stranica */}
        <Route index element={<LandingPage />} />

        {/* Javni pristup */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="courses" element={<CourseList />} />
        <Route path="course/:slug" element={<CourseDetail />} />

        {/*Zaštićene rute */}
        <Route
          path="my-courses"
          element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          }
        />

        {/* 🔁 Fallback za nepostojeće rute */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;

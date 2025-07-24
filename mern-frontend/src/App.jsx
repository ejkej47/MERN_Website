import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "./axiosInstance";
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
import { useAuth } from "./context/AuthContext";

function App() {
  const { user, loading } = useAuth(); // ⬅️ koristi loading i user
  const [csrfLoaded, setCsrfLoaded] = useState(false); // dodatno

  // Dohvatanje CSRF tokena pri mountu
  useEffect(() => {
    axiosInstance
      .get("/csrf-token")
      .then((res) => {
        localStorage.setItem("csrfToken", res.data.csrfToken);
        setCsrfLoaded(true);
      })
      .catch((err) => {
        console.error("❌ Greska pri dohvatanju CSRF tokena:", err);
        setCsrfLoaded(true); // čak i u slučaju greške, nastavi
      });
  }, []);

  // ⏳ Ne renderuj dok traje auth provera ili nije stigao CSRF
  if (loading || !csrfLoaded) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/login-success" element={<LoginSuccess />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="courses" element={<CourseList />} />
        <Route path="course/:slug" element={<CourseDetail />} />
        <Route
          path="my-courses"
          element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;

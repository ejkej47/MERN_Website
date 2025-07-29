import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

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

import useCsrfToken from "./hooks/useCsrfToken";
import { setCsrfToken } from "./axiosInstance";

function App() {
  const { loading, user } = useAuth();

  // 🔐 Učitaj CSRF token i ubaci ga u axios interceptor
  const csrfToken = useCsrfToken();

  useEffect(() => {
    if (csrfToken) {
      setCsrfToken(csrfToken);
    }
  }, [csrfToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-lg">
        Učitavanje...
      </div>
    );
  }

  return (
    <Routes key={user ? "auth" : "guest"}>
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

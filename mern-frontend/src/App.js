import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import { useAuth } from "./context/AuthContext";
import axiosInstance from "./axiosInstance";
import CourseDetail from "./components/Course/CourseDetail";
import CourseList from "./components/Course/CourseList";
import MyCourses from "./components/Course/MyCourses";
import LandingPage from "./components/LandingPage";
import ForgotPassword from "./components/ForgotPassword";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Index ruta */}
        <Route index element={<LandingPage />} />

        {/* Javni endpointi */}
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<RegisterForm />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="courses" element={<CourseList />} />
        <Route path="course/:slug" element={<CourseDetail />} />

        {/* Zaštićene rute */}
        <Route
          path="my-courses"
          element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          }
        />

        {/* Fallback za nepostojeće */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;

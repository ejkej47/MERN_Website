import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
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
  const { loading, user } = useAuth();

  useEffect(() => {
    axiosInstance.get("/csrf-token")
      .then(res => {
        localStorage.setItem("csrfToken", res.data.csrfToken);
      })
      .catch(err => {
        console.error("❌ Greska pri dohvatanju CSRF tokena:", err);
      });
  }, []);

  console.log("🔁 App render:", { loading, user });


  if (loading) return <div>Loading...</div>;

  return (
      <Routes key={loading ? "loading" : user ? "auth" : "guest"}>
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

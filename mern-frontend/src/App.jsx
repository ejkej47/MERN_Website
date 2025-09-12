import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CoursePage from "./pages/CoursePage";
import AllCoursesPage from "./pages/AllCoursesPage";
import ModulePage from "./pages/ModulePage"; 
import LessonPage from "./pages/LessonPage";
import ProfilePage from "./pages/ProfilePage";
import OnamaPage from "./pages/ONamaPage";
import MyCourses from "./components/Course/MyCourses";
import ForgotPassword from "./components/Forms/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginSuccess from "./components/Success/LoginSuccess";
import LoadingSpinner from "./components/QoL/LoadingSpinner";
import ScrollToTop from "./components/QoL/ScrollToTop";
import GoogleSuccess from "./components/Success/GoogleSuccess";
import PrivacyPolicy from "./pages/PrivacyPolicy";


import { useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

function App() {
  const { loading, user } = useAuth();
  if (loading) return <LoadingSpinner className="h-screen" />;


  return (
  <>
    <ScrollToTop />
    <Routes key={user ? "auth" : "guest"}>
          <Route path="/google-success" element={<GoogleSuccess />} />
          <Route path="/login-success" element={<LoginSuccess />} />
          <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="about" element={<OnamaPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="courses" element={<AllCoursesPage />} />
          <Route path="course/:slug" element={<CoursePage />} />
          <Route path="/modules/:slug" element={<ModulePage />} />
          <Route path="/modules/:slug/lessons/:lessonId" element={<LessonPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>}/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster position="bottom-right" />
    </>
  );

}

export default App;

// src/components/ProtectedRoute.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner className="h-screen" />;


  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

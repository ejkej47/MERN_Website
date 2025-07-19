import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Nema tokena — preusmeri na login
    return <Navigate to="/login" replace />;
  }

  // Token postoji — prikaži zaštićenu komponentu
  return children;
}

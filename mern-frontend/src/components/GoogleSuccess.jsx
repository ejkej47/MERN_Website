// src/pages/GoogleSuccess.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      login({ accessToken, refreshToken })
        .then(() => navigate("/my-courses"))
        .catch((err) => {
          console.error("Greška pri loginu:", err);
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, []);

  return <div className="text-center p-4">Prijavljivanje putem Google-a...</div>;
}

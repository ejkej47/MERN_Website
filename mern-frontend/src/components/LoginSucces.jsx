// src/components/LoginSuccess.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function LoginSuccess({ onLogin }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const email = params.get("email");
    const image = params.get("image");

    if (token && email) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ email, image }));
      if (onLogin) onLogin();
      navigate("/dashboard");
    }
  }, [location, onLogin, navigate]);

  return <p>Prijavljujemo vas preko Google-a...</p>;
}

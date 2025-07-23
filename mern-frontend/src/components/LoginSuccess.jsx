import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginSuccess() {
    console.log("LoginSuccess component loaded");

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;

    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const email = params.get("email");
    const image = params.get("image");
    const googleId = params.get("googleId");

     console.log("Token:", token);
console.log("Email:", email);
console.log("Image:", image);
console.log("Google ID:", googleId);

    if (token && email) {
      login({ email, image, googleId }, token);
      hasRun.current = true;
      navigate("/"); // ili "/dashboard"
    }
  }, [location.search, login, navigate]);

  return <p>Prijavljujemo vas preko Google-a...</p>;
}

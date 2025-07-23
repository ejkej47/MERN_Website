import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const hasRun = useRef(false); // Ref se ne resetuje na re-render

  useEffect(() => {
  if (hasRun.current) return;

  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const email = params.get("email");
  const image = params.get("image");
  const googleId = params.get("googleId");

  if (token && email) {
    login({ email, image, googleId }, token); // SAD SADRŽI ISTO KAO OBICAN LOGIN
    hasRun.current = true;
    navigate("/dashboard");
  }
}, [location.search, login, navigate]);


  return <p>Prijavljujemo vas preko Google-a...</p>;
}

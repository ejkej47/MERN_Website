import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../axiosInstance";

export default function LoginSuccess() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/my-courses";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/me");
        const user = res.data.user;

        if (user) {
          login(user);
          navigate(from, { replace: true });
        }
      } catch (err) {
        console.error("Greška pri dohvaćanju korisnika:", err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [login, navigate, from]);

  return <p>Prijavljujemo vas preko Google-a...</p>;
}

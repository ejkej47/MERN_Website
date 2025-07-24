import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosInstance";

export default function LoginSuccess() {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/me");
        const user = res.data.user;

        if (user) {
          login(user); // ne treba token
          navigate("/"); // redirect
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Greška pri dohvaćanju korisnika:", err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [login, navigate]);

  return <p>Prijavljujemo vas preko Google-a...</p>;
}

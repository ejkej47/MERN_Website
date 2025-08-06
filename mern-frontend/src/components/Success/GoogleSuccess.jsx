import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { useAuth } from "../../context/AuthContext";

export default function GoogleSuccess() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    axiosInstance.get("/me")
      .then((res) => {
        setUser(res.data.user);  // npr. { id, email }
        navigate("/my-courses");
      })
      .catch((err) => {
        console.error("Greška pri učitavanju korisnika:", err);
        console.error("📦 Full response:", err.response);
        navigate("/login");
      });
  }, []);

  return <div className="text-center p-4">Prijavljivanje putem Google-a...</div>;
}

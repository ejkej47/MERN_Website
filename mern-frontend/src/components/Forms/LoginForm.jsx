import React, { useState } from "react";
import axiosInstance from "../../axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";

const googleAuthUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/auth/google"
    : "https://mern-backend-cd6i.onrender.com/auth/google";

export default function LoginForm({ redirectPath = "/my-courses" }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/login", { email, password });
      await login();

      toast.success("Uspešno ste prijavljeni!");
      const from = location.state?.from || redirectPath;
      navigate(from, { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Nepoznata greška pri loginu.";
      console.error("Greška pri loginu:", message);
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 rounded-2xl bg-surface">
      <div>
        <label className="mb-1 block text-sm font-medium text-text/90">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-borderSoft bg-background px-4 py-2 text-text placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/40"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-text/90">Lozinka</label>
        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-lg border border-borderSoft bg-background px-4 py-2 text-text placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/40"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded bg-accent py-2 font-semibold text-black transition hover:bg-accent-hover"
      >
        Uloguj se
      </button>

      <div className="mt-4 text-center">
        <p className="mb-2 text-sm text-muted">ili se prijavi putem naloga</p>

        {/* Google Login */}
        <a
          href={googleAuthUrl}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-borderSoft bg-surface px-4 py-2 shadow-sm transition hover:bg-background"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="h-5 w-5"
          />
          <span className="text-sm font-medium text-text">Prijava preko Google-a</span>
        </a>
      </div>

      <div className="mt-4 text-center text-xs text-muted">
        Nastavkom prihvataš našu{" "}
        <Link to="/privacy-policy" className="text-accent hover:underline">
          Politiku privatnosti
        </Link>.
      </div>
    </form>
  );
}

import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
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
      await axiosInstance.post("/login", { email, password }); // ✅ backend postavlja cookie

      await login(); // ✅ poziva /me i setuje user-a

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
    <form onSubmit={handleLogin} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-dark mb-1">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-dark mb-1">Lozinka</label>
        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-accent text-dark py-2 rounded hover:bg-accent-hover transition"
      >
        Uloguj se
      </button>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 mb-2">ili se prijavi putem Google naloga</p>
        <a
          href={googleAuthUrl}
          className="inline-block bg-white border border-gray-300 rounded px-4 py-2 shadow-sm hover:bg-gray-50 transition"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            className="inline-block w-5 h-5 mr-2 align-middle"
          />
          <span className="align-middle text-sm text-gray-700">Login with Google</span>
        </a>
      </div>
    </form>
  );
}

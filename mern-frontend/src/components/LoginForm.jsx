import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const googleAuthUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth/google"
    : "https://mern-backend-cd6i.onrender.com/api/auth/google";

export default function LoginForm({ redirectPath = "/my-courses" }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/login", { email, password });

      const user = res.data.user;
      const newCsrf = res.data.csrfToken;

      if (!user) {
        throw new Error("Login uspeo, ali korisnik nije vraćen.");
      }

      login(user); // postavi korisnika u AuthContext

      if (newCsrf) {
        localStorage.setItem("csrfToken", newCsrf);
      }

      setIsSuccess(true);
      setMessage("Uspešno ste prijavljeni.");
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error("Greška pri loginu:", err);
      setIsSuccess(false);
      setMessage(err.response?.data?.message || "Greška pri logovanju.");
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

      {message && (
        <p className={`text-sm ${isSuccess ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      )}
    </form>
  );
}

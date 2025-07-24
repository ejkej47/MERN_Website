import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const csrfToken = localStorage.getItem("csrfToken");

    const res = await axiosInstance.post(
      "/login",
      { email, password },
      {
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      }
    );

    const user = res.data.user;
    const newCsrf = res.data.csrfToken;

    if (user) {
      login(user); // Postavi user u AuthContext
      if (newCsrf) {
        localStorage.setItem("csrfToken", newCsrf); // Osveži CSRF token
      }
      setMessage("Uspešno ste prijavljeni.");
      setIsSuccess(true);
    } else {
      setMessage("Login uspeo, ali nije vraćen korisnik.");
      setIsSuccess(false);
    }
  } catch (err) {
    setMessage("Greška pri logovanju: " + (err.response?.data?.message || err.message));
    setIsSuccess(false);
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
          onChange={e => setEmail(e.target.value)}
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
          onChange={e => setPassword(e.target.value)}
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

      {/* Google login */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 mb-2">ili se prijavi putem Google naloga</p>
        <a
          href="https://mern-backend-cd6i.onrender.com/api/auth/google"
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

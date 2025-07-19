import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginWithGoogle from "../components/LoginWithGoogle"; // 👈 OVO

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/login", { email, password });
      login(res.data.user, res.data.token);
      navigate("/courses");
    } catch (err) {
      alert("Greška pri logovanju: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Lozinka"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Uloguj se</button>

      {/* 👇 Google dugme ispod forme */}
      <div style={{ marginTop: "1rem" }}>
        <LoginWithGoogle />
      </div>
    </form>
  );
}

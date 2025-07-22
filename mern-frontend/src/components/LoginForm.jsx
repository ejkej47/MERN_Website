import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/login", { email, password });
      login(res.data.user, res.data.token);
      setMessage("Uspešno ste prijavljeni.");
    } catch (err) {
      setMessage("Greška pri logovanju: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Lozinka"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Uloguj se</button>
      {message && <p>{message}</p>}
    </form>
  );
}

import React, { useState } from "react";
import LoginWithGoogle from "./LoginWithGoogle";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage(data.message);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); // ⬅️ OVO JE KLJUČNO
      if (onLogin) onLogin();
    } else {
      setMessage(data.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Prijava</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Prijavi se</button>
        <p>{message}</p>
      </form>

      <hr />

      <LoginWithGoogle />
    </>
  );
}

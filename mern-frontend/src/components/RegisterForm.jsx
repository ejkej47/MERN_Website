import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Dohvati CSRF token
      const csrfRes = await fetch("http://localhost:5000/api/csrf-token", {
        credentials: "include",
      });
      const csrfData = await csrfRes.json();
      const csrfToken = csrfData.csrfToken;

      // 2. Pošalji zahtev za registraciju
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // 3. Nakon registracije automatski pozovi login
        const loginRes = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        const loginData = await loginRes.json();

        if (loginRes.ok) {
          login(loginData.user, loginData.token);
          navigate("/dashboard");
        } else {
          setMessage("Registracija uspešna, ali prijava nije uspela.");
        }
      } else {
        setMessage(data.message || "Greška prilikom registracije.");
      }
    } catch (err) {
      console.error("Greška:", err);
      setMessage("Greška u mreži ili CSRF token nije validan.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registracija</h2>
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
      <button type="submit">Registruj se</button>
      <p>{message}</p>
    </form>
  );
}

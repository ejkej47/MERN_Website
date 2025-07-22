import React, { useState } from "react";
import axiosInstance from "../axiosInstance";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post("/register", { email, password });
      setSuccess(response.data.message); // Prikaz uspešne poruke
      setEmail("");
      setPassword("");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Prikaz poruke sa backend-a
      } else {
        setError("Greška na serveru.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registracija</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
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
      <button type="submit">Registruj se</button>
    </form>
  );
}

export default RegisterForm;

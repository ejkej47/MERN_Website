import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import toast from "react-hot-toast";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/register", { email, password });
      toast.success(response.data.message || "Registracija uspešna.");
      setEmail("");
      setPassword("");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Greška prilikom registracije.";
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        className="w-full bg-primary text-white py-2 rounded hover:bg-primary-hover transition"
      >
        Registruj se
      </button>
    </form>
  );
}

export default RegisterForm;

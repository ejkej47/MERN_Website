import React, { useState } from "react";
import axiosInstance from "../../axiosInstance";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendCode = async () => {
    try {
      await axiosInstance.post("/send-reset-code", { email });
      toast.success("Kod je poslat na email.");
      setStep(2);
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Greška pri slanju koda.";
      toast.error(message);
    }
  };

  const handleVerifyCode = async () => {
    try {
      await axiosInstance.post("/verify-reset-code", { email, code });
      toast.success("Kod potvrđen. Unesi novu lozinku.");
      setStep(3);
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Kod nije validan ili je istekao.";
      toast.error(message);
    }
  };

  const handleResetPassword = async () => {
    try {
      await axiosInstance.post("/reset-password", { email, code, newPassword });
      toast.success("Lozinka je uspešno promenjena.");
      setStep(4);
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Greška prilikom promene lozinke.";
      toast.error(message);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm space-y-4">
      <h2 className="text-xl font-semibold">Zaboravljena Lozinka</h2>

      {step === 1 && (
        <>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            placeholder="Unesi email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSendCode}
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-hover transition"
          >
            Pošalji kod
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <label className="block text-sm mb-1">Kod iz emaila</label>
          <input
            type="text"
            placeholder="Unesi kod"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleVerifyCode}
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-hover transition"
          >
            Potvrdi kod
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <label className="block text-sm mb-1">Nova lozinka</label>
          <input
            type="password"
            placeholder="Unesi novu lozinku"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleResetPassword}
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-hover transition"
          >
            Promeni lozinku
          </button>
        </>
      )}

      {step === 4 && (
        <p className="text-green-700 font-semibold text-center">
          Lozinka promenjena. Možeš se sada prijaviti novom lozinkom.
        </p>
      )}
    </div>
  );

}

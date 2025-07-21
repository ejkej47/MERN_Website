import React, { useState } from "react";
import axiosInstance from "../axiosInstance";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSendCode = async () => {
    try {
      await axiosInstance.post("/send-reset-code", { email });
      setStep(2);
      setMessage("Kod je poslat na email.");
    } catch (err) {
      setMessage("Greška: " + (err.response?.data?.message || err.message));
    }
  };

  const handleVerifyCode = async () => {
    try {
      await axiosInstance.post("/verify-reset-code", { email, code });
      setStep(3);
      setMessage("Kod potvrđen. Unesi novu lozinku.");
    } catch (err) {
      setMessage("Kod nije validan ili je istekao.");
    }
  };

  const handleResetPassword = async () => {
    try {
      await axiosInstance.post("/reset-password", { email, code, newPassword });
      setMessage("Lozinka je uspešno promenjena.");
      setStep(4);
    } catch (err) {
      setMessage("Greška prilikom promene lozinke.");
    }
  };

  return (
    <div>
      <h2>Zaboravljena lozinka</h2>
      {step === 1 && (
        <>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Unesi email" />
          <button onClick={handleSendCode}>Pošalji kod</button>
        </>
      )}

      {step === 2 && (
        <>
          <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="Kod iz emaila" />
          <button onClick={handleVerifyCode}>Potvrdi kod</button>
        </>
      )}

      {step === 3 && (
        <>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Nova lozinka" />
          <button onClick={handleResetPassword}>Promeni lozinku</button>
        </>
      )}

      {step === 4 && <p>Možeš se sada prijaviti novom lozinkom.</p>}

      <p>{message}</p>
    </div>
  );
}

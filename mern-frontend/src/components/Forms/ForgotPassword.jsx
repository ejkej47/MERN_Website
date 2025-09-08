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
    <div className="space-y-4 rounded-2xl border border-borderSoft bg-surface p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-text">Zaboravljena Lozinka</h2>

      {step === 1 && (
        <>
          <label className="block text-sm text-text/80">Email</label>
          <input
            type="email"
            placeholder="Unesi email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-lg border border-borderSoft bg-background px-4 py-2 text-text placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/40"
          />
          <button
            onClick={handleSendCode}
            className="w-full rounded-xl bg-primary py-2 font-semibold text-white transition hover:bg-primary-hover"
          >
            Pošalji kod
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <label className="block text-sm text-text/80">Kod iz emaila</label>
          <input
            type="text"
            placeholder="Unesi kod"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mb-4 w-full rounded-lg border border-borderSoft bg-background px-4 py-2 text-text placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/40"
          />
          <button
            onClick={handleVerifyCode}
            className="w-full rounded-xl bg-primary py-2 font-semibold text-white transition hover:bg-primary-hover"
          >
            Potvrdi kod
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <label className="block text-sm text-text/80">Nova lozinka</label>
          <input
            type="password"
            placeholder="Unesi novu lozinku"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mb-4 w-full rounded-lg border border-borderSoft bg-background px-4 py-2 text-text placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/40"
          />
          <button
            onClick={handleResetPassword}
            className="w-full rounded-xl bg-primary py-2 font-semibold text-white transition hover:bg-primary-hover"
          >
            Promeni lozinku
          </button>
        </>
      )}

      {step === 4 && (
        <p className="text-center font-semibold text-accent">
          Lozinka promenjena. Možeš se sada prijaviti novom lozinkom.
        </p>
      )}
    </div>
  );
}

import { useState } from "react";
import axiosInstance from "../../axiosInstance";
import toast from "react-hot-toast";

export default function ChangePasswordForm() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.put("/change-password", {
        oldPassword,
        newPassword,
      });
      toast.success("Lozinka uspešno promenjena.");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error("Greška pri promeni lozinke.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-borderSoft bg-surface p-5 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-text">Promeni Lozinku</h2>

      <input
        type="password"
        className="w-full rounded-lg border border-borderSoft bg-background px-3 py-2 text-text placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/40"
        placeholder="Trenutna lozinka"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        required
      />

      <input
        type="password"
        className="w-full rounded-lg border border-borderSoft bg-background px-3 py-2 text-text placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/40"
        placeholder="Nova lozinka"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
      >
        {loading ? "Slanje..." : "Sačuvaj promene"}
      </button>
    </form>
  );
}

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
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm space-y-4">
      <h2 className="text-xl font-semibold">Promeni Lozinku</h2>
      <input
        type="password"
        className="w-full border px-3 py-2 rounded"
        placeholder="Trenutna lozinka"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        required
      />
      <input
        type="password"
        className="w-full border px-3 py-2 rounded"
        placeholder="Nova lozinka"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded"
      >
        {loading ? "Slanje..." : "Sačuvaj promene"}
      </button>
    </form>
  );
}

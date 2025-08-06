import { useState } from "react";
import axiosInstance from "../../axiosInstance";
import toast from "react-hot-toast";

export default function ChangeEmailForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.put("/change-email", { email });
      toast.success("Email je uspešno promenjen.");
      setEmail("");
    } catch (err) {
      toast.error("Greška pri promeni emaila.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm space-y-4">
      <h2 className="text-xl font-semibold">Promeni Email</h2>
      <input
        type="email"
        className="w-full border px-3 py-2 rounded"
        placeholder="Novi email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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

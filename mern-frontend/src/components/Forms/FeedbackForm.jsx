// src/components/FeedbackForm.jsx
import { useState } from "react";
import axiosInstance from "../../axiosInstance";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function FeedbackForm({ onSuccess }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { user } = useAuth();

    const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      toast.error("Molimo vas da izaberete ocenu (1–5).");
      return;
    }

    try {
      setSubmitting(true);
      await axiosInstance.post("/site-feedback", { rating, comment });
      toast.success("Hvala na oceni!");
      setRating(0);
      setComment("");
      onSuccess?.(); // osvežavanje liste komentara
    } catch (err) {
      toast.error("Greška pri slanju feedbacka.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-1">Vaša ocena:</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-yellow-500 ${star <= rating ? "" : "opacity-30"}`}
            >
              <Star size={24} fill="currentColor" stroke="none" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-medium mb-1">Komentar (opciono):</label>
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Vaš komentar o sajtu..."
        />
      </div>

      {user ? (
        <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/90"
        >
            Pošalji
        </button>
        ) : (
        <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-gray-600">Morate biti prijavljeni da biste poslali ocenu.</p>
            <a
            href="/login"
            className="inline-block bg-primary text-white px-6 py-2 rounded hover:bg-primary/90 transition"
            >
            Prijavite se
            </a>
        </div>
        )}

    </form>
  );
}

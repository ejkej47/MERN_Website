// src/components/FeedbackList.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { Star } from "lucide-react";

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/site-feedback")
      .then((res) => setFeedbacks(res.data))
      .catch((err) => console.error("Greška pri učitavanju feedbacka:", err));
  }, []);

  if (!feedbacks.length) return null;

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10">
      {feedbacks.map((fb) => (
        <div
          key={fb.id}
          className="relative rounded-2xl p-[2px] bg-gradient-to-br from-primary/40 via-accent/40 to-primary/40 
                     shadow-[0_0_12px_rgba(148,53,176,0.15),0_0_16px_rgba(130,231,134,0.12)] 
                     hover:shadow-[0_0_16px_rgba(148,53,176,0.25),0_0_22px_rgba(130,231,134,0.2)] 
                     transition"
        >
          <div className="bg-surface rounded-2xl p-5 h-full flex flex-col">
            {/* Ocena */}
            <div className="flex items-center gap-2 mb-2 text-accent">
              {Array.from({ length: fb.rating }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" stroke="none" />
              ))}
            </div>

            {/* Komentar */}
            <p className="text-sm text-slate-300 italic flex-1">
              {fb.comment || "(Nema komentara)"}
            </p>

            {/* Autor */}
            <div className="flex items-center gap-2 mt-3">
              {fb.image_url ? (
                <img
                  src={fb.image_url}
                  alt="Profilna slika"
                  className="w-6 h-6 rounded-full object-cover ring-2 ring-white/10"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-white/10 grid place-items-center ring-2 ring-white/10">
                  <span className="text-[10px] text-slate-300">👤</span>
                </div>
              )}
              <span className="text-xs text-slate-400 truncate">{fb.email}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

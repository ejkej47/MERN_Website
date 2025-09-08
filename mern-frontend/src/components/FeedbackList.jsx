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
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {feedbacks.map((fb) => (
        <div
          key={fb.id}
          className="relative rounded-2xl p-[2px] bg-gradient-to-br from-primary/40 via-accent/40 to-primary/40 
                     shadow-[0_0_12px_rgba(148,53,176,0.15),0_0_16px_rgba(130,231,134,0.12)] 
                     hover:shadow-[0_0_16px_rgba(148,53,176,0.25),0_0_22px_rgba(130,231,134,0.2)] 
                     transition"
        >
          <div className="flex h-full flex-col rounded-2xl bg-surface p-5">
            {/* Ocena */}
            <div className="mb-2 flex items-center gap-2 text-accent">
              {Array.from({ length: fb.rating }).map((_, i) => (
                <Star key={i} size={16} fill="currentColor" stroke="none" />
              ))}
            </div>

            {/* Komentar */}
            <p className="flex-1 text-sm italic text-text">
              {fb.comment || "(Nema komentara)"}
            </p>

            {/* Autor */}
            <div className="mt-3 flex items-center gap-2">
              {fb.image_url ? (
                <img
                  src={fb.image_url}
                  alt="Profilna slika"
                  className="h-6 w-6 rounded-full object-cover ring-2 ring-borderSoft"
                />
              ) : (
                <div className="grid h-6 w-6 place-items-center rounded-full bg-surface ring-2 ring-borderSoft">
                  <span className="text-[10px] text-muted">👤</span>
                </div>
              )}
              <span className="truncate text-xs text-muted">{fb.email}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

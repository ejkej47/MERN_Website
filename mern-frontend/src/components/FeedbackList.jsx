// src/components/FeedbackList.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { Star } from "lucide-react";

export default function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    axiosInstance.get("/site-feedback")
      .then(res => setFeedbacks(res.data))
      .catch(err => console.error("Greška pri učitavanju feedbacka:", err));
  }, []);

  if (!feedbacks.length) return null;

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10">
      {feedbacks.map((fb) => (
        <div
          key={fb.id}
          className="bg-white rounded p-4 border shadow-sm"
        >
          <div className="flex items-center gap-2 mb-1 text-yellow-500">
            {Array.from({ length: fb.rating }).map((_, i) => (
              <Star key={i} size={16} fill="currentColor" stroke="none" />
            ))}
          </div>
          <p className="text-sm text-gray-800 italic">
            {fb.comment || "(Nema komentara)"}
          </p>
          <div className="flex items-center gap-2 mt-2">
            {fb.image_url && (
              <img
                src={fb.image_url}
                alt="Profilna slika"
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            <span className="text-xs text-gray-600">{fb.email}</span>
          </div>
        </div>
      ))}
</div>
  );
}

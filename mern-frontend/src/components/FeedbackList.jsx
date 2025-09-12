import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function FeedbackList({ showOnlyStats = false }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/site-feedback")
      .then((res) => {
        setFeedbacks(res.data.feedbacks || []);
        setStats(res.data.stats || null);
      })
      .catch((err) => console.error("Greška pri učitavanju feedbacka:", err));
  }, []);

  // Ako treba samo prosečna ocena
  if (showOnlyStats && stats) {
    return (
      <div className="mt-4 flex items-center justify-center gap-2 text-accent">
        <Star size={20} fill="currentColor" stroke="none" />
        <span className="text-lg font-semibold">{stats.average}/5</span>
        <span className="text-text/70 text-sm">({stats.total} ocena)</span>
      </div>
    );
  }

  if (!feedbacks.length) return null;

  return (
    <div className="relative mt-10">
      {/* Fade ivice */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-surface to-transparent"></div>
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-surface to-transparent"></div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop
        breakpoints={{
          1024: { slidesPerView: 3 },
          640: { slidesPerView: 2 },
          0: { slidesPerView: 1 },
        }}
        className="pb-12"
      >
        {feedbacks.map((fb) => (
          <SwiperSlide key={fb.id}>
            <div className="rounded-xl border border-borderSoft bg-surface p-6 shadow-sm transition hover:shadow-md">
              {/* Ocena */}
              <div className="mb-2 flex items-center gap-1 text-accent">
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
                    className="h-7 w-7 rounded-full object-cover ring-2 ring-borderSoft"
                  />
                ) : (
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-surface ring-2 ring-borderSoft">
                    <span className="text-[10px] text-muted">👤</span>
                  </div>
                )}
                <span className="truncate text-xs text-muted">{fb.email}</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        /* Strelice */
        .swiper-button-prev,
        .swiper-button-next {
          color: var(--accent);
          transition: color 0.2s ease, transform 0.2s ease;
        }
        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          color: var(--accent);
          transform: scale(1.1);
        }

        /* Pagination tačkice */
        .swiper-pagination-bullet {
          background: var(--accent);
          opacity: 0.4;
        }
        .swiper-pagination-bullet-active {
          background: var(--accent);
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

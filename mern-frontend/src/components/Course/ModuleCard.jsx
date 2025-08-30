import { useState } from "react";
import { Link } from "react-router-dom";

export default function ModuleCard({
  module,
  courseId,
  onPickLesson,
  onPurchaseModule,
  moduleBasePath = "/modules",
  maxPreviewLessons = 4,
}) {
  const purchased = !!module.isPurchased;
  const price = typeof module.price === "number" ? module.price : null;
  const preview = (module.lessons || []).slice(0, maxPreviewLessons);
  const [open, setOpen] = useState(false);

  return (
    <article
      className="rounded-2xl border border-accent/60 
                 bg-surface 
                 hover:border-accent 
                 hover:shadow-[0_0_15px_rgba(130,231,134,0.25)] 
                 overflow-hidden flex flex-col transition"
    >
      {/* Media */}
      <div className="relative">
        <div className="aspect-[16/9] w-full bg-black/30">
          {module.imageUrl ? (
            <img
              src={module.imageUrl}
              alt={module.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-slate-500">
              Bez slike
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-semibold text-white">{module.title}</h3>
        {module.description && (
          <p className="mt-2 text-slate-300 text-sm leading-relaxed line-clamp-3">
            {module.description}
          </p>
        )}

        {/* Lessons preview */}
        {preview.length > 0 && (
          <ul className="mt-4 space-y-2 text-slate-400 text-sm">
            {preview.map((lesson) => (
              <li key={lesson.id} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent/80" />
                <button
                  onClick={() => {
                    if (lesson.isLocked) return;
                    onPickLesson?.(lesson);
                  }}
                  className={`text-left hover:text-accent transition ${
                    lesson.isLocked ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {lesson.title}
                </button>
              </li>
            ))}
            {module.lessons.length > maxPreviewLessons && (
              <li className="text-xs text-slate-500">+ još lekcija…</li>
            )}
          </ul>
        )}

        {/* CTA */}
        <div className="mt-auto pt-6 flex items-center justify-between">
          {purchased ? (
            <span className="text-emerald-400 text-sm font-medium">
              ✔ Kupljen modul
            </span>
          ) : (
            <>
              {price !== null && (
                <span className="text-lg font-semibold text-white">
                  ${price}
                </span>
              )}
              <button
                onClick={() => onPurchaseModule?.(module)}
                className="px-4 py-2 rounded-lg bg-primary text-white 
                           hover:bg-primary-hover transition text-sm"
              >
                Kupi modul
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

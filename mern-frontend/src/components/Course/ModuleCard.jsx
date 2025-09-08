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
      className="flex flex-col overflow-hidden rounded-2xl border border-accent/60 bg-surface transition hover:border-accent hover:shadow-[0_0_15px_rgba(130,231,134,0.25)]"
    >
      {/* Media */}
      <div className="relative">
        <div className="aspect-[16/9] w-full bg-background">
          {module.imageUrl ? (
            <img src={module.imageUrl} alt={module.title} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-muted">Bez slike</div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold text-text">{module.title}</h3>

        {module.description && (
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {module.description}
          </p>
        )}

        {/* Lessons preview */}
        {preview.length > 0 && (
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {preview.map((lesson) => (
              <li key={lesson.id} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <button
                  onClick={() => {
                    if (lesson.isLocked) return;
                    onPickLesson?.(lesson);
                  }}
                  className={`transition hover:text-accent text-left ${
                    lesson.isLocked ? "cursor-not-allowed opacity-50" : ""
                  }`}
                >
                  {lesson.title}
                </button>
              </li>
            ))}
            {module.lessons.length > maxPreviewLessons && (
              <li className="text-xs text-muted">+ još lekcija…</li>
            )}
          </ul>
        )}

        {/* CTA */}
        <div className="mt-auto flex items-center justify-between pt-6">
          {purchased ? (
            <span className="text-sm font-medium text-accent">✔ Kupljen modul</span>
          ) : (
            <>
              {price !== null && <span className="text-lg font-semibold text-text">${price}</span>}
              <button
                onClick={() => onPurchaseModule?.(module)}
                className="rounded-lg bg-primary px-4 py-2 text-sm text-white transition hover:bg-primary-hover"
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

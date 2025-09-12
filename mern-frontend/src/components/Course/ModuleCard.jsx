// src/components/Module/ModuleCard.jsx
import { Link } from "react-router-dom";

export default function ModuleCard({
  module,
  moduleBasePath = "/modules",
  onPurchaseModule,
}) {
  const preview = (module.lessons || []).slice(0, 4);

  return (
    <div
      key={module.id}
      className="group flex flex-col rounded-xl border border-borderSoft bg-background overflow-hidden hover:border-accent transition hover:shadow-[0_0_20px_rgba(130,231,134,0.12)]"
    >
      {/* Slika */}
      <Link to={`${moduleBasePath}/${module.slug}`} className="block">
        <div className="aspect-[16/10] w-full bg-surface overflow-hidden">
          {module.image_url ? (
            <img
              src={module.image_url}
              alt={module.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-muted">
              Bez slike
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs text-muted">Modul {module.order}</div>
        <h3 className="mt-1 text-lg font-semibold text-text">
          {module.title}
        </h3>

        {module.description && (
          <p className="mt-2 text-sm leading-relaxed text-mutedSoft line-clamp-3">
            {module.description}
          </p>
        )}

        {/* Lessons preview */}
        {preview.length > 0 && (
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {preview.map((lesson) => (
              <li key={lesson.id} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent" />
                <span>{lesson.title}</span>
              </li>
            ))}
            {module.lessons.length > 4 && (
              <li className="text-xs text-muted">+ još lekcija…</li>
            )}
          </ul>
        )}

        {/* CTA */}
        <div className="mt-auto pt-4 flex flex-col gap-2">
          <Link
            to={`${moduleBasePath}/${module.slug}`}
            className="inline-flex items-center gap-2 text-accent font-medium"
          >
            Otvori modul
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 17L17 7M17 7H9M17 7V15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </Link>

          <button
            onClick={() => onPurchaseModule?.(module.slug)}
            className="rounded-lg bg-accent px-4 py-2 text-black font-semibold hover:bg-accent-hover transition text-sm"
          >
            🛒 Kupi samo ovaj modul
          </button>
        </div>
      </div>
    </div>
  );
}

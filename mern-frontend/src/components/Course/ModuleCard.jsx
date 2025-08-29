// components/Course/ModuleCard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ModuleCard({
  module,
  courseId,
  onPickLesson,
  onPurchaseModule,
  moduleBasePath = "/modules",
  maxPreviewLessons = 4,
  className = ""
}) {
  const purchased = !!module.isPurchased;
  const price = typeof module.price === "number" ? module.price : null;
  const preview = (module.lessons || []).slice(0, maxPreviewLessons);
  const [open, setOpen] = useState(false);

  return (
    <article className={`rounded-2xl border shadow-sm overflow-hidden bg-white flex flex-col h-full ${className}`}>
      {/* Media */}
      <div className="relative">
        <div className="aspect-[16/9] w-full bg-gray-100">
          {module.imageUrl ? (
            <img
              src={module.imageUrl}
              alt={module.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-gray-400">
              Bez slike
            </div>
          )}
        </div>

        {/* Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          {purchased ? (
            <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Kupljen
            </span>
          ) : (
            <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Dostupan pojedinačno
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-lg font-semibold text-gray-900">{module.title}</h4>
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {(module.lessons?.length || 0)} lekcija
          </span>
        </div>

        {(module.subtitle || module.description) && (
          <p className="mt-1 text-sm text-gray-600">
            {module.subtitle || module.description}
          </p>
        )}

        {/* CTA row */}
        <div className="mt-4 flex items-center gap-3">
          <Link
            to={`${moduleBasePath}/${module.id}`}
            className="inline-flex items-center justify-center px-3 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50"
          >
            Otvori modul
          </Link>

          {purchased ? (
            <span className="text-emerald-700 text-sm font-medium">
              ✔ Pristup omogućen
            </span>
          ) : (
            <>
              {price !== null && (
                <div className="text-right">
                  <div className="text-base font-bold text-gray-900">${price}</div>
                  <div className="text-[11px] text-gray-500">kurs komplet je povoljniji</div>
                </div>
              )}
              <button
                onClick={() => onPurchaseModule?.(module)}
                className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold shadow hover:bg-indigo-700"
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

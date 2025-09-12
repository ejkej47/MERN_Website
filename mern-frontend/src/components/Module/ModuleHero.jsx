// src/components/Module/ModuleHero.jsx
import React from "react";

/**
 * Props:
 * - module: { title, subtitle, image_url, price, durationHours, lessonsCount, isPurchased }
 * - onPurchase: () => void
 * - onContinue: () => void         // "Nastavi" na poslednju lekciju (ako postoji)
 * - progress: number               // 0..1 (npr. 0.35 => 35%)
 */
export default function ModuleHero({
  module = {},
  onPurchase,
  onContinue,
  progress = 0,
}) {
  const {
    title = "Modul",
    subtitle,
    image_url,
    price,
    durationHours,
    lessonsCount,
    isPurchased,
  } = module;

  const percent = Math.max(0, Math.min(100, Math.round((progress || 0) * 100)));

  return (
    <section className="grid gap-5 rounded-2xl border border-borderSoft bg-surface p-5 md:grid-cols-[1fr_1.2fr]">
      {/* Cover */}
      <div className="relative overflow-hidden rounded-xl bg-background aspect-[16/10]">
        {image_url ? (
          <img src={image_url} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-muted">
            Bez slike
          </div>
        )}
      </div>

      {/* Text + CTA + Progress */}
      <div className="flex flex-col">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text">
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-text/80">{subtitle}</p>}

          {/* Badge-ovi */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            {typeof lessonsCount === "number" && (
              <span className="inline-flex items-center gap-1 rounded-full border border-borderSoft bg-surface px-2 py-1">
                <span>🎯</span>
                <span className="text-text font-medium">{lessonsCount}</span>
                <span className="text-muted">lekcija</span>
              </span>
            )}
            {typeof durationHours === "number" && (
              <span className="inline-flex items-center gap-1 rounded-full border border-borderSoft bg-surface px-2 py-1">
                <span>⏱</span>
                <span className="text-text font-medium">{durationHours}h</span>
                <span className="text-muted">trajanje</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full border border-borderSoft bg-surface px-2 py-1">
              <span>🔒</span>
              <span className={isPurchased ? "text-accent" : "text-muted"}>
                {isPurchased ? "Otključan" : "Zaključan"}
              </span>
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {isPurchased ? (
            <button
              type="button"
              onClick={onContinue}
              className="rounded-xl bg-accent px-5 py-3 font-semibold text-black transition hover:bg-accent-hover"
            >
              Nastavi učenje
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={onPurchase}
                className="rounded-xl bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-hover"
              >
                Kupi modul
              </button>
              {typeof price === "number" && (
                <div className="text-left">
                  <div className="text-xl font-bold text-text">${price}</div>
                  <div className="text-xs text-muted">
                    Jednokratno • Bez skrivenih troškova
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="mb-1 flex items-center justify-between text-xs text-muted">
            <span>Napredak</span>
            <span className="text-text">{percent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-accent transition-[width]"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

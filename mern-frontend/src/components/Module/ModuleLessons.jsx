// src/components/Module/ModuleLessons.jsx
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

/**
 * Props:
 * - moduleId: string | number
 * - lessons: Array<{ id, title, name, isLocked?: boolean, order?: number, isQuiz?: boolean }>
 * - purchased?: boolean
 * - completedLessonIds?: number[]            // za progress
 * - onPickLesson?: (lesson) => void
 */
export default function ModuleLessons({
  moduleId,
  lessons = [],
  purchased = false,
  completedLessonIds = [],
  onPickLesson,
}) {
  // sort linearno
  const sorted = useMemo(() => {
    return [...lessons].sort((a, b) => {
      if (a.order != null && b.order != null) return a.order - b.order;
      return a.id - b.id;
    });
  }, [lessons]);

  const total = sorted.length || 0;
  const completed = useMemo(
    () => (Array.isArray(completedLessonIds) ? completedLessonIds.length : 0),
    [completedLessonIds]
  );
  const percent = total ? Math.round((completed / total) * 100) : 0;

  // last lesson from localStorage
  const lastKey = `lastLesson-module-${moduleId}`;
  const lastLessonId = useMemo(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(lastKey) : null;
    return raw ? Number(raw) : null;
  }, [moduleId]);

  const isQuizByName = (name = "") => {
    const n = (name || "").toLowerCase();
    return n.includes("upitnik") || n.includes("vezba") || n.includes("vežba");
  };

  return (
    <section className="rounded-2xl border border-borderSoft bg-surface p-5">
      {/* Progress header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text">Lekcije</h3>

        {total > 0 && (
          <div className="text-sm text-text/80">
            {completed}/{total} ({percent}%)
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="h-2 w-full overflow-hidden rounded-full bg-background">
          <div
            className="h-full rounded-full bg-accent transition-[width]"
            style={{ width: `${percent}%` }}
          />
        </div>

        {lastLessonId && (
          <div className="mt-3">
            <Link
              to={`/modules/${moduleId}/lessons/${lastLessonId}`}
              className="inline-flex items-center gap-2 rounded-lg border border-borderSoft bg-background px-3 py-2 text-sm text-text hover:bg-surface"
            >
              ➤ Nastavi od poslednje lekcije
            </Link>
          </div>
        )}
      </div>

      {/* Lista lekcija */}
      {!total ? (
        <p className="text-muted">Nema lekcija u ovom modulu.</p>
      ) : (
        <ul className="divide-y divide-borderSoft">
          {sorted.map((l, idx) => {
            const title = l.title || l.name || `Lekcija ${idx + 1}`;
            const locked = !!l.isLocked && !purchased;
            const to = locked ? "#" : `/modules/${moduleId}/lessons/${l.id}`;
            const isQuiz = l.isQuiz || isQuizByName(title);
            const isLast = lastLessonId === l.id;

            return (
              <li key={l.id} className="flex items-center justify-between py-3">
                <div className="flex min-w-0 items-center gap-3">
                  {/* indikator reda */}
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background text-xs text-text/80">
                    {idx + 1}
                  </span>

                  {/* naslov lekcije */}
                  <Link
                    to={to}
                    onClick={(e) => {
                      if (locked) {
                        e.preventDefault();
                        toast.error("Lekcija je zaključana.");
                      } else {
                        localStorage.setItem(lastKey, String(l.id));
                        onPickLesson?.(l);
                      }
                    }}
                    className={`min-w-0 truncate text-sm md:text-base transition ${
                      locked
                        ? "cursor-not-allowed text-muted"
                        : "text-text hover:text-accent"
                    }`}
                    title={title}
                  >
                    {title}
                    {isLast && !locked && (
                      <span className="ml-2 align-middle text-xs text-accent">(poslednja)</span>
                    )}
                  </Link>
                </div>

                {/* tip / status */}
                <div className="ml-3 flex shrink-0 items-center gap-2">
                  {isQuiz && (
                    <span className="rounded-full border border-borderSoft bg-surface px-2 py-1 text-xs text-muted">
                      Upitnik
                    </span>
                  )}
                  {locked ? (
                    <span className="rounded-full border border-borderSoft bg-surface px-2 py-1 text-xs text-muted">
                      🔒 Zaključano
                    </span>
                  ) : (
                    <span className="rounded-full border border-borderSoft bg-surface px-2 py-1 text-xs text-text/80">
                      ✓ Otključano
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

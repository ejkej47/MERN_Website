import { Link } from "react-router-dom";

export default function FeaturedCourseSection({ course, modules = [], onPurchaseCourse, onPurchaseModule }) {
  return (
    <section className="container mx-auto max-w-7xl px-4 py-16">
      {/* Kurs kao kontejner */}
      <div className="rounded-2xl bg-surface border border-borderSoft p-8">
        {/* Header */}
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
          ISTAKNUTO
        </span>

        <h2 className="mt-3 text-3xl font-bold text-text">
          {course ? `Kurs: ${course.title}` : "Učitavanje kursa..."}
        </h2>

        <p className="mt-3 text-mutedSoft">
          {course?.description ||
            "Kompletan program sa pažljivo dizajniranim modulima i praktičnim vežbama."}
        </p>

        {/* CTA za kurs (bundle) */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => onPurchaseCourse?.(course?.id)}
            className="rounded-xl px-5 py-3 bg-primary text-white hover:bg-primary-hover transition font-semibold"
          >
            🎁 Kupi ceo kurs (sva 3 modula)
          </button>
          <Link
            to={`/course/${course?.slug || "emocionalna-pismenost"}#modules`}
            className="rounded-xl px-5 py-3 bg-surface text-text border border-border transition hover:border-accent font-medium"
          >
            Vidi module pojedinačno
          </Link>
        </div>

        {/* Moduli unutar kursa – tri u redu */}
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {modules.map((m) => (
            <div
              key={m.id}
              className="group flex flex-col rounded-xl border border-borderSoft bg-background overflow-hidden hover:border-accent transition hover:shadow-[0_0_20px_rgba(130,231,134,0.12)]"
            >
              {/* Slika */}
              <Link to={`/modules/${m.slug}`} className="block">
                <div className="aspect-[16/10] w-full bg-surface overflow-hidden">
                  {m.image_url ? (
                    <img
                      src={m.image_url}
                      alt={m.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-muted">
                      Bez slike
                    </div>
                  )}
                </div>
              </Link>

              {/* Tekst */}
              <div className="p-5 flex flex-col flex-1">
                <div className="text-xs text-muted">Modul {m.order}</div>
                <h3 className="mt-1 text-lg font-semibold text-text">
                  {m.title}
                </h3>
                <p className="mt-2 text-mutedSoft line-clamp-3">
                  {m.description}
                </p>

                <div className="mt-auto pt-4 flex flex-col gap-2">
                  <Link
                    to={`/modules/${m.slug}`}
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
                    onClick={() => onPurchaseModule?.(m.slug)}
                    className="rounded-lg bg-accent px-4 py-2 text-black font-semibold hover:bg-accent-hover transition text-sm"
                  >
                    🛒 Kupi samo ovaj modul
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

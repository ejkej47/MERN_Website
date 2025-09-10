// src/components/landing/FeaturedCourseSection.jsx
import { Link } from "react-router-dom";

export default function FeaturedCourseSection({ course, modules }) {
  return (
    <section className="container mx-auto max-w-7xl px-4 py-16">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Featured card */}
        <div className="rounded-2xl bg-surface border border-borderSoft p-8">
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
          <div className="mt-6 flex gap-3">
            <Link
              to={`/course/${course?.slug || "emocionalna-pismenost"}`}
              className="rounded-xl px-5 py-3 bg-primary text-white hover:bg-primary-hover transition"
            >
              Detalji kursa
            </Link>
            <Link
              to={`/course/${course?.slug || "emocionalna-pismenost"}#modules`}
              className="rounded-xl px-5 py-3 bg-surface text-text border border-border transition hover:border-accent"
            >
              Vidi sve module
            </Link>
          </div>
          <div className="mt-8 h-44 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-borderSoft" />
        </div>
        {/* Modules list */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
          {modules.map((m) => (
            <Link
              key={m.id}
              to={`/modules/${m.id}`}
              className="group rounded-2xl bg-surface border border-borderSoft p-6 hover:border-accent transition hover:shadow-[0_0_0_3px_rgba(146,55,176,0.15),0_0_30px_rgba(130,231,134,0.12)]"
            >
              <div className="text-xs text-muted">Modul {m.order}</div>
              <h3 className="mt-1 text-xl font-semibold text-text">
                {m.title}
              </h3>
              <p className="mt-2 text-mutedSoft">{m.description}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-accent">
                Otvori modul
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 17L17 7M17 7H9M17 7V15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

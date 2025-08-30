// src/components/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import CourseList from "../components/Course/CourseList";
import SiteFeedbackSection from "../components/SiteFeedbackSection";

const featuredCourseId = 1;
const modules = [
  {
    id: 101,
    title: "Osnove emocionalne pismenosti",
    blurb: "Prepoznavanje emocija, vokabular i dnevnik emocija.",
    href: `/courses/${featuredCourseId}#module-1`,
  },
  {
    id: 102,
    title: "Asertivnost i granice",
    blurb: "JA-poruke, postavljanje granica, vežbe u dijalozima.",
    href: `/courses/${featuredCourseId}#module-2`,
  },
  {
    id: 103,
    title: "Regulacija i otpornost",
    blurb: "Tehnike smirivanja, reframing i plan samopomoći.",
    href: `/courses/${featuredCourseId}#module-3`,
  },
];

export default function LandingPage() {
  return (
    <div className="bg-background text-white min-h-screen">
      {/* HERO */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
        {/* Pozadinski glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(70rem 70rem at 50% -10%, rgba(148,53,176,0.40), transparent 75%), radial-gradient(50rem 50rem at 90% 10%, rgba(130,231,134,0.28), transparent 75%)",
          }}
        />

        {/* Sadržaj */}
        <div className="relative z-10 px-4 text-center max-w-3xl">
          <img
            src="/favicon.png"
            alt="Logo"
            className="w-20 h-20 mx-auto mb-6 drop-shadow"
          />

          <h1 className="relative text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            <span
              className="absolute -inset-1 blur-3xl bg-primary/10 -z-10 rounded-full"
              aria-hidden="true"
            />
            Emocionalna pismenost —{" "}
            <span className="text-accent">premium</span> online kursevi
          </h1>

          <p className="mt-6 text-lg text-slate-300">
            Stručni, praktični i topli sadržaji koji pomažu kao „terapija online“:
            nauči da razumeš, izraziš i regulišeš emocije — sopstvenim tempom.
          </p>

          {/* CTA dugmad */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={`/courses/${featuredCourseId}`}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 
                        bg-primary text-white hover:bg-primary-hover 
                        shadow-[0_0_0_3px_rgba(146,55,176,0.25),0_0_40px_rgba(130,231,134,0.15)] 
                        transition font-medium"
            >
              Pogledaj istaknuti kurs
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 
                        bg-accent text-black hover:bg-accent-hover 
                        transition font-medium"
            >
              Registruj se
            </Link>
          </div>
        </div>
      </section>


      {/* FEATURED COURSE + 3 MODULES */}
      <section className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Featured card */}
          <div className="rounded-2xl bg-surface border border-white/5 p-8">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
              ISTAKNUTO
            </span>
            <h2 className="mt-3 text-3xl font-bold text-white">
              Kurs: Emocionalna pismenost u praksi
            </h2>
            <p className="mt-3 text-slate-300">
              Kompletan program kroz tri pažljivo dizajnirana modula — od prepoznavanja emocija do
              asertivnosti i zdrave regulacije. Vežbe, radni listovi i mini-kvizovi uključeni.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                to={`/courses/${featuredCourseId}`}
                className="rounded-xl px-5 py-3 bg-primary text-white hover:bg-primary-hover transition"
              >
                Detalji kursa
              </Link>
              <Link
                to={`/courses/${featuredCourseId}#modules`}
                className="rounded-xl px-5 py-3 bg-white/10 text-white hover:bg-white/15 border border-white/10 transition"
              >
                Vidi sve module
              </Link>
            </div>
            <div className="mt-8 h-44 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/5" />
          </div>

          {/* Modules list */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {modules.map((m) => (
              <Link
                key={m.id}
                to={m.href}
                className="group rounded-2xl bg-surface border border-white/5 p-6 hover:border-accent/30 hover:shadow-[0_0_0_3px_rgba(146,55,176,0.15),0_0_30px_rgba(130,231,134,0.12)] transition"
              >
                <div className="text-xs text-slate-400">Modul</div>
                <h3 className="mt-1 text-xl font-semibold group-hover:text-accent transition text-white">
                  {m.title}
                </h3>
                <p className="mt-2 text-slate-300">{m.blurb}</p>
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

      {/* FEEDBACK */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-7xl">
          <SiteFeedbackSection />
        </div>
      </section>

      {/* FOOTER CTA */}
      <footer className="bg-surface border-t border-white/5 text-center py-12">
        <h3 className="text-2xl font-bold mb-3 text-white">Pridruži se zajednici Learnify</h3>
        <p className="text-slate-300 mb-6">Podrška, znanje i rast — svojim tempom.</p>
        <Link
          to="/register"
          className="bg-accent text-black font-semibold px-6 py-3 rounded-xl hover:bg-accent-hover transition"
        >
          Registruj se sada
        </Link>
      </footer>
    </div>
  );
}

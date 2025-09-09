// src/components/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import CourseList from "../components/Course/CourseList";
import SiteFeedbackSection from "../components/SiteFeedbackSection";

const featuredCourseId = 1;
const modules = [
  { id: 101, title: "Osnove emocionalne pismenosti", blurb: "Prepoznavanje emocija, vokabular i dnevnik emocija.", href: `/courses/${featuredCourseId}#module-1` },
  { id: 102, title: "Asertivnost i granice", blurb: "JA-poruke, postavljanje granica, vežbe u dijalozima.", href: `/courses/${featuredCourseId}#module-2` },
  { id: 103, title: "Regulacija i otpornost", blurb: "Tehnike smirivanja, reframing i plan samopomoći.", href: `/courses/${featuredCourseId}#module-3` },
];

export default function LandingPage() {
  return (
    <div className="bg-background text-text min-h-screen">
      {/* HERO */}
      {/* HERO */}
      <section className="relative min-h-[clamp(420px,60vh,820px)] py-[clamp(32px,6vh,64px)] flex items-center justify-center bg-background">
        {/* sadržaj */}
        <div className="relative z-10 px-6 text-center max-w-4xl lg:max-w-5xl">
          <img src="/favicon.png" alt="Logo" className="mx-auto mb-5 h-14 w-14 drop-shadow" />

          <h1 className="text-[clamp(28px,5vw,64px)] leading-[1.1] font-extrabold tracking-tight text-text">
            Emocionalna pismenost —{" "}
            <span className="font-extrabold text-accent">premium</span> online kursevi
          </h1>

          <p className="mt-4 text-[clamp(14px,1.6vw,18px)] text-text/80">
            Stručni, praktični i topli sadržaji koji pomažu kao „terapija online“:
            nauči da razumeš, izraziš i regulišeš emocije — sopstvenim tempom.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to={`/courses/${featuredCourseId}`}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-primary text-white hover:bg-primary-hover transition font-medium shadow-[0_0_0_3px_rgba(146,55,176,0.25),0_0_40px_rgba(130,231,134,0.15)]"
            >
              Pogledaj istaknuti kurs
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-accent text-black hover:bg-accent-hover transition font-medium"
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
          <div className="rounded-2xl bg-surface border border-borderSoft p-8">
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
              ISTAKNUTO
            </span>
            <h2 className="mt-3 text-3xl font-bold text-text">
              Kurs: Emocionalna pismenost u praksi
            </h2>
            <p className="mt-3 text-mutedSoft">
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
                to={m.href}
                className="group rounded-2xl bg-surface border border-borderSoft p-6 hover:border-accent transition
                           hover:shadow-[0_0_0_3px_rgba(146,55,176,0.15),0_0_30px_rgba(130,231,134,0.12)]"
              >
                <div className="text-xs text-muted">Modul</div>
                <h3 className="mt-1 text-xl font-semibold text-text transition">
                  {m.title}
                </h3>
                <p className="mt-2 text-mutedSoft">{m.blurb}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-accent">
                  Otvori modul
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
      <footer className="bg-surface border-t border-borderSoft text-center py-12">
        <h3 className="text-2xl font-bold mb-3 text-text">Pridruži se zajednici Learnify</h3>
        <p className="text-mutedSoft mb-6">Podrška, znanje i rast — svojim tempom.</p>
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

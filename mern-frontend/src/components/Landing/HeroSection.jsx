// src/components/landing/HeroSection.jsx
import { Link } from "react-router-dom";

export default function HeroSection({ course }) {
  return (
    <section className="relative min-h-[clamp(420px,60vh,820px)] py-[clamp(32px,6vh,64px)] flex items-center bg-background">
      <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12 px-6">
        {/* Text */}
        <div className="relative z-10 text-center lg:text-left max-w-2xl">
          <h1 className="text-[clamp(28px,5vw,64px)] leading-[1.1] font-extrabold tracking-tight text-text">
            Emocionalna pismenost —{" "}
            <span className="font-extrabold text-accent">premium</span> online kursevi
          </h1>
          <p className="mt-4 text-[clamp(14px,1.6vw,18px)] text-text/80">
            Alati za bolje razumevanje i upravljanje emocijama u svakodnevnom životu. 
            Stručni, praktični i topli sadržaji koji pomažu kao „terapija online“.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              to={`/course/${course?.slug || "emocionalna-pismenost"}`}
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
          {/* Trust indicators */}
          <div className="mt-8 flex justify-center lg:justify-start gap-8 text-sm text-mutedSoft">
            <span>⭐ 4.9 ocena</span>
            <span>👥 500+ polaznika</span>
            <span>🎓 Stručni predavači</span>
          </div>
        </div>
        {/* Slika/mockup */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <img
            src="/hero-illustration.png"
            alt="Ilustracija kursa"
            className="max-h-[360px] lg:max-h-[420px] drop-shadow-xl"
          />
        </div>
      </div>
    </section>
  );
}

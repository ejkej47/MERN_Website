// src/components/landing/AboutPreviewSection.jsx
import { Link } from "react-router-dom";

export default function AboutPreviewSection() {
  return (
    <section className="bg-background py-16">
      <div className="container mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Tekstualni deo */}
        <div>
          <h2 className="text-3xl font-bold text-text">Ko smo mi?</h2>
          <p className="mt-4 text-mutedSoft">
            Emocionalna pismenost okuplja tim stručnjaka iz psihologije,
            edukacije i digitalnog obrazovanja sa misijom da približimo
            alate za bolje razumevanje emocija svima.
          </p>
          <Link
            to="/about"
            className="mt-6 inline-block rounded-xl bg-primary text-white px-6 py-3 font-medium hover:bg-primary-hover transition"
          >
            Saznaj više o nama
          </Link>
        </div>

        {/* Slike članova tima */}
        <div className="bg-gradient-to-br from-primary/20 to-accent/20 p-6 flex justify-center gap-6">
          <img
            src="/images/ivana-dragic.png"
            alt="Ivana Dragić"
            className="h-56 w-56 object-cover rounded-full shadow-lg"
          />
          <img
            src="/images/zorica-katic.jpg"
            alt="Zorica Katić"
            className="h-56 w-56 object-cover rounded-full shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}

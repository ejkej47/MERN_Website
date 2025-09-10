// src/components/landing/CtaSection.jsx
import { Link } from "react-router-dom";

export default function CtaSection() {
  return (
    <section className="bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 py-20">
      <div className="container mx-auto text-center max-w-3xl px-6">
        <h2 className="text-3xl font-bold text-text">
          Započni svoje putovanje ka emocionalnoj pismenosti već danas
        </h2>
        <p className="mt-4 text-mutedSoft">
          Registruj se i otključaj pristup svim kursevima i materijalima.
        </p>
        <Link
          to="/register"
          className="mt-8 inline-block rounded-xl bg-primary text-white px-8 py-4 font-semibold hover:bg-primary-hover transition"
        >
          Registruj se besplatno
        </Link>
      </div>
    </section>
  );
}

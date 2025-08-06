// src/components/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import CourseList from "../components/Course/CourseList";
import SiteFeedbackSection from "../components/SiteFeedbackSection";

export default function LandingPage() {
  return (
    <div className="bg-background text-dark min-h-screen">
      {/* HERO */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            <span className="text-primary">Learnify</span> – Tvoj put do znanja
          </h1>
          <p className="text-lg text-muted mb-8">
            Pristupi praktičnim kursevima koji ti omogućavaju da naučiš kad i gde hoćeš.
          </p>
          <Link
            to="/register"
            className="inline-block bg-primary text-white px-8 py-3 rounded-xl text-lg font-medium shadow-lg hover:bg-primary/90 transition"
          >
            Registruj se besplatno
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container mx-auto py-16 px-4">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Praktični kursevi</h3>
            <p className="text-muted">
              Fokusirani na konkretne veštine koje odmah možeš koristiti.
            </p>
          </div>
          <div className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Uči svojim tempom</h3>
            <p className="text-muted">
              Nema rokova – uči kad imaš vremena, na svim uređajima.
            </p>
          </div>
          <div className="bg-white shadow rounded-xl p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Certifikat po završetku</h3>
            <p className="text-muted">
              Zabeleži svoj uspeh i pokaži šta znaš potencijalnim poslodavcima.
            </p>
          </div>
        </div>
      </section>

      {/* COURSE PREVIEW */}
      <section className="bg-muted/10 py-16 px-4">
        <div className="container mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">Istraži kurseve</h2>
          <p className="text-muted">
            Ovo su neki od naših najpopularnijih kurseva – pogledaj šta nudimo.
          </p>
        </div>
        <div className="container mx-auto">
          <CourseList />
        </div>
        <div className="text-center mt-10">
          <Link
            to="/courses"
            className="text-primary hover:underline font-medium"
          >
            Pogledaj sve kurseve →
          </Link>
        </div>
      </section>
      
      {/*FEEDBACK I RATING*/ }
      <section className="bg-muted/5 py-16 px-4">
        <SiteFeedbackSection />
      </section>

      {/* FOOTER CTA */}
      <footer className="bg-primary text-white py-12 text-center">
        <h3 className="text-2xl font-bold mb-4">Pridruži se Learnify zajednici</h3>
        <p className="mb-6">
          Pristup znanju, zajednici i podršci – potpuno besplatno.
        </p>
        <Link
          to="/register"
          className="bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition"
        >
          Registruj se sada
        </Link>
      </footer>
    </div>
  );
}

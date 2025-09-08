// src/pages/RegisterPage.jsx
import React from "react";
import RegisterForm from "../components/Forms/RegisterForm";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-borderSoft bg-surface shadow-md md:flex-row">
        {/* Register form side */}
        <div className="w-full p-8 md:w-1/2">
          <h2 className="mb-4 text-2xl font-bold text-text">Napravi nalog</h2>
          <p className="mb-6 text-sm text-muted">
            Popuni podatke ispod da registruješ novi nalog.
          </p>
          <RegisterForm />
          <div className="mt-4 text-sm text-muted">
            Već imaš nalog?{" "}
            <Link to="/login" className="text-accent hover:underline">
              Uloguj se ovde
            </Link>
          </div>
        </div>

        {/* Info side */}
        <div className="w-full bg-background p-8 md:w-1/2">
          <h3 className="mb-2 text-lg font-semibold text-text">Zašto se pridružiti Learnify?</h3>
          <ul className="mb-6 list-inside list-disc space-y-1 text-sm text-muted">
            <li>Pristup visokokvalitetnim materijalima</li>
            <li>Personalizovano iskustvo učenja</li>
            <li>Praćenje napretka i uspeha</li>
            <li>Podrška zajednice koja te motiviše</li>
          </ul>
          <Link
            to="/login"
            className="block w-full rounded bg-primary py-2 text-center font-medium text-white transition hover:bg-primary-hover"
          >
            Već imaš nalog? Uloguj se
          </Link>
        </div>
      </div>
    </div>
  );
}

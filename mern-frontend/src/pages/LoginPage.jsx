// src/pages/LoginPage.jsx
import React from "react";
import LoginForm from "../components/Forms/LoginForm";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/QoL/LoadingSpinner";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/my-courses";

  if (loading) return <LoadingSpinner className="h-screen" />;
  if (user) return <Navigate to={from} replace />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-borderSoft bg-surface shadow-md md:flex-row">
        {/* Login form side */}
        <div className="w-full p-8 md:w-1/2">
          <h2 className="mb-4 text-2xl font-bold text-text">Prijava</h2>
          <p className="mb-6 text-sm text-muted">
            Ako već imaš nalog, prijavi se ovde.
          </p>
          <LoginForm redirectPath={from} />
          <div className="mt-4 text-sm">
            <Link
              to="/forgot-password"
              className="text-accent hover:underline"
            >
              Zaboravljena lozinka?
            </Link>
          </div>
        </div>

        {/* Info side */}
        <div className="w-full bg-background p-8 md:w-1/2">
          <h3 className="mb-2 text-lg font-semibold text-text">
            Nemaš nalog?
          </h3>
          <p className="mb-4 text-sm text-muted">
            Sa Learnify nalogom možeš:
          </p>
          <ul className="mb-6 list-inside list-disc space-y-1 text-sm text-muted">
            <li>Pristupati ekskluzivnim kursevima i sadržajima</li>
            <li>Pratiti svoj napredak i dostignuća</li>
            <li>Sačuvati omiljene lekcije</li>
            <li>Postati deo naše zajednice</li>
          </ul>
          <Link
            to="/register"
            className="block w-full rounded bg-accent py-2 text-center font-medium text-black transition hover:bg-accent-hover"
          >
            Registruj se odmah
          </Link>
        </div>
      </div>
    </div>
  );
}

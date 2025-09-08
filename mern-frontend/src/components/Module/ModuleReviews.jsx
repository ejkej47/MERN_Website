// src/components/Module/ModuleReviews.jsx
import React from "react";
import SiteFeedbackSection from "../SiteFeedbackSection";

/**
 * Props:
 * - moduleId: broj ili string
 * - enableForm?: boolean (da li dozvoliti unos feedbacka direktno ovde)
 */
export default function ModuleReviews({ moduleId, enableForm = true }) {
  return (
    <section className="rounded-2xl border border-borderSoft bg-surface p-5">
      <h3 className="mb-3 text-lg font-semibold text-text">Utisci polaznika</h3>

      {/* Ako backend podržava filtriranje po modulId */}
      {moduleId ? (
        <SiteFeedbackSection moduleId={moduleId} showForm={enableForm} />
      ) : (
        <p className="text-muted">Uskoro: komentari i ocene specifične za ovaj modul.</p>
      )}
    </section>
  );
}

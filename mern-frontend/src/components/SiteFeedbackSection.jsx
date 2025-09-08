import { useState } from "react";
import FeedbackForm from "./Forms/FeedbackForm";
import FeedbackList from "./FeedbackList";
import { useAuth } from "../context/AuthContext";

export default function SiteFeedbackSection() {
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const { user } = useAuth();

  return (
    <section className="bg-surface border-t border-borderSoft px-4 py-12">
      <div className="mx-auto w-full max-w-5xl">
        {/* Naslov */}
        <header className="mb-8 text-center">
          <h2 className="text-text text-2xl sm:text-3xl font-extrabold">
            Ocene i komentari korisnika
          </h2>
          <p className="mt-2 text-text/80 text-sm">
            Podeli svoje mišljenje i pročitaj šta drugi kažu.
          </p>
        </header>

        {/* Dugme za otvaranje forme */}
        <div className="mb-6 flex justify-center">
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="rounded-lg bg-primary px-5 py-2 font-medium text-white transition hover:bg-primary-hover shadow-[0_6px_20px_rgba(0,0,0,0.06)]"
          >
            {showForm ? "Zatvori formu" : "Oceni sajt"}
          </button>
        </div>

        {/* Forma za feedback */}
        {showForm && (
          <div className="mb-10 rounded-xl border border-borderSoft bg-surface p-6 shadow-[0_6px_24px_rgba(0,0,0,0.06)]">
            <FeedbackForm onSuccess={() => setRefreshList((r) => !r)} />
          </div>
        )}

        {/* Lista feedbacka */}
        <div className="mt-8">
          <FeedbackList key={refreshList} />
        </div>
      </div>
    </section>
  );
}

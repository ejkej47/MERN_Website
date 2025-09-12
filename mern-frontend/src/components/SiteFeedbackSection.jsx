import { useState } from "react";
import FeedbackForm from "./Forms/FeedbackForm";
import FeedbackList from "./FeedbackList";
import { useAuth } from "../context/AuthContext";
import { X, Star } from "lucide-react";

export default function SiteFeedbackSection() {
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const { user } = useAuth();

  return (
    <section className="bg-surface border-t border-borderSoft px-4 py-16">
      <div className="mx-auto w-full max-w-5xl">
        {/* Naslov + prosečna ocena */}
        <header className="mb-10 text-center">
          <h2 className="text-text text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ocene i komentari korisnika
          </h2>
          <p className="mt-3 text-text/80 text-base max-w-2xl mx-auto">
            Podeli svoje mišljenje i pročitaj šta drugi kažu.
          </p>

          {/* Prosečna ocena i broj recenzija */}
          <FeedbackList key={refreshList} showOnlyStats />
        </header>

        {/* Dugme za otvaranje forme */}
        {!showForm && (
          <div className="mb-10 flex justify-center">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-primary px-6 py-2.5 font-medium text-white transition hover:bg-primary-hover shadow-md"
            >
              Oceni sajt
            </button>
          </div>
        )}

        {/* Forma za feedback */}
        {showForm && (
          <div className="relative mb-12 rounded-xl border border-borderSoft bg-surface p-6 shadow-lg">
            {/* X dugme gore desno */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute right-4 top-4 text-muted hover:text-text transition"
              aria-label="Zatvori formu"
            >
              <X size={20} />
            </button>

            <h3 className="mb-4 text-lg font-semibold text-text">
              Ostavi svoju ocenu
            </h3>
            <FeedbackForm onSuccess={() => setRefreshList((r) => !r)} />
          </div>
        )}

        {/* Lista feedbacka */}
        <div className="mt-12">
          <FeedbackList key={refreshList} />
        </div>
      </div>
    </section>
  );
}

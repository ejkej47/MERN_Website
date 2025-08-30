import { useState } from "react";
import FeedbackForm from "./Forms/FeedbackForm";
import FeedbackList from "./FeedbackList";
import { useAuth } from "../context/AuthContext";

export default function SiteFeedbackSection() {
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const { user } = useAuth();

  return (
    <section className="bg-surface py-12 px-4 border-t border-white/10">
      <div className="max-w-3xl mx-auto">
        {/* Naslov */}
        <div className="flex flex-col items-center text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Ocene i komentari korisnika
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Podeli svoje mišljenje i pročitaj šta drugi kažu.
          </p>
        </div>

        {/* Dugme za otvaranje forme */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="bg-primary text-white px-5 py-2 rounded-lg shadow-sm hover:bg-primary-hover transition"
          >
            {showForm ? "Zatvori formu" : "Oceni sajt"}
          </button>
        </div>

        {/* Forma za feedback */}
        {showForm && (
          <div className="bg-surface/80 border border-white/10 rounded-lg p-6 mb-10 shadow-sm backdrop-blur">
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

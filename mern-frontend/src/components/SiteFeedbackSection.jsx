import { useState } from "react";
import FeedbackForm from "./Forms/FeedbackForm";
import FeedbackList from "./FeedbackList";
import { useAuth } from "../context/AuthContext";

export default function SiteFeedbackSection() {
  const [showForm, setShowForm] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const { user } = useAuth();

  return (
    <section className="bg-white py-12 px-4 border-t border-gray-200">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Ocene i komentari korisnika
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Podeli svoje mišljenje i pročitaj šta drugi kažu.
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="bg-primary text-white px-5 py-2 rounded-lg shadow-sm hover:bg-primary/90 transition"
          >
            {showForm ? "Zatvori formu" : "Oceni sajt"}
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-10 shadow-sm">
            <FeedbackForm onSuccess={() => setRefreshList((r) => !r)} />
          </div>
        )}

        <div className="mt-8">
          <FeedbackList key={refreshList} />
        </div>
      </div>
    </section>
  );
}

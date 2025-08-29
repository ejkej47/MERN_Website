// src/pages/ModulePage.jsx (minimalne izmene: lista samo imena + link na LessonPage)
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

import ModuleInfo from "../components/Module/ModuleInfo";

const isQuizByName = (name = "") => {
  const n = name.toLowerCase();
  return n.includes("upitnik") || n.includes("vezba") || n.includes("vežba");
};

export default function ModulePage() {
  const { moduleId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [module, setModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/modules/${moduleId}`)
      .then((res) => {
        setModule(res.data.module || null);
        setLessons(res.data.lessons || []);
      })
      .catch((err) => {
        console.error("Greška pri dohvatu modula:", err);
        toast.error("Greška pri dohvatu modula.");
      })
      .finally(() => setLoading(false));
  }, [moduleId]);

  const sortedLessons = useMemo(
    () =>
      [...lessons].sort((a, b) => {
        if (a.order != null && b.order != null) return a.order - b.order;
        return a.id - b.id;
      }),
    [lessons]
  );

  const handlePurchaseModule = async () => {
    if (!user) {
      toast.error("Morate biti prijavljeni da biste kupili modul.");
      return navigate("/login", { state: { from: `/modules/${moduleId}` } });
    }
    try {
      const res = await axiosInstance.post(`/purchase/module/${moduleId}`);
      toast.success(res.data.message || "Modul otključan!");
      const refetch = await axiosInstance.get(`/modules/${moduleId}`);
      setModule(refetch.data.module);
      setLessons(refetch.data.lessons);
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Greška pri kupovini modula.";
      console.error("❌ Greška pri kupovini modula:", message);
      toast.error(message);
    }
  };

  if (!module) return <p className="p-4 text-gray-600">Učitavanje modula...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {module?.title || "Modul"}
          </h1>
          {module?.subtitle ? (
            <p className="text-gray-600 mt-1">{module.subtitle}</p>
          ) : null}
        </div>
      </div>

      {/* Info panel */}
      <div className="bg-white p-4 rounded shadow-sm">
        <ModuleInfo module={module} handlePurchase={handlePurchaseModule} />
      </div>

      {/* Samo imena lekcija (linkovi) */}
      <div className="bg-white p-4 rounded shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Lekcije</h3>
        {!sortedLessons.length ? (
          <p className="text-sm text-gray-600">Nema lekcija u ovom modulu.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {sortedLessons.map((l) => (
              <li key={l.id} className="py-2 flex items-center justify-between">
                <Link
                  to={
                    l.isLocked
                      ? "#"
                      : `/modules/${moduleId}/lessons/${l.id}`
                  }
                  onClick={(e) => {
                    if (l.isLocked) {
                      e.preventDefault();
                      toast.error("Lekcija je zaključana.");
                    } else {
                      localStorage.setItem(`lastLesson-module-${moduleId}`, String(l.id));
                    }
                  }}
                  className={`text-sm md:text-base ${
                    l.isLocked
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-indigo-600 hover:underline"
                  }`}
                >
                  {l.title || l.name}
                </Link>
                <span className="text-xs text-gray-500">
                  {isQuizByName(l.title || l.name) || l.isQuiz ? "Upitnik" : "Lekcija"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

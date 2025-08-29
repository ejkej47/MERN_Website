// src/pages/LessonPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import toast from "react-hot-toast";
import LessonContent from "../components/LessonContent";

const isQuizByName = (name = "") => {
  const n = name.toLowerCase();
  return n.includes("upitnik") || n.includes("vezba") || n.includes("vežba");
};

export default function LessonPage() {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();

  const [module, setModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch module + lessons once
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    axiosInstance
      .get(`/modules/${moduleId}`)
      .then((res) => {
        if (!mounted) return;
        const m = res.data?.module ?? null;
        const ls = res.data?.lessons ?? [];
        setModule(m);
        setLessons(ls);
      })
      .catch((err) => {
        console.error("Greška pri dohvatu modula:", err);
        toast.error("Greška pri dohvatu modula.");
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [moduleId]);

  // Find selected lesson when lessons or lessonId change
  useEffect(() => {
    if (!lessons.length) return;
    const found = lessons.find((l) => String(l.id) === String(lessonId));
    if (!found) {
      toast.error("Lekcija nije pronađena.");
      return navigate(`/modules/${moduleId}`, { replace: true });
    }
    if (found.isLocked) {
      toast.error("Ova lekcija je zaključana.");
      return navigate(`/modules/${moduleId}`, { replace: true });
    }
    setSelectedLesson(found);
    localStorage.setItem(`lastLesson-module-${moduleId}`, String(found.id));
  }, [lessons, lessonId, navigate, moduleId]);

  const sortedLessons = useMemo(
    () =>
      [...lessons].sort((a, b) => {
        // pokušaj da koristiš order/index ako postoji
        if (a.order != null && b.order != null) return a.order - b.order;
        return a.id - b.id;
      }),
    [lessons]
  );

  const currentIndex = useMemo(() => {
    if (!selectedLesson) return -1;
    return sortedLessons.findIndex((l) => l.id === selectedLesson.id);
  }, [sortedLessons, selectedLesson]);

  const goPrev = () => {
    if (currentIndex > 0) {
      const prev = sortedLessons[currentIndex - 1];
      if (prev?.isLocked) return toast.error("Prethodna lekcija je zaključana.");
      navigate(`/modules/${moduleId}/lessons/${prev.id}`);
    }
  };

  const goNext = () => {
    if (currentIndex >= 0 && currentIndex < sortedLessons.length - 1) {
      const next = sortedLessons[currentIndex + 1];
      if (next?.isLocked) return toast.error("Sledeća lekcija je zaključana.");
      navigate(`/modules/${moduleId}/lessons/${next.id}`);
    }
  };

  if (loading || !module) {
    return <p className="p-4 text-gray-600">Učitavanje...</p>;
  }

  const isQuiz = selectedLesson ? isQuizByName(selectedLesson.name || selectedLesson.title) || selectedLesson.isQuiz : false;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Back to module */}
      <div className="flex items-center justify-between">
        <Link
          to={`/modules/${moduleId}`}
          className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
        >
          <span aria-hidden>←</span>
          <span>Nazad na modul</span>
        </Link>
        {selectedLesson && (
          <div className="text-sm text-gray-600">
            {module?.title} • {isQuiz ? "Upitnik" : "Lekcija"}
          </div>
        )}
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          {selectedLesson?.title || selectedLesson?.name || "Lekcija"}
        </h1>
        {selectedLesson?.subtitle && (
          <p className="text-gray-600 mt-1">{selectedLesson.subtitle}</p>
        )}
      </div>

      {/* Content */}
      <div className="bg-white rounded shadow-sm p-4">
        <LessonContent selectedLesson={selectedLesson} />
        {!selectedLesson && (
          <p className="text-sm text-gray-500">Odaberite lekciju.</p>
        )}
      </div>

      {/* Navigation: prev/next */}
      <div className="flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={currentIndex <= 0}
          className={`px-4 py-2 rounded border ${
            currentIndex <= 0
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50 border-gray-300"
          }`}
        >
          ← Prethodna
        </button>
        <button
          onClick={goNext}
          disabled={currentIndex === -1 || currentIndex >= sortedLessons.length - 1}
          className={`px-4 py-2 rounded border ${
            currentIndex === -1 || currentIndex >= sortedLessons.length - 1
              ? "text-gray-400 border-gray-200 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-50 border-gray-300"
          }`}
        >
          Sledeća →
        </button>
      </div>
    </div>
  );
}

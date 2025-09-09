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
    if (!lessonId || !lessons.length) return;
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

  // Sort lessons (linearno)
  const sortedLessons = useMemo(
    () =>
      [...lessons].sort((a, b) => {
        if (a.order != null && b.order != null) return a.order - b.order;
        return a.id - b.id;
      }),
    [lessons]
  );

  const currentIndex = useMemo(() => {
    if (!selectedLesson) return -1;
    return sortedLessons.findIndex((l) => l.id === selectedLesson.id);
  }, [sortedLessons, selectedLesson]);

  const total = sortedLessons.length || 0;
  const progressPercent =
    currentIndex >= 0 && total > 0 ? Math.round(((currentIndex + 1) / total) * 100) : 0;

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
    return <div className="mx-auto max-w-6xl p-6 text-muted">Učitavanje…</div>;
  }

  const isQuiz = selectedLesson
    ? isQuizByName(selectedLesson.name || selectedLesson.title) || selectedLesson.isQuiz
    : false;

  // Button base styles
  const btnBase =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition";
  const btnPrev =
    "border border-borderSoft bg-surface text-text hover:bg-background";
  const btnNext =
    "border border-borderSoft bg-surface text-text hover:bg-background";

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-6">
      {/* Header: back link, title, progress, navigation */}
      <header className="space-y-4">
        {/* Nazad na modul (sekundarni link) */}
        <Link
          to={`/modules/${moduleId}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          ← Nazad na modul
        </Link>

        {/* Naslov + subtitle */}
        <h1 className="text-2xl md:text-3xl font-bold text-text text-center">
          {selectedLesson?.title || selectedLesson?.name || "Lekcija"}
        </h1>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-accent transition-[width]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>


        {/* Prev / Next dugmad */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={goPrev}
            disabled={currentIndex <= 0}
            className={`${btnBase} ${btnPrev} ${
              currentIndex <= 0 ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            ← Prethodna
          </button>
          <button
            onClick={goNext}
            disabled={currentIndex === -1 || currentIndex >= sortedLessons.length - 1}
            className={`${btnBase} ${btnNext} ${
              currentIndex === -1 || currentIndex >= sortedLessons.length - 1
                ? "cursor-not-allowed opacity-60"
                : ""
            }`}
          >
            Sledeća →
          </button>
        </div>
      </header>

      {/* Sadržaj lekcije */}
      <section className="rounded-2xl border border-borderSoft bg-surface p-4 md:p-6">
        <LessonContent selectedLesson={selectedLesson} />
        {!selectedLesson && (
          <p className="text-sm text-muted">Odaberite lekciju.</p>
        )}
      </section>
    </div>
  );
}

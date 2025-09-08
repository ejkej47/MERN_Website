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
    "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition";
  const btnEnabled = "border-borderSoft bg-surface text-text hover:bg-background";
  const btnDisabled = "border-borderSoft bg-surface text-muted cursor-not-allowed opacity-60";

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-6">
      {/* Sticky top bar: back, title/meta, prev/next + progress */}
      <div className="sticky top-0 z-40 -mx-4 border-b border-borderSoft bg-background/90 px-4 backdrop-blur">
        <div className="flex items-center justify-between py-3">
          {/* Back to module - sada vidljiv kao dugme */}
          <Link
            to={`/modules/${moduleId}`}
            className={`${btnBase} ${btnEnabled}`}
            aria-label="Nazad na modul"
          >
            <span aria-hidden>←</span>
            <span>Nazad na modul</span>
          </Link>

          {/* Title + meta (centar) */}
          <div className="min-w-0 px-3 text-center">
            <div className="truncate text-sm text-text/80">
              {module?.title} • {isQuiz ? "Upitnik" : "Lekcija"}
              {currentIndex >= 0 && total > 0 ? (
                <span className="ml-2 text-muted">
                  ({currentIndex + 1}/{total})
                </span>
              ) : null}
            </div>
            {/* Progress bar */}
            <div className="mt-2 h-2 w-[60vw] max-w-xl overflow-hidden rounded-full bg-surface md:w-[40vw]">
              <div
                className="h-full rounded-full bg-accent transition-[width]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Prev / Next (desno) */}
          <div className="flex items-center gap-2">
            <button
              onClick={goPrev}
              disabled={currentIndex <= 0}
              className={`${btnBase} ${currentIndex <= 0 ? btnDisabled : btnEnabled}`}
              aria-label="Prethodna lekcija"
            >
              ← Prethodna
            </button>
            <button
              onClick={goNext}
              disabled={currentIndex === -1 || currentIndex >= sortedLessons.length - 1}
              className={`${btnBase} ${
                currentIndex === -1 || currentIndex >= sortedLessons.length - 1
                  ? btnDisabled
                  : btnEnabled
              }`}
              aria-label="Sledeća lekcija"
            >
              Sledeća →
            </button>
          </div>
        </div>
      </div>

      {/* Naslov lekcije */}
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold text-text">
          {selectedLesson?.title || selectedLesson?.name || "Lekcija"}
        </h1>
        {selectedLesson?.subtitle && (
          <p className="text-text/80">{selectedLesson.subtitle}</p>
        )}
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

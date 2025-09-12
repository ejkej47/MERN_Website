// src/pages/ModulePage.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// Komponente
import ModuleHero from "../components/Module/ModuleHero";
import ModuleTabs from "../components/Module/ModuleTabs";
import ModuleOverview from "../components/Module/ModuleOverview";
import ModuleLessons from "../components/Module/ModuleLessons";
import ModulePractice from "../components/Module/ModulePractice";
import ModuleReviews from "../components/Module/ModuleReviews";

export default function ModulePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [module, setModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // === Fetch ===
  const fetchModule = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/modules/slug/${slug}`);
      setModule(res.data.module || null);
      setLessons(res.data.lessons || []);
    } catch (err) {
      console.error("Greška pri dohvatu modula:", err);
      toast.error("Greška pri dohvatu modula.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchModule();
  }, [fetchModule]);

  // === Derived ===
  const sortedLessons = useMemo(() => {
    return [...lessons].sort((a, b) => {
      if (a.order != null && b.order != null) return a.order - b.order;
      return a.id - b.id;
    });
  }, [lessons]);

  const purchased = !!module?.isPurchased;
  const lessonsCount = sortedLessons.length || 0;
  const durationH = module?.durationHours ?? module?.duration ?? null;

  const completedLessonIds = useMemo(() => {
    return sortedLessons.filter((l) => l.completed).map((l) => l.id);
  }, [sortedLessons]);

  const progress =
    lessonsCount > 0 ? (completedLessonIds.length || 0) / lessonsCount : 0;

  const lessonsByType = useMemo(() => {
    return {
      quiz: sortedLessons.filter((l) => l.type === "quiz"),
      exercise: sortedLessons.filter((l) => l.type === "exercise"),
    };
  }, [sortedLessons]);

  // === Actions ===
  const handlePurchaseModule = async () => {
    if (!user) {
      toast.error("Morate biti prijavljeni da biste kupili modul.");
      return navigate("/login", { state: { from: `/modules/${slug}` } });
    }
    try {
      const res = await axiosInstance.post(`/purchase-module/${slug}`);
      toast.success(res.data.message || "Modul otključan!");
      await fetchModule();
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Greška pri kupovini modula.";
      console.error("❌ Greška pri kupovini modula:", message);
      toast.error(message);
    }
  };

  const handleContinue = () => {
    const key = `lastLesson-module-${slug}`;
    const lastId =
      typeof window !== "undefined" ? localStorage.getItem(key) : null;
    const to = lastId
      ? `/modules/${slug}/lessons/${lastId}`
      : sortedLessons[0]
      ? `/modules/${slug}/lessons/${sortedLessons[0].id}`
      : null;

    if (to) navigate(to);
    else toast("Nema dostupnih lekcija.", { icon: "ℹ️" });
  };

  // === UI ===
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl p-6 text-muted">Učitavanje modula…</div>
    );
  }
  if (!module) {
    return (
      <div className="mx-auto max-w-6xl p-6 text-text">
        Modul nije pronađen.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      {/* Nazad na kurs */}
      {module?.course_slug && (
        <Link
          to={`/course/${module.course_slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          ← Nazad na kurs
        </Link>
      )}

      {/* HERO */}
      <ModuleHero
        module={{
          title: module.title,
          subtitle: null,
          image_url: module.image_url,
          price: module.price,
          durationHours: durationH,
          lessonsCount,
          isPurchased: purchased,
        }}
        onPurchase={handlePurchaseModule}
        onContinue={handleContinue}
        progress={progress}
      />

      {/* TABS */}
      <ModuleTabs
        tabs={[
          { id: "overview", label: "Pregled" },
          { id: "lessons", label: "Lekcije", count: lessonsCount },
          {
            id: "practice",
            label: "Upitnici i vežbe",
            count: lessonsByType.quiz.length + lessonsByType.exercise.length,
          },
          { id: "reviews", label: "Utisci" },
        ]}
        active={activeTab}
        onChange={setActiveTab}
        sticky
      />

      {/* CONTENT */}
      <section className="mt-6 space-y-6">
        {activeTab === "overview" && (
          <ModuleOverview module={module} onPurchase={handlePurchaseModule} />
        )}

        {activeTab === "lessons" && (
          <ModuleLessons
            moduleSlug={slug}
            lessons={sortedLessons.map((l) => ({
              ...l,
              badge:
                l.type === "quiz"
                  ? "📝 Upitnik"
                  : l.type === "exercise"
                  ? "💪 Vežba"
                  : null,
            }))}
            purchased={purchased}
            completedLessonIds={completedLessonIds}
            onPickLesson={(lesson) => {
              localStorage.setItem(
                `lastLesson-module-${slug}`,
                String(lesson.id)
              );
            }}
          />
        )}

        {activeTab === "practice" && (
          <ModulePractice
            moduleSlug={slug}
            lessons={sortedLessons.filter((l) =>
              ["quiz", "exercise"].includes(l.type)
            )}
            purchased={purchased}
            completedLessonIds={completedLessonIds}
            onPickLesson={(lesson) => {
              localStorage.setItem(
                `lastLesson-module-${slug}`,
                String(lesson.id)
              );
            }}
          />
        )}

        {activeTab === "reviews" && (
          <ModuleReviews moduleSlug={slug} enableForm />
        )}
      </section>
    </div>
  );
}

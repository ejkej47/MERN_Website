// src/pages/ModulePage.jsx
import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

// NOVE komponente (iz ovog refaktora)
import ModuleHero from "../components/Module/ModuleHero";
import ModuleTabs from "../components/Module/ModuleTabs";
import ModuleOverview from "../components/Module/ModuleOverview";
import ModuleLessons from "../components/Module/ModuleLessons";
import ModuleReviews from "../components/Module/ModuleReviews";

export default function ModulePage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [module, setModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview | lessons | resources | reviews

  // === Fetch ===
  const fetchModule = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/modules/${moduleId}`);
      setModule(res.data.module || null);
      setLessons(res.data.lessons || []);
    } catch (err) {
      console.error("Greška pri dohvatu modula:", err);
      toast.error("Greška pri dohvatu modula.");
    } finally {
      setLoading(false);
    }
  }, [moduleId]);

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

  // ako API vraća info o završenim lekcijama, koristi ga – inače osnovni heuristik (0)
  const completedLessonIds = useMemo(() => {
    // primer: ako backend šalje l.completed === true
    return sortedLessons.filter((l) => l.completed).map((l) => l.id);
  }, [sortedLessons]);

  const progress =
    lessonsCount > 0 ? (completedLessonIds.length || 0) / lessonsCount : 0;

  // === Actions ===
  const handlePurchaseModule = async () => {
    if (!user) {
      toast.error("Morate biti prijavljeni da biste kupili modul.");
      return navigate("/login", { state: { from: `/modules/${moduleId}` } });
    }
    try {
      const res = await axiosInstance.post(`/purchase/module/${moduleId}`);
      toast.success(res.data.message || "Modul otključan!");
      await fetchModule();
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Greška pri kupovini modula.";
      console.error("❌ Greška pri kupovini modula:", message);
      toast.error(message);
    }
  };

  const handleContinue = () => {
    const key = `lastLesson-module-${moduleId}`;
    const lastId = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    const to = lastId
      ? `/modules/${moduleId}/lessons/${lastId}`
      : (sortedLessons[0] ? `/modules/${moduleId}/lessons/${sortedLessons[0].id}` : null);

    if (to) navigate(to);
    else toast("Nema dostupnih lekcija.", { icon: "ℹ️" });
  };

  // === UI ===
  if (loading) {
    return <div className="mx-auto max-w-6xl p-6 text-muted">Učitavanje modula…</div>;
  }
  if (!module) {
    return <div className="mx-auto max-w-6xl p-6 text-text">Modul nije pronađen.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      {/* HERO */}
      <ModuleHero
        module={{
          title: module.title,
          subtitle: module.subtitle,
          imageUrl: module.imageUrl,
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
          { id: "overview", label: "Overview" },
          { id: "lessons", label: "Lekcije", count: lessonsCount },
          { id: "resources", label: "Resursi", count: module?.resources?.length || 0 },
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
            moduleId={moduleId}
            lessons={sortedLessons}
            purchased={purchased}
            completedLessonIds={completedLessonIds}
            onPickLesson={(lesson) => {
              // čuvamo "nastavi gde si stao"
              localStorage.setItem(`lastLesson-module-${moduleId}`, String(lesson.id));
            }}
          />
        )}

        {activeTab === "resources" && (
          <div className="rounded-2xl border border-borderSoft bg-surface p-5">
            <h3 className="mb-3 text-lg font-semibold text-text">Resursi</h3>
            {Array.isArray(module.resources) && module.resources.length > 0 ? (
              <ul className="space-y-2">
                {module.resources.map((r, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-borderSoft bg-background p-3"
                  >
                    <div className="flex items-center gap-2">
                      <span>📄</span>
                      <span className="text-text/85">{r.name || "Resurs"}</span>
                    </div>
                    {r.url && (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-accent hover:underline"
                      >
                        Otvori
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">Trenutno nema dodatnih resursa.</p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <ModuleReviews moduleId={moduleId} enableForm />
        )}
      </section>
    </div>
  );
}

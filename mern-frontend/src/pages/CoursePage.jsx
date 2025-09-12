import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import toast from "react-hot-toast";

import CourseHero from "../components/Course/CourseHero";
import PurchaseCard from "../components/Course/PurchaseCard";
import ModuleCard from "../components/Course/ModuleCard";
import StickyMobileBar from "../components/Course/StickyMobileBar";
import StatsBar from "../components/Course/StatsBar";

export default function CourseDetail() {
  const { slug } = useParams();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1) Kurs po slug-u
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/courses/slug/${slug}/full-content`)
      .then((res) => {
        setCourse(res.data.course);
        setModules(res.data.modules || []);
      })
      .catch((e) => {
        console.error("❌ Greška pri dohvatu kursa:", e);
        toast.error("Greška pri dohvatu kursa.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handlePurchaseCourse = async () => {
    try {
      const res = await axiosInstance.post(`/purchase/${course.id}`);
      toast.success(res.data?.message || "Kupovina uspešna!");
      const refreshed = await axiosInstance.get(`/courses/slug/${slug}`);
      setCourse(refreshed.data);
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Greška pri kupovini.";
      toast.error(msg);
    }
  };

  const handlePurchaseModule = async (modId) => {
    try {
      const res = await axiosInstance.post(`/purchase-module/${modId}`);
      toast.success(res.data?.message || "Modul otključan!");
      const refreshed = await axiosInstance.get(`/courses/slug/${slug}/full-content`);
      setCourse(refreshed.data.course);
      setModules(refreshed.data.modules || []);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Greška pri kupovini modula.";
      toast.error(msg);
    }
  };

  const isPurchased = !!course?.isPurchased;

  if (loading) {
    return <div className="mx-auto max-w-6xl p-6 text-muted">Učitavanje…</div>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
      {/* 1) HERO */}
      <CourseHero
        course={course}
        isPurchased={isPurchased}
        onPurchase={handlePurchaseCourse}
      />

      {/* 2) UVODNI VIDEO */}
      {course?.introVideoUrl && (
        <section className="rounded-2xl border border-borderSoft bg-surface p-6">
          <h3 className="mb-4 text-xl font-bold text-text">Uvod u kurs</h3>
          <video
            src={course.introVideoUrl}
            controls
            className="w-full rounded-lg border border-borderSoft"
          />
        </section>
      )}

      {/* 3) STATSBAR */}
      <StatsBar
        lessonsCount={course?.lessonCount}
        modulesCount={modules?.length}
        duration={course?.durationHours}
      />

      {/* 4) MODULI */}
      <section className="space-y-6">
        <h3 className="text-2xl font-bold text-text">Moduli u kursu</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((mod) => (
            <ModuleCard
              key={mod.id}
              module={mod}
              moduleBasePath="/modules"
              onPurchaseModule={() => handlePurchaseModule(mod.id)}
            />
          ))}
        </div>
      </section>

      {/* 5) PURCHASE CARD */}
      <PurchaseCard
        course={course}
        isPurchased={isPurchased}
        onPurchase={handlePurchaseCourse}
      />

      {/* 6) FAQ */}
      <section className="rounded-2xl border border-borderSoft bg-surface p-6">
        <h3 className="mb-4 text-xl font-bold text-text">Česta pitanja</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="font-semibold text-text">Da li imam doživotan pristup?</p>
            <p className="text-sm text-muted">
              Da, kurs ostaje dostupan bez vremenskog ograničenja.
            </p>
          </div>
          <div>
            <p className="font-semibold text-text">Postoji li garancija povraćaja?</p>
            <p className="text-sm text-muted">
              Da, 7 dana bez pitanja — samo nam piši.
            </p>
          </div>
        </div>
      </section>

      {/* 7) STICKY MOBILE CTA */}
      <StickyMobileBar
        isPurchased={isPurchased}
        price={course?.price}
        onPurchase={handlePurchaseCourse}
      />
    </div>
  );
}

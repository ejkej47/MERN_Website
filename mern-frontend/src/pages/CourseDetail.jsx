import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import toast from "react-hot-toast";

import CourseHero from "../components/Course/CourseHero";
import PurchaseCard from "../components/Course/PurchaseCard";
import ModuleCard from "../components/Course/ModuleCard";
import StickyMobileBar from "../components/Course/StickyMobileBar";
import StatsBar from "../components/Course/StatsBar";
// import LessonContent from "../components/CourseDetail/LessonContent";

export default function CourseDetail() {
  const { slug } = useParams();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [courseLessons, setCourseLessons] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1) Kurs po slug-u
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/courses/slug/${slug}`)
      .then((r) => setCourse(r.data))
      .catch((e) => console.error(e));
  }, [slug]);

  // 2) Full content
  useEffect(() => {
    if (!course) return;
    setLoading(true);
    axiosInstance
      .get(`/courses/${course.id}/full-content`)
      .then((res) => {
        const intro = res.data.courseLessons || [];
        const mods = res.data.modules || [];
        setCourseLessons(intro);
        setModules(mods);
        const all = [...intro, ...mods.flatMap((m) => m.lessons || [])];
        setLessons(all);
        const last = localStorage.getItem(`lastLesson-${course.id}`);
        if (last) {
          const found = all.find((l) => String(l.id) === last);
          if (found && !found.isLocked) setSelectedLesson(found);
        }
      })
      .catch((e) => {
        console.error(e);
        setLessons([]);
      })
      .finally(() => setLoading(false));
  }, [course]);

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

  const handlePurchaseModule = async (mod) => {
    try {
      const res = await axiosInstance.post(`/purchase/module/${mod.id}`);
      toast.success(res.data?.message || "Modul otključan!");
      const [c, full] = await Promise.all([
        axiosInstance.get(`/courses/slug/${slug}`),
        axiosInstance.get(`/courses/${course.id}/full-content`),
      ]);
      setCourse(c.data);
      setCourseLessons(full.data.courseLessons || []);
      setModules(full.data.modules || []);
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Greška pri kupovini modula.";
      toast.error(msg);
    }
  };

  const isPurchased = !!course?.isPurchased;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">
      {/* 1) HERO */}
      <CourseHero
        course={course}
        isPurchased={isPurchased}
        onPurchase={handlePurchaseCourse}
      />

      {/* 2) STATSBAR */}
      <StatsBar
        lessonsCount={lessons?.length}
        modulesCount={modules?.length}
        duration={course?.durationHours}
      />

      {/* 3) Intro lekcije / video (iznad svega) */}
      {courseLessons?.length > 0 && (
        <section className="rounded-2xl bg-white shadow-sm p-6">
          <h3 className="text-xl font-bold mb-4">Uvod u kurs</h3>
          <ul className="space-y-2">
            {courseLessons.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => {
                    if (l.isLocked) return;
                    setSelectedLesson(l);
                    localStorage.setItem(`lastLesson-${course.id}`, l.id);
                  }}
                  className="text-left w-full px-3 py-2 rounded-lg border hover:bg-gray-50"
                >
                  {l.title}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 4) MODULI – Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((mod) => (
          <ModuleCard
            key={mod.id}
            module={mod}
            onPickLesson={setSelectedLesson}
            courseId={course?.id}
            onPurchaseModule={handlePurchaseModule}
            moduleBasePath="/modules"
            className="h-full"
          />
        ))}
      </div>




      {/* 5) Purchase card ispod modula */}
      <PurchaseCard
        course={course}
        isPurchased={isPurchased}
        onPurchase={handlePurchaseCourse}
      />

      {/* 6) Lesson content preview */}
      <section className="rounded-2xl bg-white shadow-sm p-6">
        {selectedLesson ? (
          <>
            <h4 className="text-xl font-bold mb-4">{selectedLesson.title}</h4>
            {/* <LessonContent selectedLesson={selectedLesson} /> */}
            <p className="text-gray-600">
              Ovde ide sadržaj lekcije / video / tekst.
            </p>
          </>
        ) : (
          <p className="text-gray-500">Odaberi lekciju iz plana i programa.</p>
        )}
      </section>

      {/* 7) FAQ */}
      <section className="rounded-2xl bg-white shadow-sm p-6">
        <h3 className="text-xl font-bold mb-4">Česta pitanja</h3>
        <div className="grid md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <p className="font-semibold">Da li imam doživotan pristup?</p>
            <p className="text-sm">
              Da, kurs ostaje dostupan bez vremenskog ograničenja.
            </p>
          </div>
          <div>
            <p className="font-semibold">Postoji li garancija povraćaja?</p>
            <p className="text-sm">Da, 7 dana bez pitanja — samo nam piši.</p>
          </div>
        </div>
      </section>

      {/* 8) Mobile sticky CTA */}
      <StickyMobileBar
        isPurchased={isPurchased}
        price={course?.price}
        onPurchase={handlePurchaseCourse}
      />
    </div>
  );
}

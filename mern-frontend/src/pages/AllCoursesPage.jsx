import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosInstance";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Greška pri dohvatu kurseva:", err));
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-4 text-4xl font-extrabold text-text text-center">
        Naša ponuda kurseva i modula
      </h1>
      <p className="mb-12 max-w-3xl mx-auto text-center text-lg text-muted">
        Istražite našu kompletnu biblioteku kurseva i modula osmišljenu da vam
        pruži praktična znanja i veštine. Bilo da želite da započnete od osnova
        ili da usavršite postojeće znanje, ovde ćete pronaći sadržaje koji
        odgovaraju vašim ciljevima.
      </p>

      {courses.map((course) => (
        <div
          key={course.id}
          className="mb-16 overflow-hidden rounded-2xl border border-borderSoft bg-surface shadow-md"
        >
          {/* Kurs header sa velikom slikom */}
          <div className="relative">
            <img
              src={course.imageUrl}
              alt={course.title}
              className="h-72 w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-4 left-6 text-white">
              <h2 className="text-3xl font-bold drop-shadow">{course.title}</h2>
              <p className="text-sm opacity-90">
                {course.lessonCount ?? 0} uvodnih lekcija
              </p>
            </div>
          </div>

          {/* Kurs opis + link */}
          <div className="p-6">
            <p className="mb-4 text-base text-muted">
              {course.description?.substring(0, 220)}...
            </p>
            <div className="flex items-center justify-between">
              <div className="font-semibold text-accent">
                {course.price === 0 ? "Besplatan kurs" : `$${course.price}`}
              </div>
              <Link
                to={`/course/${course.slug}`}
                className="rounded-lg bg-primary px-5 py-2 text-white font-medium transition hover:bg-primary-hover"
              >
                Pogledaj kurs
              </Link>
            </div>
          </div>

          {/* Moduli kursa */}
          <div className="border-t border-borderSoft p-6">
            <h3 className="mb-4 text-xl font-semibold text-text">
              Moduli uključeni u kurs
            </h3>
            <ModulesList courseId={course.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
function ModulesList({ courseId }) {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    axiosInstance
      .get(`/courses/${courseId}/full-content`)
      .then((res) => setModules(res.data.modules || []))
      .catch((err) => console.error("Greška pri dohvatu modula:", err));
  }, [courseId]);

  if (!modules.length) {
    return <p className="text-sm text-muted">Trenutno nema modula.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {modules.map((mod) => (
        <Link
          key={mod.id}
          to={`/modules/${mod.slug}`} 
          className="flex flex-col overflow-hidden rounded-xl border border-borderSoft bg-background hover:shadow-lg transition"
        >
          {/* Slika modula */}
          <div className="aspect-[16/9] w-full bg-surface">
            {mod.image_url ? (
              <img
                src={mod.image_url}
                alt={mod.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-muted text-sm">
                Bez slike
              </div>
            )}
          </div>

          {/* Tekstualni deo */}
          <div className="flex flex-col flex-grow p-4">
            <h4 className="mb-1 font-semibold text-text">{mod.title}</h4>
            {mod.description && (
              <p className="text-sm text-muted mb-2 line-clamp-2">
                {mod.description}
              </p>
            )}
            <div className="mt-auto text-xs font-semibold text-accent">
              {mod.price === 0 ? "Besplatno" : `$${mod.price}`}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

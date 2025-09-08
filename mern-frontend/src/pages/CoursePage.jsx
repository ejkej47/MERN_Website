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
    <div className="container mx-auto px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold text-text">Svi kursevi</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex flex-col rounded-xl border border-borderSoft bg-surface shadow-sm transition duration-200 hover:shadow-md"
          >
            <img
              src={course.imageUrl}
              alt={course.title}
              className="h-40 w-full rounded-t-xl object-cover"
            />

            <div className="flex flex-grow flex-col p-5">
              <h2 className="mb-2 text-xl font-semibold text-text">{course.title}</h2>

              <p className="mb-4 flex-grow text-sm text-muted">
                {course.description?.substring(0, 120)}...
              </p>

              <div className="mb-1 text-sm text-muted">
                Broj uvodnih lekcija: {course.lessonCount ?? 0}
              </div>

              <div className="mb-4 font-bold text-accent">
                Cena: {course.price === 0 ? "Besplatno" : `$${course.price}`}
              </div>

              <Link
                to={`/course/${course.slug}`}
                className="mt-auto inline-block rounded-lg bg-primary px-4 py-2 text-center font-medium text-white transition hover:bg-primary-hover"
              >
                Pogledaj kurs
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

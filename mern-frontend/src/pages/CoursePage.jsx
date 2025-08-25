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
      <h1 className="text-3xl font-bold mb-8">Svi kursevi</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200 border flex flex-col"
          >
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-40 object-cover rounded-t-xl"
            />

            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>

              <p className="text-gray-600 text-sm flex-grow mb-4">
                {course.description.substring(0, 120)}...
              </p>

              <div className="text-sm text-gray-500 mb-1">
                Broj uvodnih lekcija: {course.lessonCount ?? 0}
              </div>

              <div className="text-primary font-bold mb-4">
                Cena: {course.price === 0 ? "Besplatno" : `$${course.price}`}
              </div>

              <Link
                to={`/course/${course.slug}`}
                className="mt-auto inline-block text-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
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

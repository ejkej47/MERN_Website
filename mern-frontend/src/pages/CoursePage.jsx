import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosInstance";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axiosInstance.get("/courses")
      .then(res => setCourses(res.data))
      .catch(err => console.error("Greška pri dohvatu kurseva:", err));
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Svi kursevi</h1>
      
      <div className="space-y-6">
        {courses.map(course => (
          <div
            key={course.id}
            className="flex flex-col md:flex-row items-start gap-4 p-6 bg-white rounded shadow hover:shadow-md transition"
          >
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full md:w-48 h-32 object-cover rounded"
            />

            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-1">{course.title}</h2>
              <p className="text-gray-700 mb-2">
                {course.description.substring(0, 160)}...
              </p>
              <p className="text-sm text-gray-500 mb-1">
                Broj lekcija: {course.lessonCount ?? "N/A"}
              </p>
              <p className="font-bold text-primary mb-3">Cena: ${course.price}</p>

              <Link
                to={`/course/${course.slug}`}
                className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
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

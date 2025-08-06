// src/components/Course/MyCourses.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import LoadingSpinner from "../QoL/LoadingSpinner";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!user) return;
    axiosInstance
      .get("/my-courses")
      .then((res) => setCourses(res.data.courses))
      .catch(console.error);
  }, [user]);

  if (loading) return <LoadingSpinner className="h-screen" />;
  if (!user) return <p>Pristup dozvoljen samo prijavljenim korisnicima.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Moji kursevi</h2>
      {courses.length === 0 ? (
        <p>Nema kupljenih kurseva.</p>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <Link
              to={`/course/${course.slug || course.id}`}
              key={course.id}
              className="flex items-start gap-4 border border-gray-300 rounded-lg p-4 bg-white hover:shadow-md transition"
            >
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-40 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {course.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

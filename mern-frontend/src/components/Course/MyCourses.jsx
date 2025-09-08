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
  if (!user) return <p className="text-text">Pristup dozvoljen samo prijavljenim korisnicima.</p>;

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold text-text">Moji kursevi</h2>

      {courses.length === 0 ? (
        <p className="text-muted">Nema kupljenih kurseva.</p>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <Link
              to={`/course/${course.slug || course.id}`}
              key={course.id}
              className="flex items-start gap-4 rounded-lg border border-borderSoft bg-surface p-4 transition hover:shadow-lg"
            >
              <img
                src={course.imageUrl}
                alt={course.title}
                className="h-24 w-40 rounded object-cover"
              />
              <div className="flex-1">
                <h3 className="mb-1 text-lg font-semibold text-text">{course.title}</h3>
                <p className="line-clamp-3 text-sm text-muted">{course.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

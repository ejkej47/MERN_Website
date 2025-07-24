import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";
import { useAuth } from "../../context/AuthContext";

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

  if (loading) return <p>Učitavanje...</p>;
  if (!user) return <p>Pristup dozvoljen samo prijavljenim korisnicima.</p>;

  return (
    <div>
      <h2>Moji kursevi</h2>
      {courses.length === 0 ? (
        <p>Nema kupljenih kurseva.</p>
      ) : (
        courses.map((course) => (
          <div key={course._id} style={{ border: "1px solid #aaa", padding: "1rem", marginBottom: "1rem" }}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

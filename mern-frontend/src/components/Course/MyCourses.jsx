// src/components/MyCourses.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axiosInstance.get("/my-courses")
      .then(res => setCourses(res.data.courses))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Moji kursevi</h2>
      {courses.length === 0 ? (
        <p>Nema kupljenih kurseva.</p>
      ) : (
        courses.map(course => (
          <div key={course._id} style={{ border: "1px solid #aaa", padding: "1rem", marginBottom: "1rem" }}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

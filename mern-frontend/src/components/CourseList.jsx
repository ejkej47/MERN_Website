import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/courses")
      .then(res => setCourses(res.data))
      .catch(console.error);
  }, []);

  const handleBuy = async (courseId) => {
    try {
      await axiosInstance.post(`/buy-course/${courseId}`);
      alert("Kurs je dodat u tvoje kurseve!");
    } catch (err) {
      alert("Greška: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <h2>Svi kursevi</h2>
      {courses.map(course => (
        <div key={course._id} style={{ border: "1px solid #ccc", padding: "1rem", margin: "1rem 0" }}>
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <p><strong>{course.price === 0 ? "Besplatan kurs" : `Cena: €${course.price}`}</strong></p>
          {isLoggedIn && (
            <button onClick={() => handleBuy(course._id)}>
              {course.price === 0 ? "Dodaj" : "Kupi"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

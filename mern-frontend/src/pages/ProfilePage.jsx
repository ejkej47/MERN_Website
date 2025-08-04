import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import ChangeEmailForm from "../components/ChangeEmailForm";
import ChangePasswordForm from "../components/ChangePasswordForm";
import ForgotPassword from "../components/ForgotPassword";

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [activeSection, setActiveSection] = useState("courses");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    axiosInstance
      .get("/my-courses")
      .then((res) => setCourses(res.data.courses))
      .catch((err) => console.error("Greška pri dohvatu kurseva:", err));
  }, [user]);

  const renderRightSection = () => {
    switch (activeSection) {
      case "courses":
        return (
          <div className="p-0">
            {courses.length === 0 ? (
              <p>Nema kupljenih kurseva.</p>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => navigate(`/course/${course.slug || course.id}`)}
                    className="cursor-pointer flex items-start gap-4 border border-gray-300 rounded-lg p-4 bg-white hover:shadow-md transition"
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
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "change-email":
        return <ChangeEmailForm />;
      case "change-password":
        return <ChangePasswordForm />;
      case "forgot-password":
        return <ForgotPassword />;
      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Leva kolona */}
      <div className="bg-white rounded shadow-sm overflow-hidden self-start">
        {/* Korisnički podaci */}
        <div className="px-4 py-3 border-b border-gray-200">
          <p className="text-sm text-gray-500">Prijavljeni korisnik</p>
          <p className="font-semibold text-dark break-words">{user.email}</p>
        </div>

        {/* Meni dugmad */}
        <div className="flex flex-col">
          <button
            className={`w-full text-left px-4 py-3 text-sm border-t ${
              activeSection === "courses"
                ? "bg-primary text-white font-semibold"
                : "hover:bg-gray-100 text-dark"
            }`}
            onClick={() => setActiveSection("courses")}
          >
            Kupljeni Kursevi
          </button>
          <button
            className={`w-full text-left px-4 py-3 text-sm border-t ${
              activeSection === "change-email"
                ? "bg-primary text-white font-semibold"
                : "hover:bg-gray-100 text-dark"
            }`}
            onClick={() => setActiveSection("change-email")}
          >
            Promeni Email
          </button>
          <button
            className={`w-full text-left px-4 py-3 text-sm border-t ${
              activeSection === "change-password"
                ? "bg-primary text-white font-semibold"
                : "hover:bg-gray-100 text-dark"
            }`}
            onClick={() => setActiveSection("change-password")}
          >
            Promeni Lozinku
          </button>
          <button
            className={`w-full text-left px-4 py-3 text-sm border-t ${
              activeSection === "forgot-password"
                ? "bg-primary text-white font-semibold"
                : "hover:bg-gray-100 text-dark"
            }`}
            onClick={() => setActiveSection("forgot-password")}
          >
            Zaboravljena Lozinka
          </button>
        </div>
      </div>

      {/* Desna kolona */}
      <div className="md:col-span-3 space-y-4">{renderRightSection()}</div>
    </div>
  );
}

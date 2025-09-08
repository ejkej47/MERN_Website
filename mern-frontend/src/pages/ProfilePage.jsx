import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import ChangeEmailForm from "../components/Forms/ChangeEmailForm";
import ChangePasswordForm from "../components/Forms/ChangePasswordForm";
import ForgotPassword from "../components/Forms/ForgotPassword";

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
              <p className="text-muted">Nema kupljenih kurseva.</p>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => navigate(`/course/${course.slug || course.id}`)}
                    className="flex cursor-pointer items-start gap-4 rounded-lg border border-borderSoft bg-surface p-4 transition hover:shadow-md"
                  >
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="h-24 w-40 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="mb-1 text-lg font-semibold text-text">
                        {course.title}
                      </h3>
                      <p className="line-clamp-3 text-sm text-muted">
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
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 md:grid-cols-4">
      {/* Leva kolona */}
      <div className="self-start overflow-hidden rounded border border-borderSoft bg-surface shadow-sm">
        {/* Korisnički podaci */}
        <div className="border-b border-borderSoft px-4 py-3">
          <p className="text-sm text-muted">Prijavljeni korisnik</p>
          <p className="break-words font-semibold text-text">{user.email}</p>
        </div>

        {/* Meni dugmad */}
        <div className="flex flex-col">
          <button
            className={`w-full border-t px-4 py-3 text-left text-sm ${
              activeSection === "courses"
                ? "bg-primary font-semibold text-white"
                : "text-text hover:bg-background"
            }`}
            onClick={() => setActiveSection("courses")}
          >
            Kupljeni Kursevi
          </button>
          <button
            className={`w-full border-t px-4 py-3 text-left text-sm ${
              activeSection === "change-email"
                ? "bg-primary font-semibold text-white"
                : "text-text hover:bg-background"
            }`}
            onClick={() => setActiveSection("change-email")}
          >
            Promeni Email
          </button>
          <button
            className={`w-full border-t px-4 py-3 text-left text-sm ${
              activeSection === "change-password"
                ? "bg-primary font-semibold text-white"
                : "text-text hover:bg-background"
            }`}
            onClick={() => setActiveSection("change-password")}
          >
            Promeni Lozinku
          </button>
          <button
            className={`w-full border-t px-4 py-3 text-left text-sm ${
              activeSection === "forgot-password"
                ? "bg-primary font-semibold text-white"
                : "text-text hover:bg-background"
            }`}
            onClick={() => setActiveSection("forgot-password")}
          >
            Zaboravljena Lozinka
          </button>
        </div>
      </div>

      {/* Desna kolona */}
      <div className="space-y-4 md:col-span-3">{renderRightSection()}</div>
    </div>
  );
}

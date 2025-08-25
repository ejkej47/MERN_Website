import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

import CourseInfo from "./CourseInfo";
import LessonList from "./LessonList";
import LessonContent from "./LessonContent";
import LessonDropdown from "./LessonDropdown";

function CourseDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [modules, setModules] = useState([]);
  const [courseLessons, setCourseLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonsLoading, setLessonsLoading] = useState(true);

  // 🔁 Fetch course by slug
  useEffect(() => {
    axiosInstance
      .get(`/courses/slug/${slug}`)
      .then((res) => setCourse(res.data))
      .catch((err) => console.error("Greška pri dohvaćanju kursa:", err));
  }, [slug]);

  // 🔁 Fetch lessons after course is loaded
  useEffect(() => {
    if (!course) return;

    const endpoint = `/courses/${course.id}/full-content`;

    setLessonsLoading(true);

    axiosInstance
      .get(endpoint)
      .then((res) => {
      const introLessons = res.data.courseLessons || [];
      const modules = res.data.modules || [];

      setCourseLessons(introLessons);
      setModules(modules);

      const allLessons = [
        ...introLessons,
        ...modules.flatMap(mod => mod.lessons || []),
      ];

      setLessons(allLessons);

      const lastLessonId = localStorage.getItem(`lastLesson-${course.id}`);
      if (lastLessonId) {
        const found = allLessons.find((l) => String(l.id) === lastLessonId);
        if (found && !found.isLocked) {
          setSelectedLesson(found);
        }
      }

      setModules(modules); // ako koristiš module posebno za prikaz
    })
      .catch((err) => {
        console.error("Greška pri dohvaćanju lekcija:", err);
        setLessons([]);
      })
      .finally(() => setLessonsLoading(false));
  }, [course, user]);

  const handlePurchase = async () => {
    if (!user) {
      toast.error("Morate biti prijavljeni da biste kupili kurs.");
      return navigate("/login", { state: { from: `/courses/${course.slug}` } });
    }

    try {
      const res = await axiosInstance.post(`/purchase/${course.id}`);
      toast.success(res.data.message || "Kupovina uspešna!");

      // 🔄 Refetch lessons
      const lessonsRes = await axiosInstance.get(`/courses/${course.id}/lessons`);
      setLessons(lessonsRes.data.lessons);
      setSelectedLesson(null);

      // 🔄 Refetch course (da bi `isPurchased` bio ažuriran)
      const courseRes = await axiosInstance.get(`/courses/slug/${slug}`);
      setCourse(courseRes.data);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Došlo je do greške prilikom kupovine.";
      console.error("❌ Greška pri kupovini:", message);
      toast.error(message);
    }
  };

  if (!course) return <p className="p-4 text-gray-600">Učitavanje kursa...</p>;

  const isPurchased = course?.isPurchased;

  return (
    <div className="grid md:grid-cols-3 gap-6 p-4">
      {/* Sidebar: info + lista lekcija */}
      <div className="hidden md:flex md:flex-col md:col-span-1 space-y-6">
        <CourseInfo
          course={course}
          isPurchased={isPurchased}
          handlePurchase={handlePurchase}
        />

        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Lekcije</h3>
          <LessonList
            courseLessons={courseLessons}
            modules={modules}
            selectedLesson={selectedLesson}
            setSelectedLesson={setSelectedLesson}
            course={course}
            loading={lessonsLoading}
          />
        </div>
      </div>

      {/* Glavni sadržaj: prikaz lekcije */}
      <div className="hidden md:block md:col-span-2 bg-white p-4 rounded shadow-sm">
        <LessonContent selectedLesson={selectedLesson} />
      </div>

      {/* Mobilni prikaz */}
      <div className="md:hidden flex flex-col space-y-6 mt-4">
        {!lessonsLoading && (
          <LessonDropdown
            lessons={lessons}
            selectedLesson={selectedLesson}
            setSelectedLesson={setSelectedLesson}
            course={course}
          />
        )}
        <LessonContent selectedLesson={selectedLesson} />
        <CourseInfo
          course={course}
          isPurchased={isPurchased}
          handlePurchase={handlePurchase}
        />
      </div>
    </div>
  );
}

export default CourseDetail;

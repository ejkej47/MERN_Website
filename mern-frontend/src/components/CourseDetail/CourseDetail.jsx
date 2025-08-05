import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import CourseInfo from "./CourseInfo";
import LessonList from "./LessonList";
import LessonContent from "./LessonContent";
import LessonDropdown from "./LessonDropdown";
import { useNavigate } from "react-router-dom";

function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    axiosInstance
      .get(`/courses/slug/${slug}`)
      .then((res) => setCourse(res.data))
      .catch((err) => console.error("Greška pri dohvatu kursa:", err));
  }, [slug]);

  useEffect(() => {
    if (!course) return;

    const endpoint = user
      ? `/courses/${course.id}/lessons`
      : `/courses/${course.id}/public-lessons`;

    setLessonsLoading(true);

    axiosInstance
      .get(endpoint)
      .then((res) => {
        const lessons = res.data.lessons;
        setLessons(lessons);

        const lastLessonId = localStorage.getItem(`lastLesson-${course.id}`);
        if (lastLessonId) {
          const found = lessons.find((l) => String(l.id) === lastLessonId);
          if (found && !found.isLocked) setSelectedLesson(found);
        }
      })
      .catch((err) => {
        console.error("Greška pri dohvatu lekcija:", err);
        setLessons([]);
      })
      .finally(() => setLessonsLoading(false));
  }, [course, user]);

  const handlePurchase = async () => {
     if (!user) {
      toast.error("Morate biti prijavljeni da biste kupili kurs.");
      return navigate("/login", {
        state: { from: `/courses/${course.slug}` }
      });
    }

    try {
      const res = await axiosInstance.post(`/purchase/${course.id}`);
      toast.success(res.data.message || "Kupovina uspešna!");

      const lessonsRes = await axiosInstance.get(`/courses/${course.id}/lessons`);
      setLessons(lessonsRes.data.lessons);
      setSelectedLesson(null);

      // 🆕 refetch course (da dobijemo novi isPurchased = true)
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

  if (!course) return <p>Učitavanje kursa...</p>;

  const isPurchased = course?.isPurchased; 

  return (
    <div className="grid md:grid-cols-3 gap-6 p-4">
      {/* Desktop prikaz */}
      <div className="hidden md:flex md:flex-col md:col-span-1 space-y-6">
        <CourseInfo
          course={course}
          isPurchased={isPurchased}
          handlePurchase={handlePurchase}
        />
        <div className="bg-white p-4 rounded shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Lekcije</h3>
          <LessonList
            lessons={lessons}
            selectedLesson={selectedLesson}
            setSelectedLesson={setSelectedLesson}
            course={course}
            loading={lessonsLoading}
          />
        </div>
      </div>

      {/* Glavni sadržaj */}
      <div className="hidden md:block md:col-span-2 order-2 md:order-none bg-white p-4 rounded shadow-sm">
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

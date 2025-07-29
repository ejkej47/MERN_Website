import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../axiosInstance";
import { useAuth } from "../../context/AuthContext";
import Cookies from "js-cookie";

function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  // Dohvatanje kursa po slug-u
  useEffect(() => {
    axiosInstance
      .get(`/courses/slug/${slug}`)
      .then((res) => setCourse(res.data))
      .catch((err) => console.error("Error fetching course:", err));
  }, [slug]);

  // Dohvatanje lekcija (autorizovano ili javno)
  useEffect(() => {
    if (!course) return;

    const endpoint = user
      ? `/courses/${course.id}/lessons`
      : `/courses/${course.id}/public-lessons`;

    axiosInstance
      .get(endpoint)
      .then((res) => setLessons(res.data.lessons))
      .catch((err) => {
        console.error("Greška pri dohvatu lekcija:", err);
        setLessons([]); // fallback
      });
  }, [course, user]);

  // Kupovina kursa
const handlePurchase = async () => {
  try {
    // 🔁 Zatraži novi CSRF token ako nije već postavljen
    if (!Cookies.get("_csrf")) {
      await axiosInstance.get("/csrf-token"); // traži novi token ako nije već tu
    }

    const csrfToken = Cookies.get("_csrf"); // uzmi token iz cookie-ja

    const res = await axiosInstance.post(
      `/purchase/${course.id}`,
      {},
      {
        headers: {
          "X-CSRF-Token": csrfToken, // ručno ga dodaj u header
        },
      }
    );

    setMessage(res.data.message);

    // 🔁 3. Ponovno učitavanje lekcija
    const updated = await axiosInstance.get(`/courses/${course.id}/lessons`);
    setLessons(updated.data.lessons);
    setSelectedLesson(null); // očisti prethodno selektovanu
  } catch (err) {
    console.error("❌ Greška pri kupovini:", err);
    setMessage("Došlo je do greške prilikom kupovine.");
  }
};




  if (!course) return <p>Učitavanje kursa...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">{course.title}</h2>
      <p className="text-gray-700">{course.description}</p>
      <p className="mt-2 font-semibold">Price: ${course.price}</p>
      <img
        src={course.imageUrl}
        alt={course.title}
        className="w-[560px] h-[315px] object-cover rounded-lg mt-4"
      />

      <button
        onClick={handlePurchase}
        className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition"
      >
        Kupi kurs
      </button>
      {message && <p className="mt-2 text-sm text-red-600">{message}</p>}

      {/* Lista lekcija */}
      <h3 className="mt-6 text-lg font-semibold">Lekcije</h3>
      <ul className="mt-2 space-y-2">
        {lessons.map((lesson) => (
          <li
            key={lesson.id}
            className={`p-2 border rounded flex justify-between items-center ${
              lesson.isLocked
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100 cursor-pointer"
            }`}
            onClick={() => {
              if (!lesson.isLocked) setSelectedLesson(lesson);
            }}
          >
            <span>{lesson.title}</span>
            <span>{lesson.isLocked && "🔒" }</span>
          </li>
        ))}
      </ul>

      {/* Prikaz selektovane lekcije */}
      {selectedLesson && !selectedLesson.isLocked && (
        <div className="mt-6 p-4 border rounded bg-white shadow-sm">
          <h4 className="text-xl font-semibold mb-2">{selectedLesson.title}</h4>
          <div
            dangerouslySetInnerHTML={{
              __html: selectedLesson.content,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default CourseDetail;

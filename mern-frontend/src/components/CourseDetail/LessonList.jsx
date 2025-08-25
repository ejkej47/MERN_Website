import { Link } from "react-router-dom";
import SkeletonBox from "../QoL/SkeletonBox";

function LessonList({ courseLessons, modules, selectedLesson, setSelectedLesson, course, loading }) {
  const handleLessonClick = (lesson) => {
    if (!lesson.isLocked) {
      setSelectedLesson(lesson);
      localStorage.setItem(`lastLesson-${course.id}`, lesson.id);
    }
  };

  if (loading) {
    return (
      <ul className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="p-2 border rounded">
            <SkeletonBox className="w-3/4 h-4 mb-1" />
            <SkeletonBox className="w-1/2 h-4" />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-6">
      {/* 📘 Uvodne lekcije */}
      {courseLessons.length > 0 && (
        <div>
          <h4 className="text-md font-semibold mb-2">Uvodne lekcije</h4>
          <ul className="space-y-2">
            {courseLessons.map((lesson) => (
              <li
                key={lesson.id}
                className={`p-2 border rounded flex justify-between items-center
                  ${lesson.isLocked ? "opacity-50 cursor-not-allowed"
                    : selectedLesson?.id === lesson.id
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100 cursor-pointer"}`}
                onClick={() => handleLessonClick(lesson)}
              >
                <span>{lesson.title}</span>
                <span>{lesson.isLocked && "🔒"}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 📦 Moduli kao linkovi */}
      {modules.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-md font-semibold mb-1">Moduli</h4>

          <ul className="space-y-2">
            {modules.map((mod) => (
              <li key={mod.id}>
                <Link
                  to={`/modules/${mod.id}`}
                  className="block p-2 border rounded bg-gray-100 hover:bg-gray-200 font-medium text-sm"
                >
                  {mod.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LessonList;

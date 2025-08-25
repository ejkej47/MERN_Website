import SkeletonBox from "../QoL/SkeletonBox";

function ModuleLessonList({ lessons, selectedLesson, setSelectedLesson, moduleId, loading }) {
  const handleClick = (lesson) => {
    if (!lesson.isLocked) {
      setSelectedLesson(lesson);
      localStorage.setItem(`lastLesson-module-${moduleId}`, lesson.id);
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
    <ul className="space-y-2">
      {lessons.map((lesson) => (
        <li
          key={lesson.id}
          className={`p-2 border rounded flex justify-between items-center
            ${lesson.isLocked ? "opacity-50 cursor-not-allowed"
              : selectedLesson?.id === lesson.id
                ? "bg-primary text-white"
                : "hover:bg-gray-100 cursor-pointer"}`}
          onClick={() => handleClick(lesson)}
        >
          <span>{lesson.title}</span>
          <span>{lesson.isLocked && "🔒"}</span>
        </li>
      ))}
    </ul>
  );
}

export default ModuleLessonList;

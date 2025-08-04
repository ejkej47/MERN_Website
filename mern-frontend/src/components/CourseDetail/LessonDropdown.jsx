function LessonDropdown({ lessons, selectedLesson, setSelectedLesson, course }) {
  return (
    <select
      className="border rounded p-2"
      value={selectedLesson?.id || ""}
      onChange={(e) => {
        const selectedId = e.target.value;
        const found = lessons.find((l) => String(l.id) === selectedId);
        if (found && !found.isLocked) {
          setSelectedLesson(found);
          localStorage.setItem(`lastLesson-${course.id}`, found.id);
        }
      }}
    >
      <option disabled value="">
        Odaberi lekciju
      </option>
      {lessons.map((lesson) => (
        <option
          key={lesson.id}
          value={lesson.id}
          disabled={lesson.isLocked}
        >
          {lesson.title} {lesson.isLocked ? "🔒" : ""}
        </option>
      ))}
    </select>
  );
}

export default LessonDropdown;

import { useEffect, useState } from "react";
const lessonModules = import.meta.glob("/src/components/lessons/**/*.jsx");

function LessonContent({ selectedLesson }) {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    if (!selectedLesson || selectedLesson.isLocked) return;

    setComponent(null);

    const modulePath = `/src/components/lessons/${selectedLesson.path}`;
    const loadLesson = lessonModules[modulePath];

    if (loadLesson) {
      loadLesson()
        .then((mod) => setComponent(() => mod.default))
        .catch((err) => {
          console.error("❌ Greška pri učitavanju JSX lekcije:", err);
          setComponent(() => () => (
            <p className="text-red-500">Greška pri učitavanju lekcije.</p>
          ));
        });
    } else {
      console.error("❌ Lekcija nije pronađena:", modulePath);
      setComponent(() => () => (
        <p className="text-red-500">Lekcija nije pronađena.</p>
      ));
    }
  }, [selectedLesson]);


  if (!selectedLesson || selectedLesson.isLocked) {
    return <p className="text-gray-500 italic">Odaberi lekciju da se prikaže njen sadržaj.</p>;
  }

  return (
    <div>
      <h4 className="text-2xl font-bold mb-4">{selectedLesson.title}</h4>
      {Component ? <Component /> : <p>Učitavanje lekcije...</p>}
    </div>
  );
}

export default LessonContent;
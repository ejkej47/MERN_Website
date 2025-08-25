import { useEffect, useState } from "react";

function LessonContent({ selectedLesson }) {
  const [Component, setComponent] = useState(null);

  useEffect(() => {
    if (!selectedLesson || selectedLesson.isLocked) return;

    // Očisti prethodno učitan komponentu
    setComponent(null);

    import(`../lessons/${selectedLesson.path}`)
      .then((mod) => setComponent(() => mod.default))
      .catch((err) => {
        console.error("❌ Greška pri učitavanju JSX lekcije:", err);
        setComponent(() => () => (
          <p className="text-red-500">Greška pri učitavanju lekcije.</p>
        ));
      });
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

function LessonContent({ selectedLesson }) {
  if (!selectedLesson || selectedLesson.isLocked) {
    return <p className="text-gray-500 italic">Odaberi lekciju da se prikaže njen sadržaj.</p>;
  }

  return (
    <>
      <h4 className="text-2xl font-bold mb-2">{selectedLesson.title}</h4>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: selectedLesson.content }}
      />
    </>
  );
}

export default LessonContent;

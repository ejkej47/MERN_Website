function LessonContent({ selectedLesson }) {
  if (!selectedLesson || selectedLesson.isLocked) {
    return <p className="text-gray-500 italic">Odaberi lekciju da se prikaže njen sadržaj.</p>;
  }

  return (
    <>
      <h4 className="text-2xl font-bold mb-4">{selectedLesson.title}</h4>

      {selectedLesson.type === 'video' ? (
        <video
          className="w-full max-w-3xl rounded-lg shadow"
          controls
          preload = "metadata"
          src={selectedLesson.video_url}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: selectedLesson.content }}
        />
      )}
    </>
  );
}

export default LessonContent;
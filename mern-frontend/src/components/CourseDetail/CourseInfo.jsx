function CourseInfo({ course, isPurchased, handlePurchase }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h2 className="text-xl font-bold">{course.title}</h2>
      <p className="text-gray-700 mt-1">{course.description}</p>
      <img
        src={course.imageUrl}
        alt={course.title}
        className="w-full h-[200px] object-cover rounded-lg mt-4"
      />

      {isPurchased ? (
        <span className="text-green-600 font-semibold inline-block mt-3">
          ✔ Kurs kupljen
        </span>
      ) : (
        <>
          <p className="mt-3 font-semibold">Cena: ${course.price}</p>
          <button
            onClick={handlePurchase}
            className="mt-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition"
          >
            Kupi kurs
          </button>
        </>
      )}
    </div>
  );
}

export default CourseInfo;

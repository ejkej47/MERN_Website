export default function CourseHero({ course, isPurchased, onPurchase }) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="grid lg:grid-cols-2 gap-6 p-6">
        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
          {course?.imageUrl ? (
            <img src={course.imageUrl} alt={course?.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-gray-400">No image</div>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-gray-900">
              {course?.title || "Kurs"}
            </h1>
            {course?.subtitle && (
              <p className="mt-2 text-gray-600 text-base md:text-lg">{course.subtitle}</p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100">⭐ 4.8 / 5</span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100">👥 1.2k+ polaznika</span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100">🔒 Doživotan pristup</span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100">💸 Garancija 7 dana</span>
            </div>

            {Array.isArray(course?.bullets) && course.bullets.length > 0 && (
              <ul className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-3">
                {course.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            {isPurchased ? (
              <span className="text-emerald-600 font-semibold">✔ Već kupljen</span>
            ) : (
              <>
                <button
                  onClick={onPurchase}
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:shadow-md hover:bg-indigo-700 transition"
                >
                  Kupi kurs
                </button>
                {typeof course?.price === "number" && (
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-900">${course.price}</div>
                    <div className="text-xs text-gray-500">Jednokratno • Bez skrivenih troškova</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

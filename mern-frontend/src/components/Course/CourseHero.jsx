export default function CourseHero({ course, isPurchased, onPurchase }) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-surface border border-white/10">
      <div className="grid lg:grid-cols-2 gap-6 p-6">
        <div className="relative aspect-video rounded-xl overflow-hidden bg-black/30">
          {course?.imageUrl ? (
            <img
              src={course.imageUrl}
              alt={course?.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-slate-500">
              Bez slike
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
              {course?.title || "Kurs"}
            </h1>
            {course?.subtitle && (
              <p className="mt-2 text-slate-300 text-base md:text-lg">
                {course.subtitle}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/5">
                ⭐ 4.8 / 5
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/5">
                👥 1.2k+ polaznika
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/5">
                🔒 Doživotan pristup
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/5">
                💸 Garancija 7 dana
              </span>
            </div>

            {Array.isArray(course?.bullets) && course.bullets.length > 0 && (
              <ul className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-3">
                {course.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-400" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            {isPurchased ? (
              <span className="text-emerald-400 font-semibold">
                ✔ Već kupljen
              </span>
            ) : (
              <>
                <button
                  onClick={onPurchase}
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl 
                             bg-primary text-white font-semibold shadow 
                             hover:bg-primary-hover transition"
                >
                  Kupi kurs
                </button>
                {typeof course?.price === "number" && (
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">
                      ${course.price}
                    </div>
                    <div className="text-xs text-slate-400">
                      Jednokratno • Bez skrivenih troškova
                    </div>
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

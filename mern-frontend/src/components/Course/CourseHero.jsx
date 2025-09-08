export default function CourseHero({ course, isPurchased, onPurchase }) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-surface border border-borderSoft">
      <div className="grid gap-6 p-6 lg:grid-cols-2">
        {/* Slika */}
        <div className="relative aspect-video overflow-hidden rounded-xl bg-background">
          {course?.imageUrl ? (
            <img src={course.imageUrl} alt={course?.title} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-muted">Bez slike</div>
          )}
        </div>

        {/* Tekst / CTA */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-text">
              {course?.title || "Kurs"}
            </h1>

            {course?.subtitle && (
              <p className="mt-2 text-base md:text-lg text-muted">{course.subtitle}</p>
            )}

            {/* Badge-evi */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              {/* Ocena */}
              <span className="inline-flex items-center gap-1 rounded-full border border-borderSoft bg-surface px-2 py-1">
                <span role="img" aria-label="zvezda">⭐</span>
                <span className="text-text font-medium">4.8</span>
                <span className="text-muted">/ 5</span>
              </span>

              {/* Polaznici */}
              <span className="inline-flex items-center gap-1 rounded-full border border-borderSoft bg-surface px-2 py-1">
                <span role="img" aria-label="polaznici">👥</span>
                <span className="text-text font-medium">1.2k+</span>
                <span className="text-muted">polaznika</span>
              </span>

              {/* Doživotan pristup */}
              <span className="inline-flex items-center gap-1 rounded-full border border-borderSoft bg-surface px-2 py-1">
                <span role="img" aria-label="katanac">🔒</span>
                <span className="text-muted">Doživotan pristup</span>
              </span>

              {/* Garancija */}
              <span className="inline-flex items-center gap-1 rounded-full border border-borderSoft bg-surface px-2 py-1">
                <span role="img" aria-label="novac">💸</span>
                <span className="text-muted">Garancija</span>
                <span className="text-text font-medium">7</span>
                <span className="text-muted">dana</span>
              </span>
            </div>

            {/* Bulleti */}
            {Array.isArray(course?.bullets) && course.bullets.length > 0 && (
              <ul className="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                {course.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-text">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-accent" />
                    <span className="text-text/85">{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* CTA / Cena */}
          <div className="mt-6 flex items-center gap-3">
            {isPurchased ? (
              <span className="font-semibold text-accent">✔ Već kupljen</span>
            ) : (
              <>
                <button
                  onClick={onPurchase}
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-white shadow hover:bg-primary-hover transition"
                >
                  Kupi kurs
                </button>

                {typeof course?.price === "number" && (
                  <div className="text-left">
                    <div className="text-2xl font-bold text-text">${course.price}</div>
                    <div className="text-xs text-muted">Jednokratno • Bez skrivenih troškova</div>
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

export default function StatsBar({ lessonsCount, modulesCount, duration }) {
  return (
    <div className="mt-4 grid sm:grid-cols-3 gap-3">
      <div className="rounded-xl border bg-white p-4 text-center">
        <div className="text-2xl font-bold">{modulesCount ?? 0}</div>
        <div className="text-gray-600 text-sm">modula</div>
      </div>
      <div className="rounded-xl border bg-white p-4 text-center">
        <div className="text-2xl font-bold">{lessonsCount ?? 0}</div>
        <div className="text-gray-600 text-sm">lekcija</div>
      </div>
      <div className="rounded-xl border bg-white p-4 text-center">
        <div className="text-2xl font-bold">30h</div>
        <div className="text-gray-600 text-sm">materijala</div>
      </div>
    </div>
  );
}

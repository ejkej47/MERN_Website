export default function StatsBar({ lessonsCount, modulesCount, duration }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-xl bg-surface border border-borderSoft p-4 text-center">
        <div className="text-2xl font-bold text-text">{lessonsCount || 0}</div>
        <div className="text-sm text-muted">Lekcija</div>
      </div>
      <div className="rounded-xl bg-surface border border-borderSoft p-4 text-center">
        <div className="text-2xl font-bold text-text">{modulesCount || 0}</div>
        <div className="text-sm text-muted">Modula</div>
      </div>
      <div className="rounded-xl bg-surface border border-borderSoft p-4 text-center">
        <div className="text-2xl font-bold text-text">{duration || 0}h</div>
        <div className="text-sm text-muted">Trajanje</div>
      </div>
    </section>
  );
}

export default function StatsBar({ lessonsCount, modulesCount, duration }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="rounded-xl bg-surface border border-white/10 p-4 text-center">
        <div className="text-2xl font-bold text-white">{lessonsCount || 0}</div>
        <div className="text-sm text-slate-400">Lekcija</div>
      </div>
      <div className="rounded-xl bg-surface border border-white/10 p-4 text-center">
        <div className="text-2xl font-bold text-white">{modulesCount || 0}</div>
        <div className="text-sm text-slate-400">Modula</div>
      </div>
      <div className="rounded-xl bg-surface border border-white/10 p-4 text-center">
        <div className="text-2xl font-bold text-white">
          {duration || 0}h
        </div>
        <div className="text-sm text-slate-400">Trajanje</div>
      </div>
    </section>
  );
}

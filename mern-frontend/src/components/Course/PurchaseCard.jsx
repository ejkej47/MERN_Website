export default function PurchaseCard({ course, isPurchased, onPurchase }) {
  return (
    <aside className="sticky top-6 rounded-2xl border border-white/10 bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Pristup kursu</h3>
        {!isPurchased && typeof course?.price === "number" && (
          <div className="text-xl font-bold text-white">${course.price}</div>
        )}
      </div>

      {isPurchased ? (
        <p className="mt-2 text-emerald-400 font-medium">
          ✔ Kurs je otključan
        </p>
      ) : (
        <button
          onClick={onPurchase}
          className="mt-4 w-full px-4 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition"
        >
          Kupi sada
        </button>
      )}

      <ul className="mt-4 space-y-2 text-sm text-slate-300">
        <li>✅ Doživotan pristup</li>
        <li>✅ Ažuriranja uključena</li>
        <li>✅ 7 dana garancije povraćaja</li>
      </ul>

      {!isPurchased && (
        <div className="mt-4 rounded-lg bg-white/5 border border-white/10 p-3 text-xs text-slate-300">
          👉 Pojedinačne module možeš kupiti u nastavku, ali{" "}
          <b className="text-white">kompletan kurs je povoljniji</b>.
        </div>
      )}
    </aside>
  );
}

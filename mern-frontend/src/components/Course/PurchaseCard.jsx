export default function PurchaseCard({ course, isPurchased, onPurchase }) {
  return (
    <aside className="sticky top-6 rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Pristup kursu</h3>
        {!isPurchased && typeof course?.price === "number" && (
          <div className="text-xl font-bold">${course.price}</div>
        )}
      </div>

      {isPurchased ? (
        <p className="mt-2 text-emerald-600 font-medium">✔ Kurs je otključan</p>
      ) : (
        <button
          onClick={onPurchase}
          className="mt-4 w-full px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
        >
          Kupi sada
        </button>
      )}

      <ul className="mt-4 space-y-2 text-sm text-gray-600">
        <li>✅ Doživotan pristup</li>
        <li>✅ Ažuriranja uključena</li>
        <li>✅ 7 dana garancije povraćaja</li>
      </ul>

      {!isPurchased && (
        <div className="mt-4 rounded-lg bg-indigo-50 border border-indigo-100 p-3 text-xs text-indigo-700">
          👉 Pojedinačne module možeš kupiti u nastavku, ali <b>kompletan kurs je povoljniji</b>.
        </div>
      )}
    </aside>
  );
}

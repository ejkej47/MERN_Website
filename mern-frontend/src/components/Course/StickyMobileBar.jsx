export default function StickyMobileBar({ isPurchased, price, onPurchase }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-3 lg:hidden">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {isPurchased ? (
          <span className="text-emerald-700 font-medium">✔ Kurs kupljen</span>
        ) : (
          <>
            {typeof price === "number" && (
              <div className="text-lg font-bold">${price}</div>
            )}
            <button
              onClick={onPurchase}
              className="ml-auto inline-flex items-center justify-center px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700"
            >
              Kupi
            </button>
          </>
        )}
      </div>
    </div>
  );
}

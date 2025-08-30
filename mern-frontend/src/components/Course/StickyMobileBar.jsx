export default function StickyMobileBar({ isPurchased, price, onPurchase }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 
                    border-t border-white/10 
                    bg-surface/80 backdrop-blur-md 
                    supports-[backdrop-filter]:bg-surface/60 
                    p-3 lg:hidden">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {isPurchased ? (
          <span className="text-emerald-400 font-medium">✔ Kurs kupljen</span>
        ) : (
          <>
            {typeof price === "number" && (
              <div className="text-lg font-bold text-white">${price}</div>
            )}
            <button
              onClick={onPurchase}
              className="ml-auto inline-flex items-center justify-center 
                         px-4 py-2 rounded-lg 
                         bg-primary text-white font-semibold 
                         shadow hover:bg-primary-hover transition"
            >
              Kupi
            </button>
          </>
        )}
      </div>
    </div>
  );
}

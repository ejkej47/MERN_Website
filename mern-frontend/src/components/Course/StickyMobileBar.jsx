export default function StickyMobileBar({ isPurchased, price, onPurchase }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-borderSoft bg-surface p-3 shadow-[0_-6px_24px_rgba(0,0,0,0.06)] lg:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        {isPurchased ? (
          <span className="font-medium text-accent">✔ Kurs kupljen</span>
        ) : (
          <>
            {typeof price === "number" && (
              <div className="text-lg font-bold text-text">${price}</div>
            )}
            <button
              onClick={onPurchase}
              className="ml-auto inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-white shadow hover:bg-primary-hover transition"
            >
              Kupi
            </button>
          </>
        )}
      </div>
    </div>
  );
}

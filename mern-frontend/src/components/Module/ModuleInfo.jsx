import React from "react";

function ModuleInfo({ module, handlePurchase }) {
  const { title, description, price, isAccessible } = module || {};

  const isFree = typeof price === "number" ? price === 0 : false;
  const formatPrice = (value) => {
    if (typeof value !== "number") return "—";
    try {
      return new Intl.NumberFormat("sr-RS", {
        style: "currency",
        currency: "RSD",
        maximumFractionDigits: 0,
      }).format(value);
    } catch {
      return `${value} RSD`;
    }
  };

  return (
    <div className="rounded-2xl border border-borderSoft bg-surface p-5 shadow-sm space-y-4">
      <h2 className="text-xl font-bold text-text">{title}</h2>

      {description && <p className="text-text/85 leading-relaxed">{description}</p>}

      <div className="text-sm">
        <span className="text-muted">Cena: </span>
        <span className="font-medium text-text">
          {isFree ? "Besplatno" : formatPrice(price)}
        </span>
      </div>

      {!isAccessible ? (
        <button
          onClick={handlePurchase}
          className="rounded-xl bg-primary px-4 py-2 font-semibold text-white transition hover:bg-primary-hover"
        >
          {isFree ? "Započni modul" : "Kupi modul"}
        </button>
      ) : (
        <div className="rounded-lg border border-borderSoft bg-background px-3 py-2 text-sm font-semibold text-accent">
          ✅ Već imaš pristup ovom modulu
        </div>
      )}
    </div>
  );
}

export default ModuleInfo;

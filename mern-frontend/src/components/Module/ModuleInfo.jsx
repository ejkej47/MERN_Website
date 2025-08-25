import React from "react";

function ModuleInfo({ module, handlePurchase }) {
  const { title, description, price, isAccessible } = module;

  return (
    <div className="bg-white p-4 rounded shadow-sm space-y-4">
      <h2 className="text-xl font-bold">{title}</h2>

      {description && <p className="text-gray-700">{description}</p>}

      <div className="text-sm text-gray-600">
        Cena: {price === 0 ? "Besplatan modul" : `${price} RSD`}
      </div>

      {!isAccessible && (
        <button
          onClick={handlePurchase}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
        >
          {price === 0 ? "Započni modul" : "Kupi modul"}
        </button>
      )}

      {isAccessible && (
        <div className="text-green-600 font-semibold">
          ✅ Već imaš pristup ovom modulu
        </div>
      )}
    </div>
  );
}

export default ModuleInfo;

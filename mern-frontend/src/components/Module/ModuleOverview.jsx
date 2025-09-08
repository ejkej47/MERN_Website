// src/components/Module/ModuleOverview.jsx
import React from "react";
import ModuleInfo from "./ModuleInfo";

/**
 * Props:
 * - module: objekt modula (ima title, description, bullets[], itd.)
 * - onPurchase: callback za kupovinu
 */
export default function ModuleOverview({ module, onPurchase }) {
  if (!module) return null;

  return (
    <div className="space-y-6">
      {/* Info panel */}
      <div className="rounded-2xl border border-borderSoft bg-surface p-5">
        <ModuleInfo module={module} handlePurchase={onPurchase} />
      </div>

      {/* Opis / bulleti */}
      {(module.description || (module.bullets && module.bullets.length > 0)) && (
        <div className="rounded-2xl border border-borderSoft bg-surface p-5">
          {module.description && (
            <p className="text-text/85 leading-relaxed">{module.description}</p>
          )}
          {Array.isArray(module.bullets) && module.bullets.length > 0 && (
            <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {module.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-text">
                  <span className="mt-2 inline-block h-2 w-2 rounded-full bg-accent" />
                  <span className="text-text/85">{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

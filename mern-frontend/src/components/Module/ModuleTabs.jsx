// src/components/Module/ModuleTabs.jsx
import React from "react";

/**
 * Props:
 * - tabs: Array<{ id: string; label: string; count?: number }>
 * - active: string
 * - onChange: (id: string) => void
 * - sticky?: boolean          // default true (dodaje sticky bg bar)
 */
export default function ModuleTabs({ tabs = [], active, onChange, sticky = true }) {
  return (
    <div
      className={
        sticky
          ? "sticky top-0 z-30 -mx-4 border-b border-borderSoft bg-background/90 px-4 backdrop-blur"
          : ""
      }
    >
      <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto py-3" role="tablist" aria-label="Sekcije modula">
        {tabs.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${t.id}`}
              onClick={() => onChange?.(t.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition
                ${isActive
                  ? "bg-accent text-black"
                  : "bg-surface text-text hover:bg-background border border-borderSoft"
                }`}
            >
              <span>{t.label}</span>
              {typeof t.count === "number" && (
                <span className={`ml-2 inline-flex items-center justify-center rounded-full px-2 text-xs
                                  ${isActive ? "text-black/80" : "text-muted"}`}>
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

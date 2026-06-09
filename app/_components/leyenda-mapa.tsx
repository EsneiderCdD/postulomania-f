"use client";

import "./mapa-ofertas.css";

const ITEMS = [
  {
    color: "#fbbf24",
    size: 14,
    shadow: "0 0 10px 4px rgba(251,191,36,0.7), 0 0 16px 6px rgba(255,255,255,0.15)",
    border: "2px solid #fff",
    anim: "",
    label: "",
  },
  {
    color: "#94a3b8",
    size: 8,
    shadow: "0 0 4px 1px rgba(148,163,184,0.4)",
    border: "",
    anim: "",
    label: "Sin postulación · 30 d",
  },
  {
    color: "#f8fafc",
    size: 12,
    shadow: "0 0 10px 5px rgba(248,250,252,0.7), 0 0 20px 8px rgba(248,250,252,0.3)",
    border: "",
    anim: "",
    label: "Postulado · 15 d",
  },
  {
    color: "#3b82f6",
    size: 12,
    shadow: "0 0 8px 3px rgba(59,130,246,0.6)",
    border: "",
    anim: "star-pulsar",
    label: "HdV Vista",
  },
  {
    color: "#4ade80",
    size: 14,
    shadow: "0 0 8px 3px rgba(74,222,128,0.6)",
    border: "",
    anim: "",
    label: "Finalista",
  },
  {
    color: "#ef4444",
    size: 8,
    shadow: "0 0 6px 2px rgba(239,68,68,0.5)",
    border: "",
    anim: "",
    label: "Finalizado · 30 d",
  },
  {
    color: "#d97706",
    size: 8,
    shadow: "0 0 4px 1px rgba(217,119,6,0.4)",
    border: "",
    anim: "",
    label: "Suspendido",
  },
];

export default function LeyendaMapa() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      {ITEMS.map((item) => (
        <div
          key={item.label || "yo"}
          className="flex items-center gap-2 rounded-lg border border-white/5 bg-neutral-900/80 px-3 py-2"
        >
          <span
            className={`inline-block rounded-full ${item.anim}`}
            style={{
              width: item.size,
              height: item.size,
              minWidth: item.size,
              backgroundColor: item.color,
              boxShadow: item.shadow,
              border: item.border || undefined,
            }}
          />
          {item.label && (
            <span className="text-xs text-neutral-400 whitespace-nowrap">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

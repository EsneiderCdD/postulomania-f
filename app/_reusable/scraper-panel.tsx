"use client";

import RunButton from "./run-button";

const scraperButtons = [
  { label: "Escanear DDS (diario)" },
  { label: "Escanear DDS (completo)" },
  { label: "Escanear Full Stack" },
  { label: "Refrescar compatibilidad" },
  { label: "Resetear base de datos" },
];

export default function ScraperPanel() {
  return (
    <div className="flex gap-2">
      {scraperButtons.map((b) => (
        <RunButton key={b.label} label={b.label} />
      ))}
    </div>
  );
}

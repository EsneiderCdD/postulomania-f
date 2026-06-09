"use client";

import { useState, useEffect, useCallback } from "react";
import { getPerfil, updatePerfil, type PerfilData } from "../actions";

const CATEGORY_ORDER = [
  "backend",
  "frontend",
  "bases_de_datos",
  "mobile",
  "devops",
  "cloud",
  "data",
  "arquitectura",
];

const CATEGORY_LABELS: Record<string, string> = {
  backend: "Backend",
  frontend: "Frontend",
  bases_de_datos: "Bases de Datos",
  mobile: "Mobile",
  devops: "DevOps",
  cloud: "Cloud",
  data: "Data",
  arquitectura: "Arquitectura",
  otras: "Otras",
};

export default function Perfil() {
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getPerfil().then((data) => {
      if (!data) setError("No se pudo cargar el perfil.");
      setPerfil(data);
    });
  }, []);

  const handleStartEdit = (nombre: string, score: number) => {
    setEditing(nombre);
    setEditValue(String(score));
    setError("");
  };

  const handleCancel = () => {
    setEditing(null);
    setEditValue("");
    setError("");
  };

  const handleSave = useCallback(async () => {
    if (!perfil || !editing) return;

    const newScore = parseFloat(editValue);
    if (isNaN(newScore) || newScore < 0 || newScore > 1) {
      setError("Ingresá un valor entre 0.00 y 1.00");
      return;
    }

    setSaving(true);
    setError("");

    const result = await updatePerfil({ [editing]: newScore.toFixed(2) as unknown as number });
    if (result) {
      setPerfil((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          tecnico: { ...prev.tecnico, [editing]: newScore },
        };
      });
    } else {
      setError("Error al guardar. Reintentá.");
    }
    setSaving(false);
    setEditing(null);
  }, [perfil, editing, editValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  if (error && !perfil) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(251,191,36,0.12) 0%, rgba(245,158,11,0.04) 40%, transparent 70%)",
          }}
        />
        <div className="relative z-10 mx-auto w-[98%] max-w-[1333px] min-h-screen rounded-3xl border border-white/5 bg-neutral-900">
          <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
            <h1 className="hero-title text-center text-4xl md:text-5xl">Perfil</h1>
            <p className="mt-6 text-sm text-neutral-400">{error}</p>
          </div>
        </div>
      </main>
    );
  }

  if (!perfil) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950">
        <div className="relative z-10 mx-auto w-[98%] max-w-[1333px] min-h-screen rounded-3xl border border-white/5 bg-neutral-900">
          <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
            <div className="h-6 w-48 animate-pulse rounded bg-neutral-800" />
          </div>
        </div>
      </main>
    );
  }

  const grouped: Record<string, [string, number][]> = {};
  for (const cat of [...CATEGORY_ORDER, "otras"]) {
    grouped[cat] = [];
  }

  for (const [nombre, score] of Object.entries(perfil.tecnico)) {
    const cat = perfil.categorias[nombre] ?? "otras";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push([nombre, score]);
  }

  for (const cat of Object.keys(grouped)) {
    grouped[cat].sort((a, b) => b[1] - a[1]);
  }

  const calificadas = Object.values(perfil.tecnico).filter((s) => s > 0).length;
  const promedio =
    calificadas > 0
      ? Object.values(perfil.tecnico)
          .filter((s) => s > 0)
          .reduce((a, b) => a + b, 0) / calificadas
      : 0;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(251,191,36,0.12) 0%, rgba(245,158,11,0.04) 40%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto w-[98%] max-w-[1333px] min-h-screen rounded-3xl border border-white/5 bg-neutral-900">
        <div className="flex min-h-screen flex-col items-center px-6 py-8">
          <h1 className="hero-title text-center text-4xl md:text-5xl">Perfil</h1>

          <div className="mt-8 w-full max-w-5xl space-y-6">
            <p className="text-sm text-neutral-400 font-[var(--font-exo)]">
              Experiencia {perfil.experiencia.toFixed(2)}
              <span className="mx-3 text-neutral-600">|</span>
              Inglés {perfil.idiomas.ingles?.toFixed(2) ?? "0.00"}
              <span className="mx-3 text-neutral-600">|</span>
              Nivel educativo {perfil.nivel_educativo.toFixed(2)}
              <span className="mx-3 text-neutral-600">|</span>
              Calificadas {calificadas}/{perfil.metricas.total_tecnologias_db}
              <span className="mx-3 text-neutral-600">|</span>
              Promedio {promedio.toFixed(2)}
            </p>

            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2 font-[var(--font-exo)]">
                {error}
              </p>
            )}

            {[...CATEGORY_ORDER, "otras"].map((cat) => {
              const techs = grouped[cat];
              if (!techs || techs.length === 0) return null;

              return (
                <div key={cat}>
                  <h2 className="mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-[0.15em] font-[var(--font-exo)]">
                    {CATEGORY_LABELS[cat] ?? cat}
                  </h2>
                  <div
                    className="gap-x-4 gap-y-1"
                    style={{ columns: "4 200px" }}
                  >
                    {techs.map(([nombre, score]) => (
                      <div
                        key={nombre}
                        className="flex justify-between text-sm break-inside-avoid"
                      >
                        <span className="text-neutral-300 font-[var(--font-exo)] truncate mr-2">
                          {nombre}
                        </span>
                        {editing === nombre ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                            disabled={saving}
                            autoFocus
                            className="w-14 rounded bg-neutral-800 border border-amber-500/50 px-1 text-right text-amber-400 tabular-nums text-sm outline-none focus:border-amber-400"
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleStartEdit(nombre, score)}
                            className="text-amber-400 tabular-nums shrink-0 cursor-pointer hover:text-amber-300 transition-colors"
                            title="Click para editar"
                          >
                            {score.toFixed(2)}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

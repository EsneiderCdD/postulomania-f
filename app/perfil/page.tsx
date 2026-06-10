"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { getPerfil, updatePerfil, deletePerfilTech, type PerfilData } from "../actions";
import ModalAgregarTech from "../_components/modal-agregar-tech";

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
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
  const [confirmDeleteNombre, setConfirmDeleteNombre] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const cargarPerfil = useCallback(async () => {
    const data = await getPerfil();
    if (!data) setError("No se pudo cargar el perfil.");
    setPerfil(data);
  }, []);

  useEffect(() => {
    cargarPerfil();
  }, [cargarPerfil]);

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

  const handleDelete = useCallback(async (nombre: string) => {
    if (!perfil) return;
    const ptId = perfil.perfil_tech_ids[nombre];
    if (ptId == null) return;
    setDeleting(true);
    setConfirmDeleteNombre(null);
    const ok = await deletePerfilTech(ptId);
    if (ok) {
      await cargarPerfil();
    } else {
      setError("Error al eliminar. Reintentá.");
    }
    setDeleting(false);
  }, [perfil, cargarPerfil]);

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

            <button
              onClick={() => setModalAgregarAbierto(true)}
              className="rounded-lg border border-amber-500/25 bg-neutral-900/80 px-3 py-2.5 text-sm font-medium text-amber-400/80 transition-colors hover:border-amber-500/50 hover:text-amber-300 hover:bg-neutral-800/80"
            >
              Agregar Tech
            </button>

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
                        <span className="flex items-center gap-1 shrink-0">
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
                              className="text-amber-400 tabular-nums cursor-pointer hover:text-amber-300 transition-colors"
                              title="Click para editar"
                            >
                              {score.toFixed(2)}
                            </button>
                          )}
                          {perfil.perfil_tech_ids[nombre] != null && (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteNombre(nombre)}
                              disabled={deleting}
                              className="text-neutral-600 hover:text-red-400 transition-colors ml-1 disabled:opacity-50"
                              title="Eliminar tecnología"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ModalAgregarTech
        abierto={modalAgregarAbierto}
        onClose={() => setModalAgregarAbierto(false)}
        onSuccess={cargarPerfil}
      />

      {confirmDeleteNombre != null &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black/70"
              onClick={() => setConfirmDeleteNombre(null)}
            />
            <div className="relative z-10 w-full max-w-sm rounded-xl border border-white/10 bg-neutral-950 p-6 shadow-2xl">
              <p className="mb-6 text-sm text-neutral-300">
                ¿Seguro que querés eliminar <span className="text-amber-400 font-semibold">{confirmDeleteNombre}</span>?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDeleteNombre(null)}
                  disabled={deleting}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-neutral-400 hover:border-white/30 hover:text-neutral-200 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(confirmDeleteNombre)}
                  disabled={deleting}
                  className="rounded-lg bg-red-600/80 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleting ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>,
          document.getElementById("modal-root")!
        )}
    </main>
  );
}

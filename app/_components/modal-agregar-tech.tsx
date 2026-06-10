"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { getTecnologias, createTecnologia, updatePerfil, type TecnologiaItem } from "../actions";

const inputCls =
  "w-full rounded border border-white/10 bg-neutral-800 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-amber-500/50 placeholder:text-neutral-500";
const labelCls = "block text-xs font-medium text-neutral-400 mb-1";

export default function ModalAgregarTech({
  abierto,
  onClose,
  onSuccess,
}: {
  abierto: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [tecnologias, setTecnologias] = useState<TecnologiaItem[]>([]);
  const [categoria, setCategoria] = useState("");
  const [nombreTech, setNombreTech] = useState("");
  const [puntaje, setPuntaje] = useState("0.00");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (abierto) {
      setCategoria("");
      setNombreTech("");
      setPuntaje("0.00");
      setError(null);
      getTecnologias().then((data) => setTecnologias(data));
    }
  }, [abierto]);

  const categorias = useMemo(() => {
    const cats = new Map<string, string>();
    for (const t of tecnologias) {
      const nombre = t.categoria ?? "otras";
      if (!cats.has(nombre)) {
        const label =
          nombre === "backend"
            ? "Backend"
            : nombre === "frontend"
              ? "Frontend"
              : nombre === "bases_de_datos"
                ? "Bases de Datos"
                : nombre === "mobile"
                  ? "Mobile"
                  : nombre === "devops"
                    ? "DevOps"
                    : nombre === "cloud"
                      ? "Cloud"
                      : nombre === "data"
                        ? "Data"
                        : nombre === "arquitectura"
                          ? "Arquitectura"
                          : "Otras";
        cats.set(nombre, label);
      }
    }
    return [...cats.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [tecnologias]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const nombre = nombreTech.trim();
      if (!nombre) {
        setError("Ingresá el nombre de la tecnología.");
        return;
      }

      if (!categoria) {
        setError("Seleccioná una categoría.");
        return;
      }

      const score = parseFloat(puntaje);
      if (isNaN(score) || score < 0 || score > 1) {
        setError("El puntaje debe ser un número entre 0.00 y 1.00");
        return;
      }

      setEnviando(true);
      try {
        const tech = await createTecnologia(nombre, categoria);
        if (!tech) {
          setError("Error al registrar la tecnología.");
          setEnviando(false);
          return;
        }

        const result = await updatePerfil({
          [tech.nombre]: score,
        });
        if (!result) {
          setError("Error al guardar el puntaje. Reintentá.");
        } else {
          onSuccess();
          onClose();
        }
      } catch {
        setError("Error de conexión con el servidor.");
      } finally {
        setEnviando(false);
      }
    },
    [nombreTech, categoria, puntaje, onClose, onSuccess],
  );

  if (!abierto) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-10"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/70" />

      <div
        className="relative z-10 w-full max-w-lg rounded-xl border border-white/10 bg-neutral-950 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-exo text-lg font-semibold text-amber-400">
            Agregar Tecnología
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-neutral-500 transition-colors hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelCls}>Categoría</label>
            <select
              className={inputCls}
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="">Seleccionar categoría...</option>
              {categorias.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelCls}>Tecnología</label>
            <input
              type="text"
              className={inputCls}
              value={nombreTech}
              onChange={(e) => setNombreTech(e.target.value)}
              placeholder="Ej: SwiftUI, Svelte, Terraform..."
            />
            <p className="mt-0.5 text-[11px] text-neutral-600 leading-tight">
              Si la tecnología ya existe, se usará la existente.
            </p>
          </div>

          <div>
            <label className={labelCls}>Puntaje</label>
            <input
              type="number"
              className={inputCls}
              value={puntaje}
              onChange={(e) => setPuntaje(e.target.value)}
              step="0.01"
              min="0"
              max="1"
              placeholder="0.00"
            />
            <p className="mt-0.5 text-[11px] text-neutral-600 leading-tight">
              Valor entre 0.00 y 1.00. Por defecto 0.00.
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={enviando}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-neutral-400 transition-colors hover:border-white/30 hover:text-neutral-200 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="btn-primary disabled:opacity-60"
            >
              {enviando ? "Guardando..." : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
}

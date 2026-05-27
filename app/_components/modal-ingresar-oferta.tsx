"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { createOferta } from "../actions";
import FormOfertaCampos, { CAMPOS_INITIAL } from "./form-oferta-campos";
import type { FormCamposFields } from "./form-oferta-campos";

function generarIdOferta(): string {
  const ahora = new Date();
  const fecha =
    ahora.getFullYear().toString() +
    (ahora.getMonth() + 1).toString().padStart(2, "0") +
    ahora.getDate().toString().padStart(2, "0");
  const random = Math.random().toString(36).slice(2, 8);
  return `MANUAL-${fecha}-${random}`;
}

export default function ModalIngresarOferta({
  abierto,
  onClose,
  onSuccess,
}: {
  abierto: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const idRef = useRef<HTMLInputElement>(null);
  const [fields, setFields] = useState<FormCamposFields>(CAMPOS_INITIAL);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (abierto) {
      setFields({ ...CAMPOS_INITIAL, id_oferta: generarIdOferta() });
      setError(null);
      setTimeout(() => idRef.current?.select(), 50);
    }
  }, [abierto]);

  const set = useCallback(
    (campo: keyof FormCamposFields, valor: string | boolean) =>
      setFields((prev) => ({ ...prev, [campo]: valor })),
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!fields.id_oferta.trim()) {
        setError("El ID de oferta es obligatorio.");
        return;
      }

      const tecnologiasRaw = fields.tecnologias.trim();
      const tecnologias: string[] | null = tecnologiasRaw
        ? tecnologiasRaw.split(",").map((t) => t.trim()).filter(Boolean)
        : null;

      const compatibilidadRaw = fields.compatibilidad.trim();
      const compatibilidad: number | null = compatibilidadRaw
        ? Number(compatibilidadRaw) / 100
        : null;

      setEnviando(true);
      try {
        const result = await createOferta({
          id_oferta: fields.id_oferta.trim(),
          origen_proceso: fields.origen_proceso,
          titulo: fields.titulo.trim() || null,
          enlace: fields.enlace.trim() || null,
          descripcion: fields.descripcion.trim() || null,
          municipio: fields.municipio.trim() || null,
          departamento: fields.departamento.trim() || null,
          fecha_publicacion_estimada:
            fields.fecha_publicacion_estimada || null,
          experiencia_anios: fields.experiencia_anios
            ? Number(fields.experiencia_anios)
            : null,
          requiere_ingles: fields.requiere_ingles,
          keyword: fields.keyword.trim() || null,
          empresa: fields.empresa.trim() || null,
          tecnologias,
          compatibilidad,
        });

        if (result?.error) {
          setError(
            typeof result.error === "string" ? result.error : "Error desconocido",
          );
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
    [fields, onClose, onSuccess],
  );

  if (!abierto) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-10"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black/70" />

      <div
        className="relative z-10 w-full max-w-2xl rounded-xl border border-white/10 bg-neutral-950 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-exo text-lg font-semibold text-amber-400">
            Ingresar Oferta
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
          <FormOfertaCampos fields={fields} set={set} idRef={idRef} />

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
              {enviando ? "Guardando..." : "Guardar Oferta"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
}

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createOferta } from "../actions";

function generarIdOferta(): string {
  const ahora = new Date();
  const fecha =
    ahora.getFullYear().toString() +
    (ahora.getMonth() + 1).toString().padStart(2, "0") +
    ahora.getDate().toString().padStart(2, "0");
  const random = Math.random().toString(36).slice(2, 8);
  return `MANUAL-${fecha}-${random}`;
}

type FormFields = {
  id_oferta: string;
  origen_proceso: string;
  titulo: string;
  enlace: string;
  descripcion: string;
  municipio: string;
  departamento: string;
  fecha_publicacion_estimada: string;
  experiencia_anios: string;
  requiere_ingles: boolean;
  keyword: string;
  empresa_id: string;
  tecnologias: string;
  compatibilidad: string;
};

function getInitial(): FormFields {
  return {
    id_oferta: generarIdOferta(),
    origen_proceso: "dds",
    titulo: "",
    enlace: "",
    descripcion: "",
    municipio: "",
    departamento: "",
    fecha_publicacion_estimada: "",
    experiencia_anios: "",
    requiere_ingles: false,
    keyword: "",
    empresa_id: "",
    tecnologias: "",
    compatibilidad: "",
  };
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
  const [fields, setFields] = useState<FormFields>(getInitial);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (abierto) {
      setFields(getInitial());
      setError(null);
      setTimeout(() => idRef.current?.select(), 50);
    }
  }, [abierto]);

  const set = useCallback(
    (campo: keyof FormFields, valor: string | boolean) =>
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
          empresa_id: fields.empresa_id ? Number(fields.empresa_id) : null,
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

  const inputCls =
    "w-full rounded border border-white/10 bg-neutral-800 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-amber-500/50 placeholder:text-neutral-500";
  const labelCls = "block text-xs font-medium text-neutral-400 mb-1";
  const hintCls = "mt-0.5 text-[11px] text-neutral-600 leading-tight";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-10"
      onClick={onClose}
    >
      {/* overlay */}
      <div className="fixed inset-0 bg-black/70" />

      {/* card */}
      <div
        className="relative z-10 w-full max-w-2xl rounded-xl border border-white/10 bg-neutral-950 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
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

        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* sección: requeridos */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>
                ID Oferta <span className="text-red-400">*</span>
              </label>
              <input
                ref={idRef}
                className={inputCls}
                value={fields.id_oferta}
                onChange={(e) => set("id_oferta", e.target.value)}
                required
              />
              <p className={hintCls}>
                Auto-generado. Podés editarlo si necesitás otro.
              </p>
            </div>

            <div>
              <label className={labelCls}>
                Origen Proceso <span className="text-red-400">*</span>
              </label>
              <select
                className={inputCls}
                value={fields.origen_proceso}
                onChange={(e) => set("origen_proceso", e.target.value)}
              >
                <option value="dds">DDS</option>
                <option value="dds_full">DDS Full</option>
                <option value="fullstack">Full Stack</option>
                <option value="linkedin">LinkedIn</option>
                <option value="freelance">Freelance</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          {/* sección: datos principales */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelCls}>Título</label>
              <input
                className={inputCls}
                value={fields.titulo}
                onChange={(e) => set("titulo", e.target.value)}
                placeholder="Ej: Desarrollador Frontend React"
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Enlace</label>
              <input
                className={inputCls}
                type="url"
                value={fields.enlace}
                onChange={(e) => set("enlace", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* descripción */}
          <div>
            <label className={labelCls}>Descripción</label>
            <textarea
              className={inputCls + " h-32 resize-y"}
              value={fields.descripcion}
              onChange={(e) => set("descripcion", e.target.value)}
              placeholder="Descripción de la oferta..."
              rows={5}
            />
          </div>

          {/* ubicación */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Municipio</label>
              <input
                className={inputCls}
                value={fields.municipio}
                onChange={(e) => set("municipio", e.target.value)}
                placeholder="Ej: Medellín"
              />
              <p className={hintCls}>
                Campo vacío = sin información. No uses &quot;-&quot; o
                &quot;null&quot;.
              </p>
            </div>
            <div>
              <label className={labelCls}>Departamento</label>
              <input
                className={inputCls}
                value={fields.departamento}
                onChange={(e) => set("departamento", e.target.value)}
                placeholder="Ej: Antioquia"
              />
              <p className={hintCls}>
                Campo vacío = sin información. No uses &quot;-&quot; o
                &quot;null&quot;.
              </p>
            </div>
          </div>

          {/* detalles */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelCls}>Fecha publicación</label>
              <input
                className={inputCls}
                type="datetime-local"
                value={fields.fecha_publicacion_estimada}
                onChange={(e) =>
                  set("fecha_publicacion_estimada", e.target.value)
                }
              />
              <p className={hintCls}>
                Campo vacío = sin información.
              </p>
            </div>
            <div>
              <label className={labelCls}>Años experiencia</label>
              <input
                className={inputCls}
                type="number"
                step="0.5"
                min="0"
                value={fields.experiencia_anios}
                onChange={(e) => set("experiencia_anios", e.target.value)}
                placeholder="Ej: 2"
              />
              <p className={hintCls}>
                Campo vacío = sin información.
              </p>
            </div>
            <div>
              <label className={labelCls}>Keyword</label>
              <input
                className={inputCls}
                value={fields.keyword}
                onChange={(e) => set("keyword", e.target.value)}
                placeholder="Ej: react"
              />
              <p className={hintCls}>
                Campo vacío = sin información.
              </p>
            </div>
          </div>

          {/* tecnologías */}
          <div>
            <label className={labelCls}>Tecnologías</label>
            <input
              className={inputCls}
              value={fields.tecnologias}
              onChange={(e) => set("tecnologias", e.target.value)}
              placeholder="Ej: React, PostgreSQL, Docker"
            />
            <p className={hintCls}>
              Separadas por coma. Si no conocés las tecnologías, dejalo vacío
              y registralas después.
            </p>
          </div>

          {/* compatibilidad */}
          <div>
            <label className={labelCls}>Compatibilidad (%)</label>
            <input
              className={inputCls}
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={fields.compatibilidad}
              onChange={(e) => set("compatibilidad", e.target.value)}
              placeholder="Ej: 6"
            />
            <p className={hintCls}>
              Fórmula: % de tecnologías de la oferta que manejás.
              Ej: si la oferta pide 4 y manejás 3 → 75%. Si no lo calculás
              ahora, dejalo vacío y registralo después.
            </p>
          </div>

          {/* extras */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Empresa ID</label>
              <input
                className={inputCls}
                type="number"
                value={fields.empresa_id}
                onChange={(e) => set("empresa_id", e.target.value)}
                placeholder="ID de empresa existente"
              />
              <p className={hintCls}>
                Campo vacío = sin empresa asociada.
              </p>
            </div>

            <div className="flex items-end pb-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={fields.requiere_ingles}
                  onChange={(e) =>
                    set("requiere_ingles", e.target.checked)
                  }
                  className="h-4 w-4 rounded border-white/10 bg-neutral-800 accent-amber-500"
                />
                <span className="text-sm text-neutral-300">
                  Requiere inglés
                </span>
              </label>
            </div>
          </div>

          {/* error */}
          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* acciones */}
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
    </div>
  );
}

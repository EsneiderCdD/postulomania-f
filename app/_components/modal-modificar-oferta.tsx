"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { searchOfertas, getOferta, updateOferta } from "../actions";
import type { OfertaSearchItem, OfertaCompleta } from "../actions";
import FormOfertaCampos, { CAMPOS_INITIAL } from "./form-oferta-campos";
import type { FormCamposFields } from "./form-oferta-campos";

type Fase = "buscando" | "editando";

function ofertaAFields(oferta: OfertaCompleta): FormCamposFields {
  return {
    id: String(oferta.id),
    id_oferta: oferta.id_oferta ?? "",
    origen_proceso: oferta.origen_proceso ?? "dds",
    titulo: oferta.titulo ?? "",
    enlace: oferta.enlace ?? "",
    descripcion: oferta.descripcion ?? "",
    municipio: oferta.municipio ?? "",
    departamento: oferta.departamento ?? "",
    fecha_publicacion_estimada: oferta.fecha_publicacion_estimada
      ? oferta.fecha_publicacion_estimada.replace(" ", "T")
      : "",
    experiencia_anios:
      oferta.experiencia_anios != null
        ? String(oferta.experiencia_anios)
        : "",
    requiere_ingles: oferta.requiere_ingles ?? false,
    keyword: oferta.keyword ?? "",
    empresa: oferta.empresa ?? "",
    tecnologias: (oferta.tecnologias ?? []).join(", "),
    compatibilidad:
      oferta.compatibilidad != null
        ? String(Math.round(oferta.compatibilidad * 100))
        : "",
  };
}

export default function ModalModificarOferta({
  abierto,
  onClose,
  onSuccess,
}: {
  abierto: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [fase, setFase] = useState<Fase>("buscando");
  const [searchTerm, setSearchTerm] = useState("");
  const [resultados, setResultados] = useState<OfertaSearchItem[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [ofertaId, setOfertaId] = useState<number | null>(null);
  const [fields, setFields] = useState<FormCamposFields>(CAMPOS_INITIAL);
  const [cargandoOferta, setCargandoOferta] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setFase("buscando");
    setSearchTerm("");
    setResultados([]);
    setBuscando(false);
    setOfertaId(null);
    setFields(CAMPOS_INITIAL);
    setCargandoOferta(false);
    setEnviando(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (abierto) {
      reset();
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [abierto, reset]);

  const handleSearch = useCallback(
    async (term: string) => {
      setSearchTerm(term);
      const trimmed = term.trim();
      if (trimmed.length < 2) {
        setResultados([]);
        return;
      }
      setBuscando(true);
      setError(null);
      try {
        const items = await searchOfertas(trimmed);
        setResultados(items);
      } catch {
        setError("Error al buscar.");
      } finally {
        setBuscando(false);
      }
    },
    [],
  );

  const handleSeleccionar = useCallback(async (id: number) => {
    setOfertaId(id);
    setCargandoOferta(true);
    setError(null);
    try {
      const result = await getOferta(id);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setFields(ofertaAFields(result as OfertaCompleta));
      setFase("editando");
    } catch {
      setError("Error al cargar la oferta.");
    } finally {
      setCargandoOferta(false);
    }
  }, []);

  const set = useCallback(
    (campo: keyof FormCamposFields, valor: string | boolean) =>
      setFields((prev) => ({ ...prev, [campo]: valor })),
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (ofertaId == null) return;
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
        const result = await updateOferta(ofertaId, {
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
    [fields, ofertaId, onClose, onSuccess],
  );

  if (!abierto) return null;

  const overlayProps = fase === "buscando"
    ? { onClick: onClose }
    : {};

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-10"
      {...overlayProps}
    >
      <div className="fixed inset-0 bg-black/70" />

      <div
        className="relative z-10 w-full max-w-2xl rounded-xl border border-white/10 bg-neutral-950 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-exo text-lg font-semibold text-amber-400">
            {fase === "buscando"
              ? "Modificar Oferta"
              : `Editando: ${fields.titulo || "Oferta #" + ofertaId}`}
          </h2>
          <button
            onClick={() => {
              if (fase === "editando") {
                reset();
              } else {
                onClose();
              }
            }}
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

        {/* fase 1 — buscador */}
        {fase === "buscando" && (
          <div className="space-y-4">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Buscar por título o empresa..."
              className="w-full rounded border border-white/10 bg-neutral-800 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-amber-500/50 placeholder:text-neutral-500"
            />

            {buscando && (
              <p className="text-sm text-neutral-500">Buscando...</p>
            )}

            {resultados.length > 0 && (
              <ul className="space-y-1 max-h-80 overflow-y-auto">
                {resultados.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleSeleccionar(item.id)}
                      className="w-full rounded-lg border border-white/5 bg-neutral-800/50 px-4 py-3 text-left transition-colors hover:border-amber-500/30 hover:bg-neutral-800"
                    >
                      <span className="block text-sm text-white">
                        {item.titulo || "(sin título)"}
                      </span>
                      <span className="block text-xs text-neutral-500">
                        {item.empresa || "Sin empresa"}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {searchTerm.trim().length >= 2 && !buscando && resultados.length === 0 && (
              <p className="text-sm text-neutral-500">
                Sin resultados para &quot;{searchTerm}&quot;.
              </p>
            )}

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="flex justify-end border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-neutral-400 transition-colors hover:border-white/30 hover:text-neutral-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* fase 2 — formulario de edición */}
        {fase === "editando" && (
          <div>
            {cargandoOferta ? (
              <p className="py-10 text-center text-sm text-neutral-500">
                Cargando oferta...
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <FormOfertaCampos
                  key={ofertaId}
                  fields={fields}
                  set={set}
                  idHint="ID de la oferta. Podés cambiarlo si es necesario."
                  mostrarId
                />

                {error && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={reset}
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
                    {enviando ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>,
    document.getElementById("modal-root")!
  );
}

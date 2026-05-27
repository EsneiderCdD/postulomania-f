"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { createPostulacion, deletePostulacion, deleteOferta } from "../actions";
import { toggleSeguimiento } from "../actions";

type Oferta = {
  id: number;
  id_oferta: string;
  titulo: string;
  enlace: string;
  fecha_extraccion: string;
  experiencia_anios: number | null;
  requiere_ingles: boolean;
  origen_proceso: string;
  empresa: string | null;
  compatibilidad: number;
  empresa_id: number | null;
};

type PostulacionProp = {
  id: number;
  oferta_id: number;
  estado_proceso: string;
};

const ORIGEN_STYLES: Record<string, string> = {
  dds: "bg-blue-900/50 text-blue-300 border-blue-500/30",
  dds_full: "bg-purple-900/50 text-purple-300 border-purple-500/30",
  fullstack: "bg-green-900/50 text-green-300 border-green-500/30",
};

const ESTADO_STYLES: Record<string, string> = {
  "Postulado": "bg-blue-900/40 text-blue-300",
  "HdV Vista": "bg-yellow-900/40 text-yellow-300",
  "Finalista": "bg-green-900/40 text-green-300",
  "Proceso finalizado": "bg-neutral-800 text-neutral-400",
};

function compColor(score: number) {
  if (score >= 0.6) return "text-green-400";
  if (score >= 0.3) return "text-yellow-400";
  return "text-red-400";
}

function compBg(score: number) {
  if (score >= 0.6) return "bg-green-400/10";
  if (score >= 0.3) return "bg-yellow-400/10";
  return "bg-red-400/10";
}

function formatDate(iso: string) {
  const d = iso.split(" ")[0];
  const [, m, day] = d.split("-");
  return `${day}/${m}`;
}

function origenLabel(origen: string) {
  const map: Record<string, string> = {
    dds: "DDS",
    dds_full: "DDS Full",
    fullstack: "Full Stack",
  };
  return map[origen] ?? origen;
}

export default function OfertasTabla({
  ofertas,
  postulaciones,
  onSeguirEmpresa,
  seguimientoIds,
}: {
  ofertas: Oferta[];
  postulaciones: PostulacionProp[];
  onSeguirEmpresa?: (empresaId: number) => void;
  seguimientoIds?: Set<number>;
}) {
  const router = useRouter();
  const [applied, setApplied] = useState(() => {
    const map = new Map<number, { id: number; estado: string }>();
    for (const p of postulaciones) {
      map.set(p.oferta_id, { id: p.id, estado: p.estado_proceso });
    }
    return map;
  });
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handlePostular = useCallback(async (ofertaId: number) => {
    setLoadingId(ofertaId);
    const data = await createPostulacion(ofertaId);
    if (data?.postulacion) {
      setApplied((prev) => {
        const next = new Map(prev);
        next.set(ofertaId, { id: data.postulacion.id, estado: data.postulacion.estado_proceso });
        return next;
      });
    }
    setLoadingId(null);
  }, []);

  const handleDespostular = useCallback(async (ofertaId: number) => {
    const entry = applied.get(ofertaId);
    if (!entry) return;
    await deletePostulacion(entry.id);
    setApplied((prev) => {
      const next = new Map(prev);
      next.delete(ofertaId);
      return next;
    });
  }, [applied]);

  const handleToggleSeguir = useCallback(async (empresaId: number, activo: boolean) => {
    await toggleSeguimiento(empresaId, !activo);
    router.refresh();
    if (!activo) {
      onSeguirEmpresa?.(empresaId);
    }
  }, [router, onSeguirEmpresa]);

  const handleDeleteClick = useCallback((ofertaId: number) => {
    setConfirmDeleteId(ofertaId);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (confirmDeleteId == null) return;
    await deleteOferta(confirmDeleteId);
    setConfirmDeleteId(null);
    router.refresh();
  }, [confirmDeleteId, router]);

  const handleCancelDelete = useCallback(() => {
    setConfirmDeleteId(null);
  }, []);

  if (ofertas.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral-500">
        Sin ofertas disponibles
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-neutral-950">
      <table className="w-full text-sm text-neutral-300">
        <thead>
          <tr className="border-b border-white/10 bg-neutral-900 text-left text-xs uppercase tracking-wider text-neutral-400">
            <th className="sticky left-0 bg-neutral-900 px-4 py-3 font-medium">
              Título
            </th>
            <th className="px-4 py-3 font-medium">Empresa</th>
            <th className="px-4 py-3 font-medium text-center">Compatibilidad</th>
            <th className="px-4 py-3 font-medium">Extracción</th>
            <th className="px-4 py-3 font-medium">Origen</th>
            <th className="px-4 py-3 font-medium text-center">Exp.</th>
            <th className="px-4 py-3 font-medium text-center">Inglés</th>
            <th className="px-4 py-3 font-medium text-center">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {ofertas.map((oferta, i) => {
            const post = applied.get(oferta.id);
            const estado = post?.estado;
            const isPostulando = loadingId === oferta.id;
            const isSiguiendo = oferta.empresa_id != null && seguimientoIds?.has(oferta.empresa_id);
            return (
              <tr
                key={`${oferta.id}-${i}`}
                className="transition-colors hover:bg-white/[0.02]"
              >
                <td className="sticky left-0 bg-neutral-950 px-4 py-3">
                  <a
                    href={oferta.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    {oferta.titulo}
                  </a>
                </td>
                <td className="px-4 py-3 text-neutral-400">
                  {oferta.empresa ?? "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${compColor(oferta.compatibilidad)} ${compBg(oferta.compatibilidad)}`}
                  >
                    {Math.round(oferta.compatibilidad * 100)}%
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                  {formatDate(oferta.fecha_extraccion)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${ORIGEN_STYLES[oferta.origen_proceso] ?? "bg-neutral-800 text-neutral-400 border-neutral-600"}`}
                  >
                    {origenLabel(oferta.origen_proceso)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-neutral-400">
                  {oferta.experiencia_anios != null ? oferta.experiencia_anios : "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  {oferta.requiere_ingles ? (
                    <span className="inline-block rounded bg-green-900/40 px-2 py-0.5 text-xs font-medium text-green-400">
                      Sí
                    </span>
                  ) : (
                    <span className="inline-block rounded bg-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-500">
                      No
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {isSiguiendo ? (
                      <button
                        onClick={() => handleToggleSeguir(oferta.empresa_id!, true)}
                        className="rounded border border-amber-500/20 px-2 py-1 text-xs font-medium text-amber-500/70 bg-amber-500/5 hover:border-amber-500/40 transition-colors"
                        title="Dejar de seguir"
                      >
                        Siguiendo
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleSeguir(oferta.empresa_id!, false)}
                        className="rounded border border-amber-500/30 px-2 py-1 text-xs text-amber-400 hover:border-amber-500/60 hover:text-amber-300 transition-colors"
                        title={`Seguir ${oferta.empresa ?? "empresa"} en el mapa`}
                      >
                        Seguir
                      </button>
                    )}
                    {estado ? (
                      <button
                        onClick={() => handleDespostular(oferta.id)}
                        className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${ESTADO_STYLES[estado] ?? "bg-neutral-800 text-neutral-400"} cursor-pointer hover:opacity-80`}
                        title="Click para quitar postulación"
                      >
                        {estado}
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePostular(oferta.id)}
                        disabled={isPostulando}
                        className="rounded border border-white/10 px-3 py-1 text-xs text-neutral-400 hover:border-white/30 hover:text-neutral-200 disabled:opacity-50"
                      >
                        {isPostulando ? "..." : "Postularme"}
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteClick(oferta.id)}
                      className="rounded p-1 text-neutral-600 transition-colors hover:text-red-400 hover:bg-red-400/10"
                      title="Eliminar oferta"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {confirmDeleteId != null &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/70" onClick={handleCancelDelete} />
            <div className="relative z-10 w-full max-w-sm rounded-xl border border-white/10 bg-neutral-950 p-6 shadow-2xl">
              <p className="mb-6 text-sm text-neutral-300">
                ¿Estás seguro de eliminar esta oferta? Esta acción no se puede deshacer.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-neutral-400 hover:border-white/30 hover:text-neutral-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="rounded-lg bg-red-600/80 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>,
          document.getElementById("modal-root")!
        )}
    </div>
  );
}

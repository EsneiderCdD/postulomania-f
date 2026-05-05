"use client";

import { useState, useCallback } from "react";
import { createPostulacion } from "../actions";

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
};

type PostulacionProp = {
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
}: {
  ofertas: Oferta[];
  postulaciones: PostulacionProp[];
}) {
  const [applied, setApplied] = useState(() => {
    const map = new Map<number, string>();
    for (const p of postulaciones) {
      map.set(p.oferta_id, p.estado_proceso);
    }
    return map;
  });
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handlePostular = useCallback(async (ofertaId: number) => {
    setLoadingId(ofertaId);
    const data = await createPostulacion(ofertaId);
    if (data?.postulacion) {
      setApplied((prev) => {
        const next = new Map(prev);
        next.set(ofertaId, data.postulacion.estado_proceso);
        return next;
      });
    }
    setLoadingId(null);
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
            const estado = applied.get(oferta.id);
            const isPostulando = loadingId === oferta.id;
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
                  {estado ? (
                    <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${ESTADO_STYLES[estado] ?? "bg-neutral-800 text-neutral-400"}`}>
                      {estado}
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePostular(oferta.id)}
                      disabled={isPostulando}
                      className="rounded border border-white/10 px-3 py-1 text-xs text-neutral-400 hover:border-white/30 hover:text-neutral-200 disabled:opacity-50"
                    >
                      {isPostulando ? "..." : "Postularme"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

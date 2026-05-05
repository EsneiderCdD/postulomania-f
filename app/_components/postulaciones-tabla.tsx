"use client";

import { useState } from "react";
import { deletePostulacion } from "../actions";

type PostulacionItem = {
  id: number;
  oferta_id: number;
  cargo: string | null;
  empresa: string | null;
  link: string | null;
  fecha_postulacion: string | null;
  plataforma: string | null;
  estado_proceso: string;
};

const ESTADO_STYLES: Record<string, string> = {
  "Postulado": "bg-blue-900/40 text-blue-300",
  "HdV Vista": "bg-yellow-900/40 text-yellow-300",
  "Finalista": "bg-green-900/40 text-green-300",
  "Proceso finalizado": "bg-neutral-800 text-neutral-400",
};

function formatDatetime(iso: string | null) {
  if (!iso) return "—";
  const [date, time] = iso.split(" ");
  const [, m, d] = date.split("-");
  const [hh, mm] = time?.split(":") ?? ["00", "00"];
  return `${d}/${m} ${hh}:${mm}`;
}

export default function PostulacionesTabla({
  postulaciones: initial,
}: {
  postulaciones: PostulacionItem[];
}) {
  const [items, setItems] = useState(initial);

  const handleDelete = async (id: number) => {
    const data = await deletePostulacion(id);
    if (data?.deleted) {
      setItems((prev) => prev.filter((p) => p.id !== id));
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-neutral-500">
        Sin postulaciones aún
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-neutral-950">
      <table className="w-full text-sm text-neutral-300">
        <thead>
          <tr className="border-b border-white/10 bg-neutral-900 text-left text-xs uppercase tracking-wider text-neutral-400">
            <th className="whitespace-nowrap px-4 py-3 font-medium">Fecha</th>
            <th className="px-4 py-3 font-medium">Cargo</th>
            <th className="px-4 py-3 font-medium">Empresa</th>
            <th className="px-4 py-3 font-medium">Plataforma</th>
            <th className="px-4 py-3 font-medium text-center">Estado</th>
            <th className="px-4 py-3 font-medium">Link</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {items.map((p) => (
            <tr
              key={p.id}
              className="transition-colors hover:bg-white/[0.02]"
            >
              <td className="whitespace-nowrap px-4 py-3 text-neutral-500">
                {formatDatetime(p.fecha_postulacion)}
              </td>
              <td className="px-4 py-3 text-neutral-200">
                {p.cargo ?? "—"}
              </td>
              <td className="px-4 py-3 text-neutral-400">
                {p.empresa ?? "—"}
              </td>
              <td className="px-4 py-3 text-neutral-500">
                {p.plataforma ?? "—"}
              </td>
              <td className="px-4 py-3 text-center">
                <span
                  className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${ESTADO_STYLES[p.estado_proceso] ?? "bg-neutral-800 text-neutral-400"}`}
                >
                  {p.estado_proceso}
                </span>
              </td>
              <td className="px-4 py-3">
                {p.link ? (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    Ver oferta
                  </a>
                ) : (
                  <span className="text-neutral-600">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => handleDelete(p.id)}
                  className="rounded border border-red-500/20 px-3 py-1 text-xs text-red-400 hover:border-red-500/50 hover:text-red-300"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import type { MapaResponse } from "./mapa-ofertas";

export default function TablaEmpresas({ data }: { data: MapaResponse }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-900 shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-neutral-300">
          <thead>
            <tr className="border-b border-white/10 bg-neutral-950 text-left text-xs uppercase tracking-wider text-neutral-400">
              <th className="px-5 py-3 font-medium">Nombre</th>
              <th className="px-5 py-3 font-medium">Municipio</th>
              <th className="px-5 py-3 font-medium">Dirección</th>
              <th className="px-5 py-3 font-medium">Web</th>
              <th className="px-5 py-3 font-medium text-right">Ofertas</th>
            </tr>
          </thead>
          <tbody>
            {data.empresas.map((empresa) => (
              <tr
                key={empresa.id}
                className="border-b border-white/5 transition-colors hover:bg-white/[0.03]"
              >
                <td className="px-5 py-3 font-medium text-white">
                  {empresa.nombre}
                </td>
                <td className="px-5 py-3 text-neutral-400">
                  {empresa.municipio}
                </td>
                <td className="px-5 py-3 text-neutral-400 text-xs">
                  {empresa.direccion}
                </td>
                <td className="px-5 py-3">
                  {empresa.website ? (
                    <a
                      href={empresa.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400/80 hover:text-amber-400 transition-colors text-xs"
                    >
                      {empresa.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  ) : (
                    <span className="text-neutral-600 text-xs">—</span>
                  )}
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-neutral-400">
                  {empresa.total_ofertas}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

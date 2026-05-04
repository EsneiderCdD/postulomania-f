"use client";

import { BRAND_CHART_COLORS } from "./chart-colors";

type OrigenEmpresaStats = {
  metrica: string;
  empresas_identificadas_por_origen: Record<string, number>;
  top_3_por_origen: Record<string, Record<string, number>>;
  larga_cola_por_origen: Record<string, string>;
};

export default function OrigenEmpresaVisual({ data }: { data: OrigenEmpresaStats }) {
  const origins = Object.keys(data.empresas_identificadas_por_origen);

  return (
    <section className="w-full max-w-6xl rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
      <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight text-white">
        {data.metrica}
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        {origins.map((origen) => (
          <div key={origen} className="rounded-xl border border-white/10 bg-neutral-950 p-4">
            <p className="text-sm text-neutral-400">{origen}</p>
            <p className="mt-1 text-3xl font-semibold text-white">
              {data.empresas_identificadas_por_origen[origen]}
            </p>
            <p className="text-xs text-neutral-500">empresas identificadas</p>
            <p className="mt-3 text-xs text-neutral-400">Larga cola: {data.larga_cola_por_origen[origen]}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {origins.map((origen, i) => {
          const top3 = Object.entries(data.top_3_por_origen[origen] ?? {});
          return (
            <div key={origen} className="rounded-xl border border-white/10 bg-neutral-950 p-4">
              <h2 className="mb-2 text-sm font-medium text-neutral-300">{origen}</h2>
              <div className="space-y-2">
                {top3.map(([empresa, count], j) => (
                  <div key={empresa} className="flex items-center justify-between text-sm">
                    <span className="truncate pr-2 text-neutral-200">{empresa}</span>
                    <span
                      className="shrink-0 font-semibold"
                      style={{ color: BRAND_CHART_COLORS[(i * 3 + j) % BRAND_CHART_COLORS.length] }}
                    >
                      {count}
                    </span>
                  </div>
                ))}
                {top3.length === 0 && (
                  <p className="text-sm text-neutral-500">Sin datos</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

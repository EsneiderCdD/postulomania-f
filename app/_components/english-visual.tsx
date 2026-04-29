"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BRAND_CHART_COLORS } from "./chart-colors";

type EnglishStats = {
  metrica: string;
  proporcion_general: string;
  impacto_experiencia_anios: Record<string, number>;
  carga_tecnica_promedio: Record<string, number>;
  impacto_compatibilidad: Record<string, number>;
  concentracion_por_origen: Record<string, string>;
  top_tecnologias_bilingues: Record<string, number>;
};

export default function EnglishVisual({ data }: { data: EnglishStats }) {
  const comparisons = [
    {
      label: "Impacto en experiencia",
      unit: "años",
      sin: data.impacto_experiencia_anios["Sin Ingles"] ?? 0,
      con: data.impacto_experiencia_anios["Con Ingles"] ?? 0,
    },
    {
      label: "Carga técnica promedio",
      unit: "techs",
      sin: data.carga_tecnica_promedio["Sin Ingles"] ?? 0,
      con: data.carga_tecnica_promedio["Con Ingles"] ?? 0,
    },
    {
      label: "Impacto en compatibilidad",
      unit: "score",
      sin: data.impacto_compatibilidad["Sin Ingles"] ?? 0,
      con: data.impacto_compatibilidad["Con Ingles"] ?? 0,
    },
  ];

  const concRows = Object.entries(data.concentracion_por_origen).map(
    ([origen, pct]) => ({
      origen,
      valor: parseFloat(pct),
    })
  );

  const techRows = Object.entries(data.top_tecnologias_bilingues)
    .map(([tech, count]) => ({ tech, count }))
    .sort((a, b) => a.count - b.count);

  return (
    <section className="w-full max-w-6xl rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
      <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight text-white">
        {data.metrica}
      </h1>

      <div className="rounded-xl border border-white/10 bg-neutral-950 p-5">
        <p className="text-sm text-neutral-400">Proporción general</p>
        <p className="mt-2 text-5xl font-bold text-white">
          {data.proporcion_general}
        </p>
        <p className="mt-1 text-sm text-neutral-500">
          de las ofertas requieren inglés
        </p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {comparisons.map((comp, i) => {
          const max = Math.max(comp.sin, comp.con, 0.01);
          const sinPct = (comp.sin / max) * 100;
          const conPct = (comp.con / max) * 100;
          const sinColor =
            BRAND_CHART_COLORS[0];
          const conColor =
            BRAND_CHART_COLORS[2];

          return (
            <div
              key={comp.label}
              className="rounded-xl border border-white/10 bg-neutral-950 p-4"
            >
              <p className="text-sm text-neutral-400">{comp.label}</p>

              <div className="mt-3 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-300">Sin inglés</span>
                    <span className="text-neutral-200 tabular-nums">
                      {comp.sin} {comp.unit}
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-neutral-800">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${sinPct}%`,
                        backgroundColor: sinColor,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-300">Con inglés</span>
                    <span className="text-neutral-200 tabular-nums">
                      {comp.con} {comp.unit}
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-neutral-800">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${conPct}%`,
                        backgroundColor: conColor,
                      }}
                    />
                  </div>
                </div>
              </div>

              {i < comparisons.length - 1 && (
                <div className="mt-4 h-px bg-white/5" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-neutral-950 p-4">
        <h2 className="mb-3 text-sm font-medium text-neutral-300">
          Concentración por origen
        </h2>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={concRows}
              margin={{ top: 8, right: 20, left: 20, bottom: 8 }}
            >
              <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
              <XAxis
                dataKey="origen"
                stroke="#a3a3a3"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="#a3a3a3"
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip formatter={(value: number) => [`${value}%`, "% inglés"]} />
              <Bar
                dataKey="valor"
                fill={BRAND_CHART_COLORS[3]}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-neutral-950 p-4">
        <h2 className="mb-3 text-sm font-medium text-neutral-300">
          Top tecnologías bilingües
        </h2>
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={techRows}
              layout="vertical"
              margin={{ top: 8, right: 20, left: 100, bottom: 8 }}
            >
              <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
              <XAxis type="number" stroke="#a3a3a3" allowDecimals={false} />
              <YAxis
                dataKey="tech"
                type="category"
                width={100}
                stroke="#d4d4d4"
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Bar
                dataKey="count"
                fill={BRAND_CHART_COLORS[1]}
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

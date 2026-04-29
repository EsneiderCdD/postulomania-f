"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BRAND_CHART_COLORS } from "./chart-colors";

type TechStackStats = {
  metrica: string;
  total_tecnologias_unicas: number;
  popularidad_top_15: Record<string, number>;
  promedio_techs_por_oferta: number;
  rango_densidad: { min: number; max: number };
  combinaciones_frecuentes: Record<string, number>;
  tecnologias_raras: Record<string, number>;
  tendencia_por_origen: Record<string, Record<string, number>>;
};

export default function TechStackVisual({ data }: { data: TechStackStats }) {
  const populRows = Object.entries(data.popularidad_top_15)
    .map(([tech, count]) => ({ tech, count }))
    .sort((a, b) => a.count - b.count);

  const comboRows = Object.entries(data.combinaciones_frecuentes)
    .map(([pair, count]) => ({ pair, count }))
    .sort((a, b) => a.count - b.count);

  const origins = Object.keys(data.tendencia_por_origen);
  const allTechs = Array.from(
    new Set(origins.flatMap((o) => Object.keys(data.tendencia_por_origen[o])))
  ).sort();

  const radarData = allTechs.map((tech) => {
    const row: Record<string, string | number> = { tech };
    origins.forEach((o) => {
      row[o] = data.tendencia_por_origen[o]?.[tech] ?? 0;
    });
    return row;
  });

  const radarColors = origins.map(
    (_, i) => BRAND_CHART_COLORS[i % BRAND_CHART_COLORS.length]
  );

  return (
    <section className="w-full max-w-6xl rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
      <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight text-white">
        {data.metrica}
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Tecnologías únicas</p>
          <p className="text-3xl font-semibold text-white">
            {data.total_tecnologias_unicas}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Promedio por oferta</p>
          <p className="text-3xl font-semibold text-white">
            {data.promedio_techs_por_oferta}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Rango densidad</p>
          <p className="text-3xl font-semibold text-white">
            {data.rango_densidad.min}–{data.rango_densidad.max}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <h2 className="mb-3 text-sm font-medium text-neutral-300">
            Popularidad Top 15
          </h2>
          <div className="h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={populRows}
                layout="vertical"
                margin={{ top: 8, right: 20, left: 100, bottom: 8 }}
              >
                <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
                <XAxis type="number" stroke="#a3a3a3" />
                <YAxis
                  dataKey="tech"
                  type="category"
                  width={100}
                  stroke="#d4d4d4"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {populRows.map((_, index) => (
                    <Cell
                      key={index}
                      fill={BRAND_CHART_COLORS[index % BRAND_CHART_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <h2 className="mb-3 text-sm font-medium text-neutral-300">
            Combinaciones frecuentes
          </h2>
          <div className="h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comboRows}
                layout="vertical"
                margin={{ top: 8, right: 20, left: 20, bottom: 8 }}
              >
                <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
                <XAxis type="number" stroke="#a3a3a3" />
                <YAxis
                  dataKey="pair"
                  type="category"
                  width={180}
                  stroke="#d4d4d4"
                  tick={{ fontSize: 11 }}
                />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="#64B5CD"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-neutral-950 p-4">
        <h2 className="mb-3 text-sm font-medium text-neutral-300">
          Tendencia por origen
        </h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#262626" />
              <PolarAngleAxis
                dataKey="tech"
                stroke="#d4d4d4"
                tick={{ fontSize: 11 }}
              />
              {origins.map((origin, i) => (
                <Radar
                  key={origin}
                  dataKey={origin}
                  stroke={radarColors[i]}
                  fill={radarColors[i]}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              ))}
              <Tooltip />
              <Legend wrapperStyle={{ color: "#d4d4d4", fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

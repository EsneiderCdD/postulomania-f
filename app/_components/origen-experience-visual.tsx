"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BRAND_CHART_COLORS } from "./chart-colors";

type OrigenExperienceStats = {
  metrica: string;
  promedio_por_origen: Record<string, number>;
  mediana_por_origen: Record<string, number>;
  moda_por_origen: Record<string, number>;
  distribucion_niveles_por_origen: Record<string, Record<string, number>>;
  tasa_entry_level_por_origen: Record<string, string>;
};

const LEVEL_KEYS = ["Junior (0-2)", "Middle (2-5)", "Senior (5+)"];
const LEVEL_LABELS: Record<string, string> = {
  "Junior (0-2)": "Junior",
  "Middle (2-5)": "Middle",
  "Senior (5+)": "Senior",
};

export default function OrigenExperienceVisual({
  data,
}: {
  data: OrigenExperienceStats;
}) {
  const origins = Object.keys(data.promedio_por_origen);

  const stackedRows = origins.map((origen) => {
    const levels = data.distribucion_niveles_por_origen[origen] ?? {};
    return {
      origen,
      ...Object.fromEntries(
        LEVEL_KEYS.map((k) => [LEVEL_LABELS[k], levels[k] ?? 0])
      ),
    };
  });

  return (
    <section className="w-full max-w-6xl rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
      <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight text-white">
        {data.metrica}
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        {origins.map((origen, i) => (
          <div
            key={origen}
            className="rounded-xl border border-white/10 bg-neutral-950 p-4"
          >
            <p className="text-sm text-neutral-400">{origen}</p>
            <div className="mt-2 flex items-baseline gap-3">
              <span
                className="text-3xl font-semibold"
                style={{ color: BRAND_CHART_COLORS[i % BRAND_CHART_COLORS.length] }}
              >
                {data.promedio_por_origen[origen]}
              </span>
              <span className="text-sm text-neutral-500">años prom.</span>
            </div>
            <div className="mt-1 flex gap-4 text-xs text-neutral-500">
              <span>Mediana: {data.mediana_por_origen[origen]}</span>
              <span>Moda: {data.moda_por_origen[origen]}</span>
            </div>
            <p className="mt-2 text-xs text-neutral-600">
              Entry level: {data.tasa_entry_level_por_origen[origen]}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-neutral-950 p-4">
        <h2 className="mb-3 text-sm font-medium text-neutral-300">
          Distribución de niveles por origen
        </h2>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stackedRows}
              margin={{ top: 8, right: 20, left: 8, bottom: 8 }}
            >
              <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
              <XAxis
                dataKey="origen"
                stroke="#a3a3a3"
                tick={{ fontSize: 12 }}
              />
              <YAxis stroke="#a3a3a3" allowDecimals={false} />
              <Tooltip />
              <Legend
                wrapperStyle={{ color: "#d4d4d4", fontSize: 12 }}
              />
              {LEVEL_KEYS.map((key, i) => (
                <Bar
                  key={key}
                  dataKey={LEVEL_LABELS[key]}
                  stackId="levels"
                  fill={BRAND_CHART_COLORS[i % BRAND_CHART_COLORS.length]}
                  radius={
                    i === LEVEL_KEYS.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]
                  }
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

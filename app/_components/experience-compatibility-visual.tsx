"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BRAND_CHART_COLORS } from "./chart-colors";

type ExperienceCompatibilityStats = {
  metrica: string;
  score_por_nivel: Record<string, number>;
  correlacion_exp_vs_score: number;
  rango_experiencia_analizado: { min: number; max: number };
};

export default function ExperienceCompatibilityVisual({
  data,
}: {
  data: ExperienceCompatibilityStats;
}) {
  const rows = Object.entries(data.score_por_nivel).map(([nivel, score]) => ({
    nivel,
    score: Math.round(score * 100) / 100,
  }));

  return (
    <section className="w-full max-w-6xl rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
      <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight text-white">
        {data.metrica}
      </h1>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Correlacion exp vs score</p>
          <p className="text-3xl font-semibold text-white">
            {data.correlacion_exp_vs_score}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Rango experiencia</p>
          <p className="text-3xl font-semibold text-white">
            {data.rango_experiencia_analizado.min} – {data.rango_experiencia_analizado.max}
          </p>
          <p className="mt-1 text-xs text-neutral-500">anos</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-neutral-950 p-4">
        <h2 className="mb-3 text-sm font-medium text-neutral-300">
          Score promedio por nivel de experiencia
        </h2>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} margin={{ top: 8, right: 20, left: 8, bottom: 8 }}>
              <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
              <XAxis dataKey="nivel" stroke="#a3a3a3" tick={{ fontSize: 12 }} />
              <YAxis stroke="#a3a3a3" domain={[0, 1]} />
              <Tooltip formatter={(v: number) => [v.toFixed(4), "score"]} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {rows.map((_, i) => (
                  <Cell key={i} fill={BRAND_CHART_COLORS[i % BRAND_CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

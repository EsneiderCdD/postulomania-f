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

type TechCompatibilityStats = {
  metrica: string;
  top_score_tecnologias: Record<string, number>;
  bottom_score_tecnologias: Record<string, number>;
};

export default function TechCompatibilityVisual({
  data,
}: {
  data: TechCompatibilityStats;
}) {
  const topRows = Object.entries(data.top_score_tecnologias)
    .map(([tech, score]) => ({ tech, score: Number(score.toFixed(4)) }))
    .sort((a, b) => a.score - b.score);

  const bottomRows = Object.entries(data.bottom_score_tecnologias)
    .map(([tech, score]) => ({ tech, score: Number(score.toFixed(4)) }))
    .sort((a, b) => a.score - b.score);

  return (
    <section className="w-full max-w-6xl rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
      <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight text-white">
        {data.metrica}
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <h2 className="mb-3 text-sm font-medium text-neutral-300">
            Mayor compatibilidad
          </h2>
          {topRows.length > 0 ? (
            <div className="h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topRows} layout="vertical" margin={{ top: 8, right: 20, left: 100, bottom: 8 }}>
                  <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
                  <XAxis type="number" stroke="#a3a3a3" domain={[0, 1]} />
                  <YAxis dataKey="tech" type="category" width={100} stroke="#d4d4d4" tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => [v.toFixed(4), "score"]} />
                  <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                    {topRows.map((_, i) => (
                      <Cell key={i} fill={BRAND_CHART_COLORS[i % BRAND_CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-neutral-500">Sin datos</p>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <h2 className="mb-3 text-sm font-medium text-neutral-300">
            Menor compatibilidad
          </h2>
          {bottomRows.length > 0 ? (
            <div className="h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bottomRows} layout="vertical" margin={{ top: 8, right: 20, left: 100, bottom: 8 }}>
                  <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
                  <XAxis type="number" stroke="#a3a3a3" domain={[0, 1]} />
                  <YAxis dataKey="tech" type="category" width={100} stroke="#d4d4d4" tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => [v.toFixed(4), "score"]} />
                  <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                    {bottomRows.map((_, i) => (
                      <Cell key={i} fill={BRAND_CHART_COLORS[(i + 4) % BRAND_CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-neutral-500">Sin datos</p>
          )}
        </div>
      </div>
    </section>
  );
}

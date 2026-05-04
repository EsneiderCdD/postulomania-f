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

type EmpresaCompatibilityStats = {
  metrica: string;
  top_score_empresas: Record<string, number>;
  empresas_con_match_cero: number;
};

export default function EmpresaCompatibilityVisual({
  data,
}: {
  data: EmpresaCompatibilityStats;
}) {
  const rows = Object.entries(data.top_score_empresas)
    .map(([empresa, score]) => ({ empresa, score: Number(score.toFixed(4)) }))
    .sort((a, b) => a.score - b.score);

  return (
    <section className="w-full max-w-6xl rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
      <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight text-white">
        {data.metrica}
      </h1>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Empresas con match cero</p>
          <p className="text-3xl font-semibold text-white">
            {data.empresas_con_match_cero}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-neutral-950 p-4">
        <h2 className="mb-3 text-sm font-medium text-neutral-300">
          Top empresas por score de compatibilidad
        </h2>
        {rows.length > 0 ? (
          <div className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} layout="vertical" margin={{ top: 8, right: 20, left: 160, bottom: 8 }}>
                <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
                <XAxis type="number" stroke="#a3a3a3" domain={[0, 1]} />
                <YAxis dataKey="empresa" type="category" width={160} stroke="#d4d4d4" tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [v.toFixed(4), "score"]} />
                <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                  {rows.map((_, i) => (
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
    </section>
  );
}

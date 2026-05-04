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

type ExperienceEmpresaStats = {
  metrica: string;
  top_experiencia_empresas: Record<string, number>;
  nivel_mas_demandado: Record<string, number>;
};

export default function ExperienceEmpresaVisual({ data }: { data: ExperienceEmpresaStats }) {
  const expRows = Object.entries(data.top_experiencia_empresas)
    .map(([empresa, exp]) => ({ empresa, exp }))
    .sort((a, b) => a.exp - b.exp);

  const nivelRows = Object.entries(data.nivel_mas_demandado).map(
    ([nivel, count]) => ({ nivel, count })
  );

  return (
    <section className="w-full max-w-6xl rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
      <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight text-white">
        {data.metrica}
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <h2 className="mb-3 text-sm font-medium text-neutral-300">
            Top empresas por experiencia requerida
          </h2>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expRows} layout="vertical" margin={{ top: 8, right: 20, left: 160, bottom: 8 }}>
                <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
                <XAxis type="number" stroke="#a3a3a3" label={{ value: "anos", position: "bottom", fill: "#a3a3a3" }} />
                <YAxis dataKey="empresa" type="category" width={160} stroke="#d4d4d4" tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v} anos`, ""]} />
                <Bar dataKey="exp" fill={BRAND_CHART_COLORS[1]} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <h2 className="mb-3 text-sm font-medium text-neutral-300">
            Nivel mas demandado
          </h2>
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={nivelRows} margin={{ top: 8, right: 20, left: 8, bottom: 8 }}>
                <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
                <XAxis dataKey="nivel" stroke="#a3a3a3" tick={{ fontSize: 11 }} />
                <YAxis stroke="#a3a3a3" allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {nivelRows.map((_, i) => (
                    <Cell key={i} fill={BRAND_CHART_COLORS[i % BRAND_CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BRAND_CHART_COLORS } from "./chart-colors";

type EmpresaStats = {
  metrica: string;
  total_empresas_unicas: number;
  top_10_empresas: Record<string, number>;
  ratio_nulos_empresa: string;
  total_empresas_solo_ingles: number;
  empresas_solo_ingles: string[];
  analisis_larga_cola: {
    empresas_con_una_oferta: number;
    porcentaje_larga_cola: string;
  };
};

export default function EmpresaVisual({ data }: { data: EmpresaStats }) {
  const topRows = Object.entries(data.top_10_empresas)
    .map(([empresa, ofertas]) => ({ empresa, ofertas }))
    .sort((a, b) => a.ofertas - b.ofertas);

  const unaOferta = data.analisis_larga_cola.empresas_con_una_oferta;
  const recurrentes = Math.max(data.total_empresas_unicas - unaOferta, 0);
  const colaRows = [
    { name: "Una oferta", value: unaOferta },
    { name: "Recurrentes", value: recurrentes },
  ];

  return (
    <section className="w-full max-w-6xl rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
      <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight text-white">
        {data.metrica}
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Empresas únicas</p>
          <p className="text-3xl font-semibold text-white">{data.total_empresas_unicas}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Ratio nulos empresa</p>
          <p className="text-3xl font-semibold text-white">{data.ratio_nulos_empresa}</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Empresas solo ingles</p>
          <p className="text-3xl font-semibold text-white">{data.total_empresas_solo_ingles}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4 lg:col-span-2">
          <h2 className="mb-3 text-sm font-medium text-neutral-300">Top 10 empresas</h2>
          <div className="h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topRows} layout="vertical" margin={{ top: 8, right: 20, left: 24, bottom: 8 }}>
                <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
                <XAxis type="number" stroke="#a3a3a3" />
                <YAxis dataKey="empresa" type="category" width={180} stroke="#d4d4d4" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="ofertas" fill={BRAND_CHART_COLORS[0]} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <h2 className="mb-3 text-sm font-medium text-neutral-300">Larga cola</h2>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={colaRows}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={84}
                  label={({ value }) => `${value}`}
                  labelLine={false}
                >
                  {colaRows.map((entry, index) => (
                    <Cell key={entry.name} fill={BRAND_CHART_COLORS[index % BRAND_CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-sm text-neutral-300">
            Porcentaje larga cola: {data.analisis_larga_cola.porcentaje_larga_cola}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-neutral-950 p-4">
        <h2 className="mb-3 text-sm font-medium text-neutral-300">Empresas solo ingles</h2>
        <ul className="list-inside list-disc space-y-1 text-sm text-neutral-200">
          {data.empresas_solo_ingles.map((empresa) => (
            <li key={empresa}>{empresa}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

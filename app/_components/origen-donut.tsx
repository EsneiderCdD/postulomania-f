"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { BRAND_CHART_COLORS } from "./chart-colors";

type OrigenStats = {
  metrica: string;
  frecuencia: Record<string, number>;
  distribucion_porcentaje: Record<string, number>;
  moda: string;
  ratio_nulos: string;
};

type ChartRow = {
  name: string;
  value: number;
  count: number;
};

function percentLabel(value: number) {
  return `${value.toFixed(1)}%`;
}

export default function OrigenDonut({ data }: { data: OrigenStats }) {
  const rows: ChartRow[] = Object.entries(data.distribucion_porcentaje).map(
    ([name, value]) => ({
      name,
      value,
      count: data.frecuencia[name] ?? 0,
    }),
  );

  return (
    <section className="w-full max-w-4xl rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
      <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight text-white">
        {data.metrica}
      </h1>

      <div className="h-[480px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 20, bottom: 55, left: 20 }}>
            <Pie
              data={rows}
              dataKey="value"
              nameKey="name"
              innerRadius={95}
              outerRadius={170}
              stroke="#0a0a0a"
              strokeWidth={3}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
                const x = Number(cx) + radius * Math.cos((-midAngle * Math.PI) / 180);
                const y = Number(cy) + radius * Math.sin((-midAngle * Math.PI) / 180);
                return (
                  <text
                    x={x}
                    y={y}
                    fill="#ffffff"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={22}
                    fontWeight={700}
                  >
                    {percentLabel(Number(value))}
                  </text>
                );
              }}
              labelLine={false}
            >
              {rows.map((entry, index) => (
                <Cell key={entry.name} fill={BRAND_CHART_COLORS[index % BRAND_CHART_COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value: number, _name, item) => [
                `${Number(value).toFixed(1)}% (${item.payload.count} ofertas)`,
                item.payload.name,
              ]}
            />

            <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" fill="#fafafa" fontSize={34} fontWeight={700}>
              {data.moda}
            </text>
            <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle" fill="#a3a3a3" fontSize={14}>
              Portal dominante
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-200">
        {rows.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: BRAND_CHART_COLORS[index % BRAND_CHART_COLORS.length] }}
            />
            <span>
              {entry.name} ({entry.count} ofertas)
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

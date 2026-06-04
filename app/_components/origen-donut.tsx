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

export type DonutStats = {
  totalHistorico: number;
  totalPostulaciones: number;
  tasaPostulacion: string;
  promedioDiario: number;
  maxDiario: number;
  minDiario: number;
};

function percentLabel(value: number) {
  return `${value.toFixed(1)}%`;
}

export default function OrigenDonut({
  data,
  compact,
  stats,
}: {
  data: OrigenStats;
  compact?: boolean;
  stats?: DonutStats;
}) {
  const rows: ChartRow[] = Object.entries(data.distribucion_porcentaje).map(
    ([name, value]) => ({
      name,
      value,
      count: data.frecuencia[name] ?? 0,
    }),
  );

  const chartHeight = compact ? 260 : 480;
  const innerR = compact ? 58 : 95;
  const outerR = compact ? 98 : 170;
  const labelFz = compact ? 14 : 22;
  const centerFz = compact ? 24 : 34;
  const subFz = compact ? 12 : 14;
  const sw = compact ? 2 : 3;
  const headingClass = compact
    ? "mb-3 text-center text-lg font-semibold tracking-tight text-white"
    : "mb-6 text-center text-3xl font-semibold tracking-tight text-white";
  const wrapperClass = compact
    ? "rounded-xl border border-white/10 bg-neutral-950 p-4"
    : "w-full max-w-4xl rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl";
  const legendClass = compact
    ? "mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-300"
    : "mt-2 flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-200";

  const bottomMargin = compact ? 40 : 55;

  return (
    <section className={wrapperClass}>
      <h1 className={headingClass}>{data.metrica}</h1>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 0, height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 8, right: 8, bottom: bottomMargin, left: 8 }}>
              <Pie
                data={rows}
                dataKey="value"
                nameKey="name"
                innerRadius={innerR}
                outerRadius={outerR}
                stroke="#0a0a0a"
                strokeWidth={sw}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                  const iR = Number(innerRadius);
                  const oR = Number(outerRadius);
                  const radius = iR + (oR - iR) * 0.5;
                  const x = Number(cx) + radius * Math.cos((-(midAngle ?? 0) * Math.PI) / 180);
                  const y = Number(cy) + radius * Math.sin((-(midAngle ?? 0) * Math.PI) / 180);
                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#ffffff"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={labelFz}
                      fontWeight={700}
                    >
                      {percentLabel(Number(value))}
                    </text>
                  );
                }}
                labelLine={false}
              >
                {rows.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={BRAND_CHART_COLORS[index % BRAND_CHART_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, _name, item) => [
                  `${Number(value).toFixed(1)}% (${item.payload.count} ofertas)`,
                  item.payload.name,
                ]}
              />

              <text
                x="50%"
                y="47%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#fafafa"
                fontSize={centerFz}
                fontWeight={700}
              >
                {data.moda}
              </text>
              <text
                x="50%"
                y={compact ? "55%" : "56%"}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#a3a3a3"
                fontSize={subFz}
              >
                Portal dominante
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {stats && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 7,
              flexShrink: 0,
              minWidth: 125,
            }}
          >
            <MiniStat label="Total histórico" value={stats.totalHistorico} />
            <MiniStat label="Total postulaciones" value={stats.totalPostulaciones} />
            <MiniStat label="Tasa postulación" value={stats.tasaPostulacion} />
            <MiniStat label="Promedio diario" value={stats.promedioDiario} />
            <MiniStat label="Máximo diario" value={stats.maxDiario} />
            <MiniStat label="Mínimo diario" value={stats.minDiario} />
          </div>
        )}
      </div>

      <div className={legendClass}>
        {rows.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-sm"
              style={{
                backgroundColor: BRAND_CHART_COLORS[index % BRAND_CHART_COLORS.length],
              }}
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

function MiniStat({ label, value }: { label: string; value: string | number }) {
  const formatted =
    typeof value === "number" && !Number.isInteger(value) ? value.toFixed(1) : value;

  return (
    <div>
      <span style={{ color: "#a3a3a3", fontSize: 11 }}>{label}</span>
      <br />
      <span style={{ color: "#f5f5f5", fontSize: 14, fontWeight: 600 }}>{formatted}</span>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BRAND_CHART_COLORS } from "./chart-colors";

type TimelineStats = {
  metrica: string;
  serie: Array<{
    fecha: string;
    total: number;
    origenes: Record<string, number>;
  }>;
  resumen: {
    total_historico: number;
    primer_dia: string | null;
    ultimo_dia: string | null;
    dias_con_datos: number;
    promedio_diario: number;
    mediana_diaria: number;
  };
};

export default function HomeForex({ data }: { data: TimelineStats }) {
  const { serie, resumen } = data;

  const chartData = useMemo(() => {
    return serie.reduce<
      Array<{ fecha: string; total: number; acumulado: number }>
    >((acc, d) => {
      const prev = acc.length > 0 ? acc[acc.length - 1].acumulado : 0;
      acc.push({ fecha: d.fecha, total: d.total, acumulado: prev + d.total });
      return acc;
    }, []);
  }, [serie]);

  const maxDiario = useMemo(() => {
    if (serie.length === 0) return 0;
    return Math.max(...serie.map((d) => d.total));
  }, [serie]);

  const minDiario = useMemo(() => {
    if (serie.length === 0) return 0;
    return Math.min(...serie.map((d) => d.total));
  }, [serie]);

  const hoyTotal = serie.length > 0 ? serie[serie.length - 1].total : 0;
  const hasData = serie.length > 0;

  return (
    <main className="flex min-h-screen items-start justify-center bg-neutral-950 px-4 py-10 text-neutral-100">
      <div className="w-full max-w-6xl">
        <section className="rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
          <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight text-white">
            {data.metrica}
          </h1>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <KpiCard label="Total histórico" value={resumen.total_historico} />
            <KpiCard label="Hoy" value={hoyTotal} />
            <KpiCard label="Promedio diario" value={resumen.promedio_diario} />
            <KpiCard label="Máximo diario" value={maxDiario} />
            <KpiCard label="Mínimo diario" value={minDiario} />
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-neutral-950 p-4">
            <h2 className="mb-3 text-sm font-medium text-neutral-300">
              Seguimiento diario
            </h2>
            <div className="h-[420px]">
              {hasData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={chartData}
                    margin={{ top: 8, right: 20, left: 8, bottom: 8 }}
                  >
                    <defs>
                      <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={BRAND_CHART_COLORS[0]} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={BRAND_CHART_COLORS[0]} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="fecha"
                      stroke="#a3a3a3"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(d: string) => {
                        const [, m, day] = d.split("-");
                        return `${day}/${m}`;
                      }}
                    />
                    <YAxis yAxisId="left" stroke={BRAND_CHART_COLORS[0]} tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" stroke={BRAND_CHART_COLORS[3]} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#171717",
                        border: "1px solid #404040",
                        borderRadius: "8px",
                      }}
                      labelFormatter={(label) => `Fecha: ${label}`}
                      formatter={(_value, _name, item: { payload: { total: number; acumulado: number } }) => [
                        `${_name === "acumulado" ? item.payload.acumulado : item.payload.total} ofertas`,
                        _name === "acumulado" ? "Acumulado" : "Diario",
                      ]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="total"
                      name="Diario"
                      fill={BRAND_CHART_COLORS[3]}
                      radius={[4, 4, 0, 0]}
                      opacity={0.5}
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="acumulado"
                      name="Acumulado"
                      stroke={BRAND_CHART_COLORS[0]}
                      strokeWidth={2.5}
                      fill="url(#cumulativeGradient)"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-neutral-500">
                  Sin datos disponibles
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function KpiCard({ label, value }: { label: string; value: string | number }) {
  const formatted = typeof value === "number" && !Number.isInteger(value)
    ? value.toFixed(1)
    : value;

  return (
    <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
      <p className="text-sm text-neutral-400">{label}</p>
      <p className="text-2xl font-semibold text-white">{formatted}</p>
    </div>
  );
}

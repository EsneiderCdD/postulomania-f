"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BRAND_CHART_COLORS } from "./chart-colors";
import OrigenDonut from "./origen-donut";

type OrigenStats = {
  metrica: string;
  frecuencia: Record<string, number>;
  distribucion_porcentaje: Record<string, number>;
  moda: string;
  ratio_nulos: string;
};

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
  postulaciones: {
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
  comparativa: {
    hoy: {
      fecha: string;
      ofertas: number;
      postulaciones: number;
      tasa_postulacion: number;
    };
    historico: {
      total_ofertas: number;
      total_postulaciones: number;
      tasa_postulacion: number;
    };
  };
};

export default function HomeForex({ data, origen }: { data: TimelineStats; origen: OrigenStats }) {
  const { serie, resumen, postulaciones, comparativa } = data;

  const chartData = useMemo(() => {
    const map = new Map<string, { fecha: string; ofertas: number; postulaciones: number }>();
    serie.forEach((d) => {
      const entry = map.get(d.fecha) || { fecha: d.fecha, ofertas: 0, postulaciones: 0 };
      entry.ofertas = d.total;
      map.set(d.fecha, entry);
    });
    postulaciones.serie.forEach((d) => {
      const entry = map.get(d.fecha) || { fecha: d.fecha, ofertas: 0, postulaciones: 0 };
      entry.postulaciones = d.total;
      map.set(d.fecha, entry);
    });
    return Array.from(map.values());
  }, [serie, postulaciones.serie]);

  const maxDiario = useMemo(() => {
    if (serie.length === 0) return 0;
    return Math.max(...serie.map((d) => d.total));
  }, [serie]);

  const minDiario = useMemo(() => {
    if (serie.length === 0) return 0;
    return Math.min(...serie.map((d) => d.total));
  }, [serie]);

  const hasData = serie.length > 0;

  return (
    <main className="flex min-h-screen items-start justify-center bg-neutral-950 px-4 py-10 text-neutral-100">
      <div className="w-full max-w-6xl">
        <section className="rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
          <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight text-white">
            {data.metrica}
          </h1>

          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <OrigenDonut data={origen} compact />

            <div className="grid grid-cols-2 gap-3">
                <KpiCard label="Total histórico" value={resumen.total_historico} />
                <KpiCard label="Total postulaciones" value={postulaciones.resumen.total_historico} />
                <KpiCard label="Tasa postulación" value={`${comparativa.historico.tasa_postulacion}%`} />
                <KpiCard label="Promedio diario" value={resumen.promedio_diario} />
                <KpiCard label="Máximo diario" value={maxDiario} />
                <KpiCard label="Mínimo diario" value={minDiario} />
              </div>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-neutral-950 p-4">
            <h2 className="mb-3 text-sm font-medium text-neutral-300">
              Seguimiento diario
            </h2>
            <div className="h-[420px]">
              {hasData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 8, right: 20, left: 8, bottom: 8 }}
                  >
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
                    <YAxis stroke={BRAND_CHART_COLORS[0]} tick={{ fontSize: 11 }} />
                    <Tooltip content={<OverlayTooltip />} />
                    <Bar
                      dataKey="ofertas"
                      name="Ofertas"
                      fill={BRAND_CHART_COLORS[0]}
                      shape={<OverlayBar />}
                      isAnimationActive={false}
                    />
                  </BarChart>
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

function OverlayBar(props: Record<string, unknown>) {
  const x = Number(props.x);
  const y = Number(props.y);
  const width = Number(props.width);
  const height = Number(props.height);
  const payload = props.payload as { ofertas: number; postulaciones: number } | undefined;

  if (!payload || payload.ofertas === 0) return null;

  const ratio = payload.ofertas > 0 ? payload.postulaciones / payload.ofertas : 0;
  const innerWidth = Math.max(width * 0.9, 8);
  const innerHeight = height * Math.min(ratio, 1);
  const innerX = x + (width - innerWidth) / 2;
  const innerY = y + height - innerHeight;

  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={BRAND_CHART_COLORS[0]} rx={4} />
      {ratio > 0 && (
        <rect
          x={innerX}
          y={innerY}
          width={innerWidth}
          height={Math.max(innerHeight, 1)}
          fill={BRAND_CHART_COLORS[1]}
          rx={3}
        />
      )}
    </g>
  );
}

function OverlayTooltip(props: Record<string, unknown>) {
  const active = props.active as boolean | undefined;
  const payload = props.payload as Array<{ payload: { fecha: string; ofertas: number; postulaciones: number } }> | undefined;

  if (!active || !payload || payload.length === 0) return null;

  const { fecha, ofertas, postulaciones } = payload[0].payload;

  return (
    <div
      style={{
        backgroundColor: "#171717",
        border: "1px solid #404040",
        borderRadius: "8px",
        padding: "8px 12px",
        fontSize: 13,
        lineHeight: 1.6,
      }}
    >
      <p style={{ color: "#a3a3a3", margin: 0 }}>{`Fecha: ${fecha}`}</p>
      <p style={{ color: BRAND_CHART_COLORS[0], margin: "2px 0 0" }}>{`Ofertas: ${ofertas}`}</p>
      <p style={{ color: BRAND_CHART_COLORS[1], margin: "2px 0 0" }}>{`Postulaciones: ${postulaciones}`}</p>
    </div>
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

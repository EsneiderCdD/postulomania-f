"use client";

import {
  Area,
  AreaChart,
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

type TimingStats = {
  metrica: string;
  volumen_por_dia: Record<string, number>;
  frecuencia_por_hora: Record<string, number>;
  recencia: { ultimas_24h: number; ultimas_48h: number };
  antiguedad_maxima_dias: number;
  dia_pico_absoluto: string;
  fuga_fin_de_semana: string;
};

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DAY_LABELS: Record<string, string> = {
  Monday: "Lun",
  Tuesday: "Mar",
  Wednesday: "Mié",
  Thursday: "Jue",
  Friday: "Vie",
  Saturday: "Sáb",
  Sunday: "Dom",
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function TimingVisual({ data }: { data: TimingStats }) {
  const dayRows = DAY_ORDER.map((day) => ({
    day: DAY_LABELS[day],
    dayFull: day,
    count: data.volumen_por_dia[day] ?? 0,
  }));

  const hourRows = HOURS.map((h) => {
    const key = `${String(h).padStart(2, "0")}:00`;
    return {
      hour: `${h}h`,
      count: data.frecuencia_por_hora[key] ?? 0,
    };
  });

  return (
    <section className="w-full max-w-6xl rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
      <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight text-white">
        {data.metrica}
      </h1>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Últimas 24h</p>
          <p className="text-3xl font-semibold text-white">
            {data.recencia.ultimas_24h}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Últimas 48h</p>
          <p className="text-3xl font-semibold text-white">
            {data.recencia.ultimas_48h}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Antigüedad máxima</p>
          <p className="text-3xl font-semibold text-white">
            {data.antiguedad_maxima_dias}
          </p>
          <p className="mt-1 text-xs text-neutral-500">días</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Día pico</p>
          <p className="text-3xl font-semibold text-white">
            {data.dia_pico_absoluto}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-neutral-950 p-4">
        <p className="text-sm text-neutral-400">Fuga fin de semana</p>
        <p className="text-3xl font-semibold text-white">
          {data.fuga_fin_de_semana}
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-neutral-950 p-4">
        <h2 className="mb-3 text-sm font-medium text-neutral-300">
          Volumen por día
        </h2>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dayRows}
              margin={{ top: 8, right: 20, left: 8, bottom: 8 }}
            >
              <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                stroke="#a3a3a3"
                tick={{ fontSize: 12 }}
              />
              <YAxis stroke="#a3a3a3" allowDecimals={false} />
              <Tooltip
                formatter={(_value: number, _name: string, item) => [
                  `${item.payload.count} ofertas`,
                  item.payload.dayFull,
                ]}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {dayRows.map((d) => {
                  const isWeekend = d.dayFull === "Saturday" || d.dayFull === "Sunday";
                  return (
                    <Cell
                      key={d.day}
                      fill={
                        isWeekend
                          ? BRAND_CHART_COLORS[2]
                          : BRAND_CHART_COLORS[0]
                      }
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-neutral-950 p-4">
        <h2 className="mb-3 text-sm font-medium text-neutral-300">
          Frecuencia por hora
        </h2>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={hourRows}
              margin={{ top: 8, right: 20, left: 0, bottom: 8 }}
            >
              <defs>
                <linearGradient id="hourGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={BRAND_CHART_COLORS[3]}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={BRAND_CHART_COLORS[3]}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
                stroke="#a3a3a3"
                tick={{ fontSize: 11 }}
                interval={2}
              />
              <YAxis stroke="#a3a3a3" allowDecimals={false} />
              <Tooltip
                formatter={(value: number) => [`${value} ofertas`, ""]}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke={BRAND_CHART_COLORS[3]}
                fill="url(#hourGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

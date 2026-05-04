"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BRAND_CHART_COLORS } from "./chart-colors";

type OrigenTimingStats = {
  metrica: string;
  volumen_por_dia_por_origen: Record<string, Record<string, number>>;
  dia_pico_por_origen: Record<string, string>;
  fuga_finde_por_origen: Record<string, string>;
};

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_LABELS: Record<string, string> = {
  Monday: "Lun", Tuesday: "Mar", Wednesday: "Mie", Thursday: "Jue",
  Friday: "Vie", Saturday: "Sab", Sunday: "Dom",
};

export default function OrigenTimingVisual({ data }: { data: OrigenTimingStats }) {
  const origins = Object.keys(data.volumen_por_dia_por_origen);

  const allRows: Record<string, Record<string, number>> = {};
  origins.forEach((o) => {
    allRows[o] = {};
    DAY_ORDER.forEach((d) => {
      allRows[o][d] = data.volumen_por_dia_por_origen[o]?.[d] ?? 0;
    });
  });

  const chartData = DAY_ORDER.map((d) => {
    const row: Record<string, string | number> = { day: DAY_LABELS[d] };
    origins.forEach((o) => {
      row[o] = allRows[o][d];
    });
    return row;
  });

  return (
    <section className="w-full max-w-6xl rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
      <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight text-white">
        {data.metrica}
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        {origins.map((origen) => (
          <div key={origen} className="rounded-xl border border-white/10 bg-neutral-950 p-4">
            <p className="text-sm text-neutral-400">{origen}</p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {data.dia_pico_por_origen[origen]}
            </p>
            <p className="text-xs text-neutral-500">dia pico</p>
            <p className="mt-2 text-sm text-neutral-300">
              Fuga finde: {data.fuga_finde_por_origen[origen]}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-neutral-950 p-4">
        <h2 className="mb-3 text-sm font-medium text-neutral-300">
          Volumen por dia y origen
        </h2>
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 20, left: 8, bottom: 8 }}>
              <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="#a3a3a3" tick={{ fontSize: 12 }} />
              <YAxis stroke="#a3a3a3" allowDecimals={false} />
              <Tooltip />
              <Legend wrapperStyle={{ color: "#d4d4d4", fontSize: 12 }} />
        {origins.map((origen, i) => (
                <Bar key={origen} dataKey={origen} fill={BRAND_CHART_COLORS[i % BRAND_CHART_COLORS.length]} radius={[6, 6, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

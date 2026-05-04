"use client";

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

type ExperienceTimingStats = {
  metrica: string;
  promedio_exp_por_dia: Record<string, number>;
  mediana_exp_por_dia: Record<string, number>;
  dia_con_mas_experiencia_promedio: string | null;
};

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_LABELS: Record<string, string> = {
  Monday: "Lun", Tuesday: "Mar", Wednesday: "Mie", Thursday: "Jue",
  Friday: "Vie", Saturday: "Sab", Sunday: "Dom",
};

export default function ExperienceTimingVisual({ data }: { data: ExperienceTimingStats }) {
  const rows = DAY_ORDER.map((d) => ({
    day: DAY_LABELS[d],
    dayFull: d,
    promedio: data.promedio_exp_por_dia[d] ?? 0,
    mediana: data.mediana_exp_por_dia[d] ?? 0,
  }));

  return (
    <section className="w-full max-w-6xl rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
      <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight text-white">
        {data.metrica}
      </h1>

      <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
        <p className="text-sm text-neutral-400">
          Dia con mas experiencia promedio:{" "}
          <span className="font-semibold text-white">
            {data.dia_con_mas_experiencia_promedio ?? "—"}
          </span>
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-neutral-950 p-4">
        <h2 className="mb-3 text-sm font-medium text-neutral-300">
          Experiencia promedio y mediana por dia
        </h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} margin={{ top: 8, right: 20, left: 8, bottom: 8 }}>
              <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="#a3a3a3" tick={{ fontSize: 12 }} />
              <YAxis stroke="#a3a3a3" />
              <Tooltip />
              <Bar dataKey="promedio" name="Promedio" fill={BRAND_CHART_COLORS[0]} radius={[6, 6, 0, 0]} />
              <Bar dataKey="mediana" name="Mediana" fill={BRAND_CHART_COLORS[3]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

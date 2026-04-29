"use client";

import { BRAND_CHART_COLORS } from "./chart-colors";

type ExperienceStats = {
  metrica: string;
  promedio: number;
  mediana: number;
  moda: number;
  volatilidad_std: number;
  tasa_entry_level: string;
  distribucion_niveles: Record<string, number>;
  correlacion_exp_vs_techs: number;
  extremos: {
    max_anios: number;
    techs_asociadas: string[];
  };
};

export default function ExperienceVisual({ data }: { data: ExperienceStats }) {
  const levels = Object.entries(data.distribucion_niveles).map(
    ([name, count]) => ({ name, count })
  );
  const total = levels.reduce((sum, l) => sum + l.count, 0);

  return (
    <section className="w-full max-w-6xl rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
      <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight text-white">
        {data.metrica}
      </h1>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Promedio</p>
          <p className="text-3xl font-semibold text-white">{data.promedio}</p>
          <p className="mt-1 text-xs text-neutral-500">años</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Mediana</p>
          <p className="text-3xl font-semibold text-white">{data.mediana}</p>
          <p className="mt-1 text-xs text-neutral-500">años</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Moda</p>
          <p className="text-3xl font-semibold text-white">{data.moda}</p>
          <p className="mt-1 text-xs text-neutral-500">años</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Volatilidad</p>
          <p className="text-3xl font-semibold text-white">
            {data.volatilidad_std}
          </p>
          <p className="mt-1 text-xs text-neutral-500">std dev</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Tasa entry-level</p>
          <p className="text-3xl font-semibold text-white">
            {data.tasa_entry_level}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Correlación exp vs techs</p>
          <p className="text-3xl font-semibold text-white">
            {data.correlacion_exp_vs_techs}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-medium text-neutral-300">
          Distribución de niveles
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {levels.map((level, i) => {
            const pct = (level.count / total) * 100;
            const color =
              BRAND_CHART_COLORS[i % BRAND_CHART_COLORS.length];

            return (
              <div
                key={level.name}
                className="rounded-xl border border-white/10 bg-neutral-950 p-5"
              >
                <p className="text-sm text-neutral-400">{level.name}</p>
                <p className="mt-1 text-3xl font-semibold text-white">
                  {level.count}
                </p>
                <p className="mb-3 text-xs text-neutral-500">
                  {pct.toFixed(0)}% del total
                </p>
                <div className="h-2 w-full rounded-full bg-neutral-800">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-neutral-950 p-5">
        <p className="text-sm text-neutral-400">Oferta extrema</p>
        <p className="mt-1 text-4xl font-bold text-white">
          {data.extremos.max_anios} años
        </p>
        <p className="mt-1 text-sm text-neutral-500">Máximo registrado</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {data.extremos.techs_asociadas.map((tech) => (
            <span
              key={tech}
              className="rounded-lg border border-white/10 bg-neutral-900 px-3 py-1 text-sm text-neutral-200"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

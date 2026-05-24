"use client";

import { useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { MapaResponse } from "./mapa-ofertas";
import { BRAND_CHART_COLORS } from "./chart-colors";

export default function TechRadarHome({ data }: { data: MapaResponse }) {
  const radarData = useMemo(() => {
    const freq: Record<string, number> = {};

    for (const empresa of data.empresas) {
      for (const oferta of empresa.ofertas) {
        for (const tech of oferta.tecnologias) {
          freq[tech] = (freq[tech] || 0) + 1;
        }
      }
    }

    return Object.entries(freq)
      .map(([tech, count]) => ({ tech, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const hasData = radarData.length > 0;

  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-900 shadow-xl overflow-hidden">
      <h2 className="px-6 pt-6 text-lg font-semibold text-white">
        Stack Tecnológico &mdash; Ofertas Antioquia
      </h2>
      <p className="px-6 text-sm text-neutral-400">
        {radarData.length} tecnología{radarData.length !== 1 ? "s" : ""} en {data.total} empresa{data.total !== 1 ? "s" : ""}
      </p>
      <div className="p-6">
        <div className="h-[500px] w-full">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={radarData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <PolarGrid stroke="#262626" />
                <PolarAngleAxis
                  dataKey="tech"
                  stroke="#a3a3a3"
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `${value} oferta${value !== 1 ? "s" : ""}`,
                    "Frecuencia",
                  ]}
                  contentStyle={{
                    backgroundColor: "#171717",
                    border: "1px solid #404040",
                    borderRadius: "8px",
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "#a3a3a3" }}
                />
                <Radar
                  name="Ofertas Antioquia"
                  dataKey="count"
                  stroke={BRAND_CHART_COLORS[0]}
                  fill={BRAND_CHART_COLORS[0]}
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-neutral-500">
              Sin datos de tecnologías disponibles
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

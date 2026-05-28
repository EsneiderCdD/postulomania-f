"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BRAND_CHART_COLORS } from "../_components/chart-colors";

const canalesContacto = [
  { key: "correo", label: "Correo", icon: "✉" },
  { key: "red-social", label: "Red Social", icon: "👤" },
  { key: "telefono", label: "Teléfono", icon: "📞" },
];

const empresas = [
  { id: 21, nombre: "Agencia De Empleo Comfama" },
  { id: 22, nombre: "Asignar" },
  { id: 23, nombre: "Crecer Capital Holdings" },
  { id: 24, nombre: "Deltawits" },
  { id: 25, nombre: "Estrategia Segura" },
  { id: 26, nombre: "Pragma S.A." },
  { id: 27, nombre: "Solvo" },
  { id: 28, nombre: "Tangible" },
];

const ofertas = [
  { id: 10, titulo: "Desarrollador de Software", compatibilidad: 36, postulado: false },
  { id: 11, titulo: "Analista de Sistemas", compatibilidad: 52, postulado: true },
  { id: 12, titulo: "Ingeniero DevOps", compatibilidad: 28, postulado: false },
];

const techData = [
  { tech: "JavaScript", ofertas: 3 },
  { tech: "React", ofertas: 3 },
  { tech: "Python", ofertas: 2 },
  { tech: "SQL", ofertas: 2 },
  { tech: "Node.js", ofertas: 1 },
  { tech: ".NET", ofertas: 1 },
  { tech: "AWS", ofertas: 1 },
];

export default function SeguimientosPanel() {
  const [contactoActivo, setContactoActivo] = useState<string | null>(null);

  const contactoTitulo =
    canalesContacto.find((c) => c.key === contactoActivo)?.label ?? "";

  return (
    <div className="flex flex-col gap-6">
    <section className="flex gap-6">
      <div className="flex w-64 shrink-0 flex-col gap-2">
        {empresas.map((empresa) => (
          <div
            key={empresa.id}
            className="rounded-xl border border-white/10 bg-neutral-950 px-5 py-4 transition-colors hover:border-white/20 hover:bg-neutral-900/80"
          >
            <p className="text-sm font-medium text-white">{empresa.nombre}</p>
          </div>
        ))}
      </div>

      <div className="min-h-[600px] flex-1 rounded-2xl border border-white/10 bg-neutral-900">
        <div className="flex flex-col">
          <div className="flex items-center gap-5 border-b border-white/10 px-6 py-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-2xl text-neutral-500">
              A
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">
                Agencia De Empleo Comfama
              </h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-neutral-500">Agencia / Empresa</span>
                <span className="text-neutral-300">Agencia</span>
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="flex-1 border-r border-white/10 px-6 py-4">
              <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                Ofertas
              </h4>
              <div className="flex flex-col gap-1">
                {ofertas.map((oferta) => (
                  <div
                    key={oferta.id}
                    className="flex items-center gap-4 rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.03]"
                  >
                    <span className="w-10 text-xs text-neutral-600">
                      #{oferta.id}
                    </span>
                    <span className="flex-1 text-sm text-neutral-200">
                      {oferta.titulo}
                    </span>
                    <span className="w-14 text-center text-sm text-neutral-400">
                      {oferta.compatibilidad}%
                    </span>
                    {oferta.postulado ? (
                      <span className="w-20 text-center text-xs font-medium text-green-400">
                        Postulado
                      </span>
                    ) : (
                      <span className="w-20 text-center text-xs text-neutral-600">
                        —
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex w-52 shrink-0 flex-col gap-2 px-4 py-4">
              <a
                href="https://www.comfama.com/servicio-de-empleo/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-white/10 px-4 py-2 text-center text-xs text-neutral-400 transition-colors hover:border-white/30 hover:text-neutral-200"
              >
                Link
              </a>
              <button className="rounded-lg border border-white/10 px-4 py-2 text-xs text-neutral-400 transition-colors hover:border-white/30 hover:text-neutral-200">
                Laboratorio de ofertas
              </button>
            </div>
          </div>

          <div className="flex flex-col border-t border-white/10">
            <div className="px-6 py-4">
              <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                Tecnologías solicitadas
              </h4>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={techData}
                    layout="vertical"
                    margin={{ top: 4, right: 20, left: 70, bottom: 4 }}
                  >
                    <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
                    <XAxis type="number" stroke="#a3a3a3" allowDecimals={false} />
                    <YAxis
                      dataKey="tech"
                      type="category"
                      width={70}
                      stroke="#d4d4d4"
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip />
                    <Bar dataKey="ofertas" radius={[0, 6, 6, 0]}>
                      {techData.map((_, index) => (
                        <Cell
                          key={index}
                          fill={BRAND_CHART_COLORS[index % BRAND_CHART_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-1 text-right text-[10px] text-neutral-600">
                Suma de tecnologías × ofertas de esta empresa
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 border-t border-white/10 px-6 py-4">
              <div className="rounded-xl border border-white/10 bg-neutral-950 p-3">
                <p className="text-xs text-neutral-500">Compatibilidad promedio</p>
                <p className="mt-1 text-xl font-semibold text-white">38%</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-neutral-950 p-3">
                <p className="text-xs text-neutral-500">Rango de experiencia</p>
                <p className="mt-1 text-xl font-semibold text-white">2 – 5 años</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-neutral-950 p-3">
                <p className="text-xs text-neutral-500">Inglés requerido</p>
                <p className="mt-1 text-xl font-semibold text-white">33%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="flex gap-6">
      <div className="flex w-64 shrink-0 flex-col gap-2">
        <h3 className="mb-1 text-xs font-medium uppercase tracking-wider text-neutral-500 px-1">
          Contactar
        </h3>
        {canalesContacto.map((canal) => (
          <button
            key={canal.key}
            onClick={() =>
              setContactoActivo(contactoActivo === canal.key ? null : canal.key)
            }
            className={`rounded-xl border px-5 py-4 text-left transition-colors ${
              contactoActivo === canal.key
                ? "border-amber-500/40 bg-amber-500/5 text-amber-300"
                : "border-white/10 bg-neutral-950 text-white hover:border-white/20 hover:bg-neutral-900/80"
            }`}
          >
            <span className="text-sm font-medium">
              {canal.icon} {canal.label}
            </span>
          </button>
        ))}
      </div>

      <div className="min-h-[300px] flex-1 rounded-2xl border border-white/10 bg-neutral-900">
        {contactoActivo ? (
          <div className="flex flex-col">
            <div className="border-b border-white/10 px-6 py-5">
              <h3 className="text-lg font-semibold text-white">
                {contactoTitulo}
              </h3>
            </div>
            <div className="min-h-[200px] px-6 py-6" />
          </div>
        ) : (
          <div className="flex h-full min-h-[300px] items-center justify-center text-sm text-neutral-600">
            Selecciona un canal de contacto
          </div>
        )}
      </div>
    </section>

    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
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
import {
  getSeguimientosEmpresas,
  getSeguimientoDetail,
  setEmpresaTipo,
  type SeguimientoEmpresa,
  type SeguimientoDetail,
} from "../actions";

const AVATAR_COLORS = [
  "#4C72B0",
  "#55A868",
  "#C44E52",
  "#8172B2",
  "#CCB974",
  "#64B5CD",
  "#E8A735",
  "#6D4C41",
];

const canalesContacto = [
  { key: "correo", label: "Correo", icon: "✉" },
  { key: "red-social", label: "Red Social", icon: "👤" },
  { key: "telefono", label: "Teléfono", icon: "📞" },
];

function avatarBg(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

export default function SeguimientosPanel() {
  const [empresas, setEmpresas] = useState<SeguimientoEmpresa[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<SeguimientoDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [contactoActivo, setContactoActivo] = useState<string | null>(null);

  useEffect(() => {
    getSeguimientosEmpresas().then((data) => {
      setEmpresas(data);
      if (data.length > 0) {
        setSelectedId((prev) => prev ?? data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedId == null) return;
    setDetailLoading(true);
    getSeguimientoDetail(selectedId).then((d) => {
      setDetail(d);
      setDetailLoading(false);
    });
  }, [selectedId]);

  const handleSetTipo = useCallback(
    async (tipo: string) => {
      if (!selectedId) return;
      const res = await setEmpresaTipo(selectedId, tipo);
      if (res) {
        setDetail((prev) =>
          prev
            ? { ...prev, empresa: { ...prev.empresa, tipo } }
            : prev
        );
        setEmpresas((prev) =>
          prev.map((e) => (e.id === selectedId ? { ...e, tipo } : e))
        );
      }
    },
    [selectedId]
  );

  const contactoTitulo =
    canalesContacto.find((c) => c.key === contactoActivo)?.label ?? "";

  const empresaActual = detail?.empresa ?? null;

  return (
    <div className="flex flex-col gap-6">
      <section className="flex gap-6">
        {/* --- LEFT COLUMN: Empresas en seguimiento --- */}
        <div className="flex w-64 shrink-0 flex-col gap-2">
          {empresas.map((empresa) => (
            <button
              key={empresa.id}
              onClick={() => setSelectedId(empresa.id)}
              className={`rounded-xl border px-5 py-4 text-left transition-colors ${
                selectedId === empresa.id
                  ? "border-amber-500/40 bg-amber-500/5 text-amber-300"
                  : "border-white/10 bg-neutral-950 text-white hover:border-white/20 hover:bg-neutral-900/80"
              }`}
            >
              <p className="text-sm font-medium">{empresa.nombre}</p>
            </button>
          ))}
          {empresas.length === 0 && (
            <p className="px-2 text-sm text-neutral-500">
              No hay empresas en seguimiento
            </p>
          )}
        </div>

        {/* --- RIGHT COLUMN: Detail --- */}
        <div className="min-h-[600px] flex-1 rounded-2xl border border-white/10 bg-neutral-900">
          {detailLoading ? (
            <div className="flex h-full min-h-[600px] items-center justify-center text-sm text-neutral-500">
              Cargando…
            </div>
          ) : empresaActual ? (
            <div className="flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-5 border-b border-white/10 px-6 py-6">
                {empresaActual.foto_url ? (
                  <img
                    src={empresaActual.foto_url}
                    alt={empresaActual.nombre}
                    className="h-16 w-16 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl font-semibold text-white"
                    style={{ backgroundColor: avatarBg(empresaActual.id) }}
                  >
                    {empresaActual.nombre.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">
                    {empresaActual.nombre}
                  </h3>
                  {empresaActual.tipo ? (
                    <span className="text-sm text-amber-300">
                      {empresaActual.tipo}
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-500">
                        Agencia / Empresa
                      </span>
                      <button
                        onClick={() => handleSetTipo("Agencia")}
                        className="rounded-lg border border-white/10 px-3 py-1 text-xs text-neutral-400 transition-colors hover:border-amber-500/40 hover:text-amber-300"
                      >
                        Agencia
                      </button>
                      <button
                        onClick={() => handleSetTipo("Empresa")}
                        className="rounded-lg border border-white/10 px-3 py-1 text-xs text-neutral-400 transition-colors hover:border-amber-500/40 hover:text-amber-300"
                      >
                        Empresa
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Ofertas + Actions */}
              <div className="flex">
                <div className="flex-1 border-r border-white/10 px-6 py-4">
                  <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Ofertas
                  </h4>
                  <div className="flex flex-col gap-1">
                    {detail!.ofertas.map((oferta) => (
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
                          {oferta.compatibilidad != null
                            ? `${Math.round(oferta.compatibilidad * 100)}%`
                            : "—"}
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
                    {detail!.ofertas.length === 0 && (
                      <p className="py-4 text-center text-sm text-neutral-600">
                        Sin ofertas registradas
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex w-52 shrink-0 flex-col gap-2 px-4 py-4">
                  <a
                    href={
                      detail!.ofertas[0]?.enlace
                        ? detail!.ofertas[0].enlace
                        : "#"
                    }
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

              {/* Tecnologías chart + Stats */}
              <div className="flex flex-col border-t border-white/10">
                <div className="px-6 py-4">
                  <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Tecnologías solicitadas
                  </h4>
                  <div className="h-[200px]">
                    {detail!.tecnologias.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={detail!.tecnologias}
                          layout="vertical"
                          margin={{ top: 4, right: 20, left: 70, bottom: 4 }}
                        >
                          <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
                          <XAxis
                            type="number"
                            stroke="#a3a3a3"
                            allowDecimals={false}
                          />
                          <YAxis
                            dataKey="tech"
                            type="category"
                            width={70}
                            stroke="#d4d4d4"
                            tick={{ fontSize: 11 }}
                          />
                          <Tooltip />
                          <Bar dataKey="ofertas" radius={[0, 6, 6, 0]}>
                            {detail!.tecnologias.map((_, index) => (
                              <Cell
                                key={index}
                                fill={
                                  BRAND_CHART_COLORS[
                                    index % BRAND_CHART_COLORS.length
                                  ]
                                }
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-neutral-600">
                        Sin tecnologías registradas
                      </div>
                    )}
                  </div>
                  <p className="mt-1 text-right text-[10px] text-neutral-600">
                    Suma de tecnologías × ofertas de esta empresa
                  </p>
                </div>

                {/* Stat cards - hardcoded as requested */}
                <div className="grid grid-cols-3 gap-3 border-t border-white/10 px-6 py-4">
                  <div className="rounded-xl border border-white/10 bg-neutral-950 p-3">
                    <p className="text-xs text-neutral-500">
                      Compatibilidad promedio
                    </p>
                    <p className="mt-1 text-xl font-semibold text-white">38%</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-neutral-950 p-3">
                    <p className="text-xs text-neutral-500">
                      Rango de experiencia
                    </p>
                    <p className="mt-1 text-xl font-semibold text-white">
                      2 – 5 años
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-neutral-950 p-3">
                    <p className="text-xs text-neutral-500">
                      Inglés requerido
                    </p>
                    <p className="mt-1 text-xl font-semibold text-white">33%</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[600px] items-center justify-center text-sm text-neutral-500">
              Selecciona una empresa
            </div>
          )}
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section className="flex gap-6">
        <div className="flex w-64 shrink-0 flex-col gap-2">
          <h3 className="mb-1 px-1 text-xs font-medium uppercase tracking-wider text-neutral-500">
            Contactar
          </h3>
          {canalesContacto.map((canal) => (
            <button
              key={canal.key}
              onClick={() =>
                setContactoActivo(
                  contactoActivo === canal.key ? null : canal.key
                )
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

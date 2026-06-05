"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
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
  getOferta,
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

const ESTADO_BADGE: Record<string, { bg: string; label: string }> = {
  frio: { bg: "#94a3b8", label: "Frío" },
  postulado: { bg: "#f8fafc", label: "Postulado" },
  hdv_vista: { bg: "#3b82f6", label: "HdV Vista" },
  finalista: { bg: "#4ade80", label: "Finalista" },
  finalizado: { bg: "#ef4444", label: "Finalizado" },
  suspendido: { bg: "#d97706", label: "Suspendido" },
};

const canalesContacto = [
  { key: "telefono", label: "Teléfono", icon: "📞" },
  { key: "correo", label: "Correo", icon: "✉" },
  { key: "red-social", label: "Red Social", icon: "👤" },
];

type FormFields = {
  [canal: string]: {
    numero?: string;
    email?: string;
    asunto?: string;
    usuario?: string;
    tipoMensaje?: "texto" | "nota-voz";
    speech?: string;
    contenido?: string;
    notas?: string;
  };
};

function avatarBg(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

export default function SeguimientosPanel() {
  const [empresas, setEmpresas] = useState<SeguimientoEmpresa[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<SeguimientoDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedOfertaId, setSelectedOfertaId] = useState<number | null>(null);
  const [ofertaTechs, setOfertaTechs] = useState<string[]>([]);
  const [canalesActivos, setCanalesActivos] = useState<Record<string, boolean>>(
    {}
  );
  const [formData, setFormData] = useState<FormFields>({});

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
    setSelectedOfertaId(null);
    getSeguimientoDetail(selectedId).then((d) => {
      setDetail(d);
      setDetailLoading(false);
      if (d && d.ofertas.length > 0) {
        setSelectedOfertaId(d.ofertas[0].id);
      }
    });
  }, [selectedId]);

  useEffect(() => {
    if (selectedOfertaId == null) {
      setOfertaTechs([]);
      return;
    }
    getOferta(selectedOfertaId).then((res) => {
      if (res && "tecnologias" in res) {
        setOfertaTechs(res.tecnologias ?? []);
      }
    });
  }, [selectedOfertaId]);

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

  const toggleCanal = useCallback((key: string) => {
    setCanalesActivos((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!next[key]) {
        setFormData((f) => {
          const copy = { ...f };
          delete copy[key];
          return copy;
        });
      } else {
        setFormData((f) => ({
          ...f,
          [key]: f[key] ?? {},
        }));
      }
      return next;
    });
  }, []);

  const updateFormField = (
    canal: string,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [canal]: { ...(prev[canal] ?? {}), [field]: value },
    }));
  };

  const empresaActual = detail?.empresa ?? null;
  const selectedOferta =
    detail?.ofertas.find((o) => o.id === selectedOfertaId) ?? null;

  const chartData = useMemo(() => {
    if (selectedOfertaId != null && ofertaTechs.length > 0) {
      return ofertaTechs.map((t) => ({ tech: t, ofertas: 1 }));
    }
    return detail?.tecnologias ?? [];
  }, [selectedOfertaId, ofertaTechs, detail?.tecnologias]);

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
              <div className="relative flex items-center gap-5 border-b border-white/10 px-6 py-6">
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
                <div className="absolute right-5 bottom-5 flex items-center gap-1.5 text-xs">
                  <span
                    className="inline-block rounded-full"
                    style={{
                      width: 8,
                      height: 8,
                      backgroundColor:
                        ESTADO_BADGE[empresaActual.estado_estrella]?.bg ?? ESTADO_BADGE["frio"].bg,
                      boxShadow: `0 0 4px 1px ${ESTADO_BADGE[empresaActual.estado_estrella]?.bg ?? ESTADO_BADGE["frio"].bg}80`,
                    }}
                  />
                  <span style={{ color: ESTADO_BADGE[empresaActual.estado_estrella]?.bg ?? ESTADO_BADGE["frio"].bg }}>
                    {ESTADO_BADGE[empresaActual.estado_estrella]?.label ?? ESTADO_BADGE["frio"].label}
                  </span>
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
                      <button
                        key={oferta.id}
                        onClick={() => setSelectedOfertaId(oferta.id)}
                        className={`flex items-center gap-4 rounded-lg px-3 py-2 text-left transition-colors ${
                          selectedOfertaId === oferta.id
                            ? "bg-amber-500/5 ring-1 ring-amber-500/20"
                            : "hover:bg-white/[0.03]"
                        }`}
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
                      </button>
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
                      selectedOferta?.enlace
                        ? selectedOferta.enlace
                        : "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-white/10 px-4 py-2 text-center text-xs text-neutral-400 transition-colors hover:border-white/30 hover:text-neutral-200"
                  >
                    Link
                  </a>
                  <Link
                    href={
                      selectedOferta?.id
                        ? `/laboratorio?ofertaId=${selectedOferta.id}`
                        : "/laboratorio"
                    }
                    className="rounded-lg border border-white/10 px-4 py-2 text-xs text-neutral-400 transition-colors hover:border-white/30 hover:text-neutral-200"
                  >
                    Laboratorio de ofertas
                  </Link>
                </div>
              </div>

              {/* Tecnologías chart + Stats */}
              <div className="flex flex-col border-t border-white/10">
                <div className="px-6 py-4">
                  <h4 className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
                    Tecnologías solicitadas
                  </h4>
                  <div className="h-[280px]">
                    {chartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartData}
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
                            {chartData.map((_, index) => (
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
                    {selectedOfertaId != null
                      ? "Tecnologías de la oferta seleccionada"
                      : "Suma de tecnologías × ofertas de esta empresa"}
                  </p>
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
      <section className="rounded-2xl border border-white/10 bg-neutral-900">
        <div className="flex items-center gap-6 border-b border-white/10 px-6 py-4">
          <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Contactar
          </h3>
          <div className="flex gap-2">
            {canalesContacto.map((canal) => (
              <button
                key={canal.key}
                onClick={() => toggleCanal(canal.key)}
                className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                  canalesActivos[canal.key]
                    ? "border-amber-500/40 bg-amber-500/5 text-amber-300"
                    : "border-white/10 text-neutral-400 hover:border-white/30 hover:text-neutral-200"
                }`}
              >
                {canal.icon} {canal.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-6">
          {Object.keys(canalesActivos).length === 0 ||
          Object.values(canalesActivos).every((v) => !v) ? (
            <p className="py-8 text-center text-sm text-neutral-600">
              Activa un canal de contacto para empezar
            </p>
          ) : (
            <div className="flex flex-col gap-8">
              {/* ---- Teléfono ---- */}
              {canalesActivos["telefono"] && (
                <div>
                  <h4 className="mb-4 flex items-center gap-2 text-sm font-medium text-amber-300">
                    <span>📞</span> Teléfono
                  </h4>
                  <div className="grid gap-4">
                    <div>
                      <label className="mb-1.5 block text-xs text-neutral-500">
                        Número de teléfono
                      </label>
                      <input
                        type="text"
                        placeholder="+57 300 123 4567"
                        value={formData["telefono"]?.numero ?? ""}
                        onChange={(e) =>
                          updateFormField("telefono", "numero", e.target.value)
                        }
                        className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors focus:border-amber-500/40"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs text-neutral-500">
                        Guión / Orator speech
                      </label>
                      <p className="mb-2 text-[11px] text-neutral-600">
                        Preparar un speech de máximo 2 minutos — qué vas a
                        decir, puntos clave a mencionar.
                      </p>
                      <textarea
                        rows={4}
                        placeholder="Ej: Presentarme, mencionar experiencia en React y Python, preguntar por el proceso de selección…"
                        value={formData["telefono"]?.speech ?? ""}
                        onChange={(e) =>
                          updateFormField("telefono", "speech", e.target.value)
                        }
                        className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors focus:border-amber-500/40 resize-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs text-neutral-500">
                        Adjuntar CV personalizado
                      </label>
                      <div className="flex items-center gap-3 rounded-lg border border-dashed border-white/15 bg-neutral-950 px-4 py-3">
                        <span className="text-sm text-neutral-500">📎</span>
                        <span className="text-sm text-neutral-600">
                          Seleccionar archivo (PDF, DOCX)
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs text-neutral-500">
                        Notas adicionales
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Resultado de la llamada, observaciones, seguimiento pendiente…"
                        value={formData["telefono"]?.notas ?? ""}
                        onChange={(e) =>
                          updateFormField("telefono", "notas", e.target.value)
                        }
                        className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors focus:border-amber-500/40 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ---- Correo ---- */}
              {canalesActivos["correo"] && (
                <div>
                  <h4 className="mb-4 flex items-center gap-2 text-sm font-medium text-amber-300">
                    <span>✉</span> Correo
                  </h4>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1.5 block text-xs text-neutral-500">
                          Correo de la empresa
                        </label>
                        <input
                          type="email"
                          placeholder="rrhh@empresa.com"
                          value={formData["correo"]?.email ?? ""}
                          onChange={(e) =>
                            updateFormField("correo", "email", e.target.value)
                          }
                          className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors focus:border-amber-500/40"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs text-neutral-500">
                          Tu correo
                        </label>
                        <input
                          type="email"
                          placeholder="tu@email.com"
                          className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors focus:border-amber-500/40"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs text-neutral-500">
                        Asunto
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: Postulación — Desarrollador de Software"
                        value={formData["correo"]?.asunto ?? ""}
                        onChange={(e) =>
                          updateFormField("correo", "asunto", e.target.value)
                        }
                        className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors focus:border-amber-500/40"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs text-neutral-500">
                        Contenido del correo
                      </label>
                      <textarea
                        rows={6}
                        placeholder="Escribe el cuerpo del correo aquí…"
                        value={formData["correo"]?.contenido ?? ""}
                        onChange={(e) =>
                          updateFormField("correo", "contenido", e.target.value)
                        }
                        className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors focus:border-amber-500/40 resize-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs text-neutral-500">
                        Adjuntar CV personalizado
                      </label>
                      <div className="flex items-center gap-3 rounded-lg border border-dashed border-white/15 bg-neutral-950 px-4 py-3">
                        <span className="text-sm text-neutral-500">📎</span>
                        <span className="text-sm text-neutral-600">
                          Seleccionar archivo (PDF, DOCX)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---- Red Social ---- */}
              {canalesActivos["red-social"] && (
                <div>
                  <h4 className="mb-4 flex items-center gap-2 text-sm font-medium text-amber-300">
                    <span>👤</span> Red Social
                  </h4>
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-neutral-950 px-4 py-2.5">
                      <span className="text-sm text-neutral-500">Plataforma:</span>
                      <span className="text-sm font-medium text-neutral-300">
                        Instagram
                      </span>
                      <span className="text-[11px] text-neutral-600">
                        (por defecto)
                      </span>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs text-neutral-500">
                        Usuario / Perfil de la empresa
                      </label>
                      <input
                        type="text"
                        placeholder="@empresa.rh"
                        value={formData["red-social"]?.usuario ?? ""}
                        onChange={(e) =>
                          updateFormField(
                            "red-social",
                            "usuario",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors focus:border-amber-500/40"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs text-neutral-500">
                        Tipo de mensaje
                      </label>
                      <div className="flex gap-2">
                        {(["texto", "nota-voz"] as const).map((tipo) => (
                          <button
                            key={tipo}
                            onClick={() =>
                              updateFormField(
                                "red-social",
                                "tipoMensaje",
                                tipo
                              )
                            }
                            className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                              (formData["red-social"]?.tipoMensaje ??
                                "texto") === tipo
                                ? "border-amber-500/40 bg-amber-500/5 text-amber-300"
                                : "border-white/10 text-neutral-400 hover:border-white/30 hover:text-neutral-200"
                            }`}
                          >
                            {tipo === "texto" ? "💬 Mensaje de texto" : "🎤 Nota de voz"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs text-neutral-500">
                        {formData["red-social"]?.tipoMensaje === "nota-voz"
                          ? "Contenido de la nota de voz"
                          : "Contenido del mensaje"}
                      </label>
                      <p className="mb-2 text-[11px] text-neutral-600">
                        {formData["red-social"]?.tipoMensaje === "nota-voz"
                          ? "¿Qué información vas a transmitir en la nota de voz? Máximo 2 minutos."
                          : "¿Qué le dijiste o le vas a decir por mensaje directo?"}
                      </p>
                      <textarea
                        rows={5}
                        placeholder={
                          formData["red-social"]?.tipoMensaje === "nota-voz"
                            ? "Ej: Hola, soy desarrollador con experiencia en… me interesa la oferta…"
                            : "Escribe el mensaje que enviaste o planeas enviar…"
                        }
                        value={formData["red-social"]?.contenido ?? ""}
                        onChange={(e) =>
                          updateFormField(
                            "red-social",
                            "contenido",
                            e.target.value
                          )
                        }
                        className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors focus:border-amber-500/40 resize-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs text-neutral-500">
                        Adjuntar CV personalizado
                      </label>
                      <div className="flex items-center gap-3 rounded-lg border border-dashed border-white/15 bg-neutral-950 px-4 py-3">
                        <span className="text-sm text-neutral-500">📎</span>
                        <span className="text-sm text-neutral-600">
                          Seleccionar archivo (PDF, DOCX)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---- Guardar button ---- */}
              <div className="flex justify-end border-t border-white/10 pt-4">
                <button className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-6 py-2.5 text-sm font-medium text-amber-300 transition-colors hover:bg-amber-500/20">
                  Guardar registro de contacto
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

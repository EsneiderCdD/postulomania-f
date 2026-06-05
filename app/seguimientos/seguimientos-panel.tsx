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
  getNotas,
  createNota,
  updateNota,
  deleteNota,
  type SeguimientoEmpresa,
  type SeguimientoDetail,
  type NotaItem,
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

      {/* --- NOTES SECTION --- */}
      {empresaActual && selectedOfertaId != null && (
        <NotesSection ofertaId={selectedOfertaId} ofertaTitulo={selectedOferta?.titulo ?? ""} />
      )}
    </div>
  );
}

/* ───────────────────────────────────────────
   NotesSection — connected to API
   ─────────────────────────────────────────── */

function NotesSection({ ofertaId, ofertaTitulo }: { ofertaId: number; ofertaTitulo: string }) {
  const [notas, setNotas] = useState<NotaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrandoEditor, setMostrandoEditor] = useState(false);
  const [editandoTexto, setEditandoTexto] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setExpandedId(null);
    getNotas(ofertaId).then((data) => {
      setNotas(data);
      setLoading(false);
    });
  }, [ofertaId]);

  const abrirEditorNuevo = () => {
    setError(null);
    setEditandoId(null);
    setEditandoTexto("");
    setMostrandoEditor(true);
  };

  const abrirEditorEditar = (nota: NotaItem) => {
    setError(null);
    setEditandoId(nota.id);
    setEditandoTexto(nota.contenido);
    setMostrandoEditor(true);
  };

  const guardar = async () => {
    const texto = editandoTexto.trim();
    if (!texto) return;
    setSaving(true);
    setError(null);

    if (editandoId != null) {
      const updated = await updateNota(editandoId, texto);
      if (updated) {
        setNotas((prev) => prev.map((n) => (n.id === editandoId ? updated : n)));
      } else {
        setError("Error al actualizar la nota");
        setSaving(false);
        return;
      }
    } else {
      const created = await createNota(ofertaId, texto);
      if (created) {
        setNotas((prev) => [created, ...prev]);
      } else {
        setError("Error al crear la nota");
        setSaving(false);
        return;
      }
    }

    setMostrandoEditor(false);
    setEditandoTexto("");
    setEditandoId(null);
    setSaving(false);
  };

  const eliminar = async (id: number) => {
    const ok = await deleteNota(id);
    if (ok) {
      setNotas((prev) => prev.filter((n) => n.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const formatearFecha = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" }) +
      " · " +
      d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-900">
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            Notas
          </h3>
          <span className="text-[11px] text-neutral-600">
              Oferta #{ofertaId} — {ofertaTitulo.length > 35 ? ofertaTitulo.slice(0, 35) + "…" : ofertaTitulo}
            </span>
        </div>
        <button
          onClick={abrirEditorNuevo}
          className="flex items-center gap-1.5 rounded-lg border border-amber-500/25 bg-amber-500/5 px-3 py-1.5 text-xs text-amber-300 transition-colors hover:border-amber-500/40 hover:bg-amber-500/10"
        >
          <span className="text-sm leading-none">+</span> Nota
        </button>
      </div>

      <div className="px-6 py-5">
        {loading ? (
          <div className="py-10 text-center text-sm text-neutral-500">Cargando notas…</div>
        ) : (
          <>
            {mostrandoEditor && (
              <div className="mb-5 rounded-xl border border-amber-500/20 bg-amber-500/[0.03] p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-amber-300/80">
                    {editandoId != null ? "Editando nota" : "Nueva nota"}
                  </span>
                  <button
                    onClick={() => { setMostrandoEditor(false); setEditandoTexto(""); setEditandoId(null); setError(null); }}
                    className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
                <textarea
                  autoFocus
                  rows={3}
                  placeholder="Escribí tu nota… (máx. 200 palabras)"
                  value={editandoTexto}
                  onChange={(e) => { setEditandoTexto(e.target.value); setError(null); }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) guardar();
                    if (e.key === "Escape") { setMostrandoEditor(false); setEditandoTexto(""); setEditandoId(null); setError(null); }
                  }}
                  className="w-full rounded-lg border border-white/10 bg-neutral-950 px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors focus:border-amber-500/40 resize-none"
                />
                {error && (
                  <p className="mt-2 text-xs text-red-400">{error}</p>
                )}
                <div className="mt-3 flex items-center justify-between text-[10px] text-neutral-500">
                  <span>Ctrl+Enter para guardar</span>
                  <button
                    onClick={guardar}
                    disabled={!editandoTexto.trim() || saving}
                    className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-500/20 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {saving ? "Guardando…" : "+ Guardar"}
                  </button>
                </div>
              </div>
            )}

            {notas.length === 0 && !mostrandoEditor ? (
              <div className="py-10 text-center">
                <p className="text-sm text-neutral-500">Sin notas aún</p>
                <p className="mt-1 text-xs text-neutral-600">
                  Hacé clic en <span className="text-amber-400/70">+ Nota</span> para agregar la primera
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {notas.map((nota) => {
                  const expandida = expandedId === nota.id;
                  return (
                    <div
                      key={nota.id}
                      className="group rounded-xl border border-white/10 bg-neutral-950 transition-colors hover:border-white/20"
                    >
                      <button
                        type="button"
                        onClick={() => toggleExpand(nota.id)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left"
                      >
                        <span className="shrink-0 text-[11px] text-neutral-500">
                          {formatearFecha(nota.fecha_creacion)}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[11px] text-amber-300/80">
                          {nota.contenido}
                        </span>
                        <div className="flex shrink-0 items-center gap-2">
                          <span
                            onClick={(e) => { e.stopPropagation(); abrirEditorEditar(nota); }}
                            className="rounded p-1 text-xs text-neutral-600 opacity-0 transition-all group-hover:opacity-100 hover:text-amber-300 hover:bg-white/5"
                            title="Editar"
                          >
                            ✏️
                          </span>
                          <span
                            onClick={(e) => { e.stopPropagation(); eliminar(nota.id); }}
                            className="rounded p-1 text-xs text-neutral-600 opacity-0 transition-all group-hover:opacity-100 hover:text-red-400 hover:bg-white/5"
                            title="Eliminar"
                          >
                            🗑️
                          </span>
                          <span className="text-[10px] text-neutral-600 transition-transform" style={{ transform: expandida ? "rotate(180deg)" : "rotate(0deg)" }}>
                            ▼
                          </span>
                        </div>
                      </button>

                      {expandida && (
                        <div className="border-t border-white/5 px-4 py-3">
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">
                            {nota.contenido}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

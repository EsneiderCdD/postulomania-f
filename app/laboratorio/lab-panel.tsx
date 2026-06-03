"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getOferta, type OfertaCompleta } from "../actions";

export default function LabPanel() {
  const searchParams = useSearchParams();
  const ofertaId = searchParams.get("ofertaId");

  const [oferta, setOferta] = useState<OfertaCompleta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ofertaId) {
      setError("No se especificó una oferta. Usá ?ofertaId=<id> en la URL.");
      return;
    }
    const id = Number(ofertaId);
    if (isNaN(id)) {
      setError("ID de oferta inválido.");
      return;
    }
    setLoading(true);
    setError(null);
    getOferta(id).then((res) => {
      if ("error" in res) {
        setError(res.error);
      } else {
        setOferta(res);
      }
      setLoading(false);
    });
  }, [ofertaId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-neutral-500">
        Cargando oferta…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-10 text-center">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (!oferta) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* --- FICHA PRINCIPAL --- */}
      <section className="rounded-2xl border border-white/10 bg-neutral-900">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 px-6 py-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">
              {oferta.titulo ?? "Sin título"}
            </h2>
            <p className="text-sm text-amber-300">{oferta.empresa ?? "—"}</p>
          </div>
          {oferta.compatibilidad != null && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-5 py-3">
              <p className="text-xs text-neutral-500">Compatibilidad</p>
              <p className="text-2xl font-semibold text-amber-300">
                {Math.round(oferta.compatibilidad * 100)}%
              </p>
            </div>
          )}
        </div>

        {/* Descripción */}
        {oferta.descripcion && (
          <div className="border-b border-white/10 px-6 py-5">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
              Descripción
            </h3>
            <div className="max-h-[400px] overflow-y-auto rounded-xl border border-white/5 bg-neutral-950 px-5 py-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">
                {oferta.descripcion}
              </p>
            </div>
          </div>
        )}

        {/* Grid de detalles */}
        <div className="px-6 py-5">
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
            Detalles
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <Field label="Ubicación" value={[oferta.municipio, oferta.departamento].filter(Boolean).join(", ") || "—"} />
            <Field label="Experiencia" value={oferta.experiencia_anios != null ? `${oferta.experiencia_anios} años` : "—"} />
            <Field label="Inglés" value={oferta.requiere_ingles ? "Sí" : "No"} />
            <Field label="Keyword" value={oferta.keyword ?? "—"} />
            <Field label="Origen" value={oferta.origen_proceso ?? "—"} />
            <Field label="ID Oferta" value={oferta.id_oferta ?? "—"} />
            <Field label="Pub. estimada" value={oferta.fecha_publicacion_estimada ?? "—"} />
            <Field label="Extracción" value={oferta.fecha_extraccion ?? "—"} />
          </div>
        </div>

        {/* Tecnologías */}
        {oferta.tecnologias && oferta.tecnologias.length > 0 && (
          <div className="border-t border-white/10 px-6 py-5">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-neutral-500">
              Tecnologías
            </h3>
            <div className="flex flex-wrap gap-2">
              {oferta.tecnologias.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-white/10 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Enlace original */}
        {oferta.enlace && (
          <div className="border-t border-white/10 px-6 py-4">
            <a
              href={oferta.enlace}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-xs text-neutral-400 transition-colors hover:border-white/30 hover:text-neutral-200"
            >
              Ver oferta original
            </a>
          </div>
        )}
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-neutral-950 p-3">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-sm text-white">{value}</p>
    </div>
  );
}

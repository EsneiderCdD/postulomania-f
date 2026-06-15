"use client";

import { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./mapa-ofertas.css";
import { updateEmpresa } from "../actions";

const yoIcon = L.divIcon({
  className: "",
  html: '<div style="width:14px;height:14px;border-radius:50%;background:#fbbf24;box-shadow:0 0 10px 4px rgba(251,191,36,0.7),0 0 16px 6px rgba(255,255,255,0.15);border:2px solid #fff;"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -8],
});

const PUNTO_YO = {
  nombre: "Yo",
  lat: 6.154659,
  lng: -75.604820,
  direccion: "Cra. 41, Alto Las Flores, Sabaneta, Antioquia",
};

type OfertaEmpresa = {
  id_oferta: string;
  titulo: string;
  enlace: string;
  fecha_publicacion_estimada: string;
  experiencia_anios: number | null;
  requiere_ingles: boolean;
  tecnologias: string[];
};

type EmpresaMapa = {
  id: number;
  nombre: string;
  website: string | null;
  direccion: string;
  municipio: string;
  departamento: string;
  lat: number | null;
  lng: number | null;
  total_ofertas: number;
  ofertas: OfertaEmpresa[];
  en_seguimiento: boolean;
  estado_visual?: string | null;
  estado_estrella?: string;
  opacidad?: number;
  compatibilidad_max?: number | null;
  dias_ultima_accion?: number | null;
};

export type MapaResponse = {
  total: number;
  empresas: EmpresaMapa[];
};

function buildStarIcon(empresa: EmpresaMapa): L.DivIcon {
  const estado = empresa.estado_estrella ?? "frio";
  const op = empresa.opacidad ?? 1;

  let bg: string;
  let shadow: string;
  let animClass = "";
  let size: number;

  switch (estado) {
    case "postulado":
      bg = "#f8fafc";
      shadow = "0 0 10px 5px rgba(248,250,252,0.7), 0 0 20px 8px rgba(248,250,252,0.3)";
      size = 12;
      break;
    case "hdv_vista":
      bg = "#3b82f6";
      shadow = "0 0 8px 3px rgba(59,130,246,0.6)";
      animClass = "star-pulsar";
      size = 12;
      break;
    case "finalista":
      bg = "#4ade80";
      shadow = "0 0 8px 3px rgba(74,222,128,0.6)";
      size = 14;
      break;
    case "finalizado":
      bg = "#ef4444";
      shadow = "0 0 6px 2px rgba(239,68,68,0.5)";
      size = 8;
      break;
    case "suspendido":
      bg = "#d97706";
      shadow = "0 0 4px 1px rgba(217,119,6,0.4)";
      size = 8;
      break;
    case "frio":
    default:
      bg = "#94a3b8";
      shadow = "0 0 4px 1px rgba(148,163,184,0.4)";
      size = 8;
  }

  const glowOpacity = (0.15 * op).toFixed(2);
  const half = size / 2;

  return L.divIcon({
    className: "",
    html: `<div class="${animClass}" style="width:${size}px;height:${size}px;border-radius:50%;background:${bg};box-shadow:${shadow},0 0 10px 4px rgba(255,255,255,${glowOpacity});opacity:${op};"></div>`,
    iconSize: [size, size],
    iconAnchor: [half, half],
    popupAnchor: [0, -half - 1],
  });
}

function MapFlyTo({
  selectedEmpresaId,
  empresas,
}: {
  selectedEmpresaId?: number | null;
  empresas: EmpresaMapa[];
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedEmpresaId) return;
    const empresa = empresas.find((e) => e.id === selectedEmpresaId);
    if (empresa?.lat != null && empresa?.lng != null) {
      map.flyTo([empresa.lat, empresa.lng], 15, { duration: 1 });
    }
  }, [selectedEmpresaId, empresas, map]);

  return null;
}

const ESTADO_BADGE: Record<string, { bg: string; label: string }> = {
  frio: { bg: "#94a3b8", label: "Frío" },
  postulado: { bg: "#f8fafc", label: "Postulado" },
  hdv_vista: { bg: "#3b82f6", label: "HdV Vista" },
  finalista: { bg: "#4ade80", label: "Finalista" },
  finalizado: { bg: "#ef4444", label: "Finalizado" },
  suspendido: { bg: "#d97706", label: "Suspendido" },
};

function EmpresaPopup({ empresa }: { empresa: EmpresaMapa }) {
  const [abierto, setAbierto] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const badge =
    ESTADO_BADGE[empresa.estado_estrella ?? "frio"] ?? ESTADO_BADGE["frio"];

  const guardar = useCallback(async () => {
    if (!editando || saving) return;
    setSaving(true);
    const campo = editando;
    const valor =
      campo === "lat" || campo === "lng"
        ? parseFloat(editValue)
        : editValue || null;
    await updateEmpresa(empresa.id, { [campo]: valor ?? null });
    setEditando(null);
    setEditValue("");
    setSaving(false);
  }, [editando, editValue, saving, empresa.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") guardar();
      if (e.key === "Escape") {
        setEditando(null);
        setEditValue("");
      }
    },
    [guardar],
  );

  function celda(
    campo: string,
    valor: string | number | null,
    placeholder: string,
    tipo: "text" | "number" = "text",
  ) {
    if (editando === campo) {
      return (
        <input
          autoFocus
          type={tipo}
          step="any"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={guardar}
          onKeyDown={handleKeyDown}
          className="w-full rounded border border-amber-500/50 bg-neutral-800 px-2 py-0.5 text-xs text-white outline-none"
          placeholder={placeholder}
          onMouseDown={(e) => e.stopPropagation()}
        />
      );
    }
    const display = valor != null ? String(valor) : placeholder;
    const isEmpty = valor == null;
    return (
      <span
        onClick={(e) => {
          e.stopPropagation();
          setEditando(campo);
          setEditValue(String(valor ?? ""));
        }}
        className={`cursor-pointer transition-colors hover:text-amber-400 ${
          isEmpty ? "text-neutral-600" : "text-neutral-400"
        }`}
      >
        {display}
      </span>
    );
  }

  return (
    <Popup>
      <div className="p-4 min-w-[280px]">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-sm font-medium text-white leading-tight">
            {empresa.nombre}
          </span>
          <span
            className="inline-block rounded-full flex-shrink-0 mt-1"
            style={{
              width: 8,
              height: 8,
              backgroundColor: badge.bg,
              boxShadow: `0 0 4px 1px ${badge.bg}80`,
            }}
          />
        </div>

        <div className="space-y-1.5 text-xs mb-3">
          <div>{celda("municipio", empresa.municipio, "municipio")}</div>
          <div>{celda("direccion", empresa.direccion, "dirección")}</div>
          <div>{celda("website", empresa.website, "web")}</div>
          <div className="flex gap-3">
            <span className="w-20">
              {celda("lat", empresa.lat?.toFixed(6) ?? null, "lat", "number")}
            </span>
            <span className="w-20">
              {celda("lng", empresa.lng?.toFixed(6) ?? null, "lng", "number")}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          {editando === "estado_visual" ? (
            <select
              autoFocus
              value={editValue}
              onChange={(e) => {
                e.stopPropagation();
                const newValue = e.target.value;
                setEditValue(newValue);
                updateEmpresa(empresa.id, { estado_visual: newValue || null });
                setEditando(null);
                setEditValue("");
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="rounded border border-amber-500/50 bg-neutral-800 px-2 py-0.5 text-xs text-white outline-none"
            >
              <option value="" className="bg-neutral-900 text-neutral-300">
                Automático
              </option>
              {Object.entries(ESTADO_BADGE).map(([key, { label }]) => (
                <option
                  key={key}
                  value={key}
                  className="bg-neutral-900 text-neutral-300"
                >
                  {label}
                </option>
              ))}
            </select>
          ) : (
            <span
              className="text-xs cursor-pointer hover:opacity-80"
              style={{ color: badge.bg }}
              onClick={(e) => {
                e.stopPropagation();
                setEditando("estado_visual");
                setEditValue(
                  empresa.estado_visual ??
                    empresa.estado_estrella ??
                    "frio",
                );
              }}
            >
              {badge.label}
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setAbierto(!abierto);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            {empresa.total_ofertas} oferta
            {empresa.total_ofertas !== 1 ? "s" : ""}{" "}
            {abierto ? "▲" : "▼"}
          </button>
        </div>

        {abierto && (
          <div className="border-t border-white/10 pt-3 flex flex-col gap-1.5">
            {empresa.ofertas.map((o) => (
              <a
                key={o.id_oferta}
                href={o.enlace}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors truncate"
              >
                {o.titulo}
              </a>
            ))}
          </div>
        )}
      </div>
    </Popup>
  );
}

export default function MapaOfertas({
  data,
  selectedEmpresaId,
  onMarkerClick,
}: {
  data: MapaResponse;
  selectedEmpresaId?: number | null;
  onMarkerClick?: (id: number) => void;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-900 shadow-xl overflow-hidden">
      <div className="h-[calc(100vh-4rem)] w-full">
        <MapContainer
          center={[6.21, -75.58]}
          zoom={12}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <MapFlyTo
            selectedEmpresaId={selectedEmpresaId}
            empresas={data.empresas}
          />
          {data.empresas
            .filter((e) => e.lat != null && e.lng != null)
            .map((e) => (
              <Marker
                key={e.id}
                position={[e.lat as number, e.lng as number]}
                icon={buildStarIcon(e)}
                eventHandlers={{
                  click: () => onMarkerClick?.(e.id),
                }}
              >
                <EmpresaPopup empresa={e} />
              </Marker>
            ))}
          <Marker position={[PUNTO_YO.lat, PUNTO_YO.lng]} icon={yoIcon}>
            <Popup>
              <div style={{ padding: "2px 0" }}>
                <div style={{ fontWeight: 600, color: "#f5f5f5", fontSize: "13px", lineHeight: 1.3, marginBottom: 2 }}>
                  {PUNTO_YO.nombre}
                </div>
                <div style={{ color: "#a3a3a3", fontSize: "11px", lineHeight: 1.4 }}>
                  {PUNTO_YO.direccion}
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  );
}

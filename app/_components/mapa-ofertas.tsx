"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = L.divIcon({
  className: "",
  html: '<div style="width:10px;height:10px;border-radius:50%;background:#d94a4a;box-shadow:0 0 6px 2px rgba(217,74,74,0.6),0 0 10px 4px rgba(255,255,255,0.15);"></div>',
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  popupAnchor: [0, -6],
});

L.Marker.prototype.options.icon = markerIcon;

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
  lat: number;
  lng: number;
  total_ofertas: number;
  ofertas: OfertaEmpresa[];
};

export type MapaResponse = {
  total: number;
  empresas: EmpresaMapa[];
};

function EmpresaPopup({ empresa }: { empresa: EmpresaMapa }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <Popup>
      <div style={{ padding: "2px 0" }}>
        <div style={{ fontWeight: 600, color: "#f5f5f5", fontSize: "13px", lineHeight: 1.3, marginBottom: 2 }}>
          {empresa.nombre}
        </div>
        <div style={{ color: "#a3a3a3", fontSize: "11px", marginBottom: 10, lineHeight: 1.4 }}>
          {empresa.direccion}, {empresa.municipio}
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: abierto ? 8 : 0 }}>
          {empresa.website && (
            <a
              href={empresa.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "3px 10px",
                fontSize: "11px",
                color: "#a3a3a3",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 4,
                textDecoration: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              Sitio web ↗
            </a>
          )}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setAbierto(!abierto); }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "3px 10px",
              fontSize: "11px",
              color: "#a3a3a3",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 4,
              background: "transparent",
              cursor: "pointer",
            }}
          >
            {empresa.total_ofertas} oferta{empresa.total_ofertas !== 1 ? "s" : ""}
            <span style={{ fontSize: "9px" }}>{abierto ? "▲" : "▼"}</span>
          </button>
        </div>
        {abierto && (
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 8,
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}>
            {empresa.ofertas.map((o) => (
              <a
                key={o.id_oferta}
                href={o.enlace}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: "11px",
                  color: "#d4d4d4",
                  textDecoration: "none",
                  lineHeight: 1.3,
                }}
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

export default function MapaOfertas({ data }: { data: MapaResponse }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-900 shadow-xl overflow-hidden">
      <h2 className="px-6 pt-6 text-lg font-semibold text-white">
        Mapa de Ofertas &mdash; Medellín y Valle de Aburrá
      </h2>
      <p className="px-6 text-sm text-neutral-400">
        {data.total} empresa{data.total === 1 ? "" : "s"} con ofertas
      </p>
      <div className="p-6">
        <div className="h-[500px] w-full rounded-xl overflow-hidden">
          <MapContainer
            center={[6.21, -75.58]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {data.empresas.map((e) => (
              <Marker key={e.id} position={[e.lat, e.lng]}>
                <EmpresaPopup empresa={e} />
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}

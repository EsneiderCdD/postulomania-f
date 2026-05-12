"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = markerIcon;

type OfertaMapa = {
  id_oferta: string;
  titulo: string;
  empresa: string;
  municipio: string;
  departamento: string;
  direccion: string;
  lat: number;
  lng: number;
};

export type MapaResponse = {
  total: number;
  ofertas: OfertaMapa[];
};

export default function MapaOfertas({ data }: { data: MapaResponse }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-900 shadow-xl overflow-hidden">
      <h2 className="px-6 pt-6 text-lg font-semibold text-white">
        Mapa de Ofertas &mdash; Antioquia
      </h2>
      <p className="px-6 text-sm text-neutral-400">
        {data.total} oferta{data.total === 1 ? "" : "s"} encontrada
        {data.total === 1 ? "" : "s"}
      </p>
      <div className="p-6">
        <div className="h-[500px] w-full rounded-xl overflow-hidden">
          <MapContainer
            center={[6.25, -75.57]}
            zoom={7}
            style={{ height: "100%", width: "100%" }}
            >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {data.ofertas.map((o) => (
              <Marker key={o.id_oferta} position={[o.lat, o.lng]}>
                <Popup>
                  <strong>{o.titulo}</strong>
                  <br />
                  {o.empresa}
                  <br />
                  {o.direccion}, {o.municipio}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}

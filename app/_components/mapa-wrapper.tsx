"use client";

import dynamic from "next/dynamic";
import type { MapaResponse } from "./mapa-ofertas";

const MapaOfertas = dynamic(() => import("./mapa-ofertas"), { ssr: false });

export default function MapaWrapper({ data }: { data: MapaResponse }) {
  return <MapaOfertas data={data} />;
}

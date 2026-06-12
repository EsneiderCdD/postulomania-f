"use client";

import dynamic from "next/dynamic";
import type { MapaResponse } from "./mapa-ofertas";

const MapaOfertas = dynamic(() => import("./mapa-ofertas"), { ssr: false });

export default function MapaWrapper({
  data,
  selectedEmpresaId,
  onMarkerClick,
}: {
  data: MapaResponse;
  selectedEmpresaId?: number | null;
  onMarkerClick?: (id: number) => void;
}) {
  return (
    <MapaOfertas
      data={data}
      selectedEmpresaId={selectedEmpresaId}
      onMarkerClick={onMarkerClick}
    />
  );
}

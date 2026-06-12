"use client";

import { useState } from "react";
import type { MapaResponse } from "../_components/mapa-ofertas";
import MapaWrapper from "../_components/mapa-wrapper";
import LeyendaMapa from "../_components/leyenda-mapa";
import PanelPrincipal from "../_components/panel-principal";

type Oferta = {
  id: number;
  id_oferta: string;
  titulo: string;
  enlace: string;
  fecha_extraccion: string;
  experiencia_anios: number | null;
  requiere_ingles: boolean;
  origen_proceso: string;
  empresa: string | null;
  compatibilidad: number;
  empresa_id: number | null;
};

type OfertasResponse = {
  total: number;
  page: number;
  page_size: number;
  ofertas: Oferta[];
};

type PostulacionItem = {
  id: number;
  oferta_id: number;
  cargo: string | null;
  empresa: string | null;
  link: string | null;
  fecha_postulacion: string | null;
  plataforma: string | null;
  estado_proceso: string;
};

export default function PrincipalClient({
  mapa,
  ofertasInicial,
  postulaciones,
}: {
  mapa: MapaResponse;
  ofertasInicial: OfertasResponse;
  postulaciones: PostulacionItem[];
}) {
  const [selectedEmpresaId, setSelectedEmpresaId] = useState<number | null>(
    null
  );

  return (
    <>
      <MapaWrapper
        data={mapa}
        selectedEmpresaId={selectedEmpresaId}
        onMarkerClick={setSelectedEmpresaId}
      />
      <LeyendaMapa />
      <div className="flex flex-col items-center px-6 py-8">
        <div className="w-full space-y-6">
          <PanelPrincipal
            mapa={mapa}
            ofertasInicial={ofertasInicial}
            postulaciones={postulaciones}
            onSelectEmpresa={setSelectedEmpresaId}
          />
        </div>
      </div>
    </>
  );
}

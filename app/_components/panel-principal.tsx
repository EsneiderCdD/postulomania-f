"use client";

import { useState, useCallback } from "react";
import type { MapaResponse } from "./mapa-ofertas";
import MapaWrapper from "./mapa-wrapper";
import TablaEmpresas from "./tabla-empresas";
import OfertasTabla from "./ofertas-tabla";

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

export default function PanelPrincipal({
  mapa,
  ofertas,
  postulaciones,
}: {
  mapa: MapaResponse;
  ofertas: Oferta[];
  postulaciones: PostulacionItem[];
}) {
  const [focusEmpresaId, setFocusEmpresaId] = useState<number | null>(null);

  const handleSeguirEmpresa = useCallback((empresaId: number) => {
    setFocusEmpresaId(empresaId);
  }, []);

  const handleFocusDone = useCallback(() => {
    setFocusEmpresaId(null);
  }, []);

  return (
    <>
      <MapaWrapper data={mapa} />
      <TablaEmpresas
        data={mapa}
        focusEmpresaId={focusEmpresaId}
        onFocusDone={handleFocusDone}
      />
      <OfertasTabla
        ofertas={ofertas}
        postulaciones={postulaciones.map((p) => ({
          oferta_id: p.oferta_id,
          estado_proceso: p.estado_proceso,
        }))}
        onSeguirEmpresa={handleSeguirEmpresa}
      />
    </>
  );
}

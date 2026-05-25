"use client";

import { useState, useCallback } from "react";
import type { MapaResponse } from "./mapa-ofertas";
import MapaWrapper from "./mapa-wrapper";
import TablaEmpresas from "./tabla-empresas";
import OfertasTabla from "./ofertas-tabla";
import { getEmpresa } from "../actions";

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

type EmpresaSeguida = {
  id: number;
  nombre: string;
  website: string | null;
  direccion: string;
  municipio: string;
  departamento: string;
  lat: number | null;
  lng: number | null;
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
  const [seguidas, setSeguidas] = useState<EmpresaSeguida[]>([]);
  const [focusEmpresaId, setFocusEmpresaId] = useState<number | null>(null);

  const empresasSeguidasIds = new Set(seguidas.map((s) => s.id));

  const handleSeguirEmpresa = useCallback(async (empresaId: number) => {
    const yaExiste = seguidas.some((s) => s.id === empresaId);
    if (yaExiste) {
      setFocusEmpresaId(empresaId);
      return;
    }

    const data = await getEmpresa(empresaId);
    if (data && !data.error) {
      setSeguidas((prev) => [...prev, data]);
      setFocusEmpresaId(empresaId);
    }
  }, [seguidas]);

  const handleFocusDone = useCallback(() => {
    setFocusEmpresaId(null);
  }, []);

  return (
    <>
      <MapaWrapper data={mapa} />
      <TablaEmpresas
        data={mapa}
        seguidas={seguidas}
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
        empresasSeguidas={empresasSeguidasIds}
      />
    </>
  );
}

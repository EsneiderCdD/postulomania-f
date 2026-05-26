"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { MapaResponse } from "./mapa-ofertas";
import MapaWrapper from "./mapa-wrapper";
import TablaEmpresas from "./tabla-empresas";
import OfertasTabla from "./ofertas-tabla";
import ModalIngresarOferta from "./modal-ingresar-oferta";
import ModalModificarOferta from "./modal-modificar-oferta";

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
  const router = useRouter();
  const [focusEmpresaId, setFocusEmpresaId] = useState<number | null>(null);
  const [modalIngresarAbierto, setModalIngresarAbierto] = useState(false);
  const [modalModificarAbierto, setModalModificarAbierto] = useState(false);

  const seguimientoIds = new Set(
    mapa.empresas.filter((e) => e.en_seguimiento).map((e) => e.id)
  );

  const handleSeguirEmpresa = useCallback((empresaId: number) => {
    setFocusEmpresaId(empresaId);
  }, []);

  const handleFocusDone = useCallback(() => {
    setFocusEmpresaId(null);
  }, []);

  const handleOpenIngresar = useCallback(() => setModalIngresarAbierto(true), []);
  const handleCloseIngresar = useCallback(() => setModalIngresarAbierto(false), []);
  const handleOpenModificar = useCallback(() => setModalModificarAbierto(true), []);
  const handleCloseModificar = useCallback(() => setModalModificarAbierto(false), []);
  const handleSuccess = useCallback(() => router.refresh(), [router]);

  return (
    <>
      <MapaWrapper data={mapa} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 px-1 mt-4">
        {[
          { label: "Ingresar oferta", action: handleOpenIngresar },
          { label: "Modificar oferta", action: handleOpenModificar },
          { label: "Postulaciones", action: undefined },
          { label: "Por salario", action: undefined },
          { label: "Vista compacta", action: undefined },
          { label: "Actualizar", action: undefined },
        ].map(({ label, action }) => (
          <button
            key={label}
            onClick={action}
            className="rounded-lg border border-amber-500/25 bg-neutral-900/80 px-3 py-2.5 text-sm font-medium text-amber-400/80 transition-colors hover:border-amber-500/50 hover:text-amber-300 hover:bg-neutral-800/80"
          >
            {label}
          </button>
        ))}
      </div>
      <ModalIngresarOferta
        abierto={modalIngresarAbierto}
        onClose={handleCloseIngresar}
        onSuccess={handleSuccess}
      />
      <ModalModificarOferta
        abierto={modalModificarAbierto}
        onClose={handleCloseModificar}
        onSuccess={handleSuccess}
      />
      <TablaEmpresas
        data={mapa}
        focusEmpresaId={focusEmpresaId}
        onFocusDone={handleFocusDone}
      />
      <OfertasTabla
        ofertas={ofertas}
        postulaciones={postulaciones}
        onSeguirEmpresa={handleSeguirEmpresa}
        seguimientoIds={seguimientoIds}
      />
    </>
  );
}

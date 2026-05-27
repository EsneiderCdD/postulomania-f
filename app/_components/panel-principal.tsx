"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "http://127.0.0.1:8000";

export default function PanelPrincipal({
  mapa,
  ofertasInicial,
  postulaciones,
}: {
  mapa: MapaResponse;
  ofertasInicial: OfertasResponse;
  postulaciones: PostulacionItem[];
}) {
  const router = useRouter();
  const [focusEmpresaId, setFocusEmpresaId] = useState<number | null>(null);
  const [modalIngresarAbierto, setModalIngresarAbierto] = useState(false);
  const [modalModificarAbierto, setModalModificarAbierto] = useState(false);

  const [ofertasData, setOfertasData] = useState<OfertasResponse>(ofertasInicial);
  const [orderBy, setOrderBy] = useState("fecha_extraccion");
  const [orderDir, setOrderDir] = useState("desc");
  const [page, setPage] = useState(ofertasInicial.page);

  const fetchOfertas = useCallback(
    async (ob: string, od: string, p: number) => {
      try {
        const url = `${API_BASE}/api/v1/ofertas?order_by=${ob}&order_dir=${od}&page=${p}&page_size=15`;
        const res = await fetch(url);
        if (res.ok) {
          const data: OfertasResponse = await res.json();
          setOfertasData(data);
        }
      } catch (err) {
        console.error("[fetchOfertas]", err);
      }
    },
    [],
  );

  const handleSort = useCallback(
    (field: string) => {
      if (field === orderBy) {
        const newDir = orderDir === "asc" ? "desc" : "asc";
        setOrderDir(newDir);
        setPage(1);
        fetchOfertas(field, newDir, 1);
      } else {
        const newDir = field === "experiencia_anios" ? "asc" : "desc";
        setOrderBy(field);
        setOrderDir(newDir);
        setPage(1);
        fetchOfertas(field, newDir, 1);
      }
    },
    [orderBy, orderDir, fetchOfertas],
  );

  const handlePageChange = useCallback(
    (p: number) => {
      setPage(p);
      fetchOfertas(orderBy, orderDir, p);
    },
    [orderBy, orderDir, fetchOfertas],
  );

  const handleSuccess = useCallback(() => {
    fetchOfertas(orderBy, orderDir, page);
    router.refresh();
  }, [orderBy, orderDir, page, fetchOfertas, router]);

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

  return (
    <>
      <MapaWrapper data={mapa} />
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 px-1 mt-4">
        <button
          onClick={handleOpenIngresar}
          className="rounded-lg border border-amber-500/25 bg-neutral-900/80 px-3 py-2.5 text-sm font-medium text-amber-400/80 transition-colors hover:border-amber-500/50 hover:text-amber-300 hover:bg-neutral-800/80"
        >
          Ingresar oferta
        </button>
        <button
          onClick={handleOpenModificar}
          className="rounded-lg border border-amber-500/25 bg-neutral-900/80 px-3 py-2.5 text-sm font-medium text-amber-400/80 transition-colors hover:border-amber-500/50 hover:text-amber-300 hover:bg-neutral-800/80"
        >
          Modificar oferta
        </button>
        <Link
          href="/postulaciones"
          className="rounded-lg border border-amber-500/25 bg-neutral-900/80 px-3 py-2.5 text-sm font-medium text-amber-400/80 transition-colors hover:border-amber-500/50 hover:text-amber-300 hover:bg-neutral-800/80 text-center"
        >
          Postulaciones
        </Link>
        <Link
          href="/ofertas"
          className="rounded-lg border border-amber-500/25 bg-neutral-900/80 px-3 py-2.5 text-sm font-medium text-amber-400/80 transition-colors hover:border-amber-500/50 hover:text-amber-300 hover:bg-neutral-800/80 text-center"
        >
          Ofertas
        </Link>
        <Link
          href="/bodega"
          className="rounded-lg border border-amber-500/25 bg-neutral-900/80 px-3 py-2.5 text-sm font-medium text-amber-400/80 transition-colors hover:border-amber-500/50 hover:text-amber-300 hover:bg-neutral-800/80 text-center"
        >
          Bodega
        </Link>
        <Link
          href="/perfil"
          className="rounded-lg border border-amber-500/25 bg-neutral-900/80 px-3 py-2.5 text-sm font-medium text-amber-400/80 transition-colors hover:border-amber-500/50 hover:text-amber-300 hover:bg-neutral-800/80 text-center"
        >
          Perfil
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-amber-500/25 bg-neutral-900/80 px-3 py-2.5 text-sm font-medium text-amber-400/80 transition-colors hover:border-amber-500/50 hover:text-amber-300 hover:bg-neutral-800/80 text-center"
        >
          Home
        </Link>
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
        ofertas={ofertasData.ofertas}
        postulaciones={postulaciones}
        onSeguirEmpresa={handleSeguirEmpresa}
        seguimientoIds={seguimientoIds}
        orderBy={orderBy}
        orderDir={orderDir}
        onSort={handleSort}
        total={ofertasData.total}
        page={page}
        pageSize={ofertasData.page_size}
        onPageChange={handlePageChange}
      />
    </>
  );
}

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { MapaResponse } from "./mapa-ofertas";
import OfertasTabla from "./ofertas-tabla";
import ModalIngresarOferta from "./modal-ingresar-oferta";
import ModalModificarOferta from "./modal-modificar-oferta";
import type { OfertasPaginatedResponse } from "../actions";
import { fetchOfertasPaginated, createEmpresa } from "../actions";

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

export default function PanelPrincipal({
  mapa,
  ofertasInicial,
  postulaciones,
  onSelectEmpresa,
}: {
  mapa: MapaResponse;
  ofertasInicial: OfertasResponse;
  postulaciones: PostulacionItem[];
  onSelectEmpresa?: (id: number) => void;
}) {
  const router = useRouter();
  const [modalIngresarAbierto, setModalIngresarAbierto] = useState(false);
  const [modalModificarAbierto, setModalModificarAbierto] = useState(false);
  const [modalNuevoPuntoAbierto, setModalNuevoPuntoAbierto] = useState(false);
  const [nuevoPunto, setNuevoPunto] = useState({
    nombre: "",
    lat: "",
    lng: "",
    municipio: "",
    direccion: "",
    website: "",
  });
  const [creandoPunto, setCreandoPunto] = useState(false);

  const [ofertasData, setOfertasData] = useState<OfertasResponse>(ofertasInicial);
  const [orderBy, setOrderBy] = useState("fecha_extraccion");
  const [orderDir, setOrderDir] = useState("desc");
  const [page, setPage] = useState(ofertasInicial.page);

  const fetchOfertas = useCallback(
    async (ob: string, od: string, p: number) => {
      const data = await fetchOfertasPaginated(ob, od, p, 15);
      if (data) setOfertasData(data);
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

  const handleOpenIngresar = useCallback(() => setModalIngresarAbierto(true), []);
  const handleCloseIngresar = useCallback(() => setModalIngresarAbierto(false), []);
  const handleOpenModificar = useCallback(() => setModalModificarAbierto(true), []);
  const handleCloseModificar = useCallback(() => setModalModificarAbierto(false), []);

  const handleOpenNuevoPunto = useCallback(() => setModalNuevoPuntoAbierto(true), []);
  const handleCloseNuevoPunto = useCallback(() => {
    setModalNuevoPuntoAbierto(false);
    setNuevoPunto({ nombre: "", lat: "", lng: "", municipio: "", direccion: "", website: "" });
  }, []);

  const handleCrearPunto = useCallback(async () => {
    if (!nuevoPunto.nombre.trim() || creandoPunto) return;
    setCreandoPunto(true);
    await createEmpresa({
      nombre: nuevoPunto.nombre.trim(),
      lat: nuevoPunto.lat ? parseFloat(nuevoPunto.lat) : null,
      lng: nuevoPunto.lng ? parseFloat(nuevoPunto.lng) : null,
      municipio: nuevoPunto.municipio.trim() || null,
      direccion: nuevoPunto.direccion.trim() || null,
      website: nuevoPunto.website.trim() || null,
    });
    setCreandoPunto(false);
    handleCloseNuevoPunto();
    router.refresh();
  }, [nuevoPunto, creandoPunto, router, handleCloseNuevoPunto]);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 px-1 mt-4">
        <button
          onClick={handleOpenIngresar}
          className="rounded-lg border border-amber-500/25 bg-neutral-900/80 px-3 py-2.5 text-sm font-medium text-amber-400/80 transition-colors hover:border-amber-500/50 hover:text-amber-300 hover:bg-neutral-800/80"
        >
          Ingresar Oferta
        </button>
        <button
          onClick={handleOpenModificar}
          className="rounded-lg border border-amber-500/25 bg-neutral-900/80 px-3 py-2.5 text-sm font-medium text-amber-400/80 transition-colors hover:border-amber-500/50 hover:text-amber-300 hover:bg-neutral-800/80"
        >
          Modificar Oferta
        </button>
        <button
          onClick={handleOpenNuevoPunto}
          className="rounded-lg border border-amber-500/25 bg-neutral-900/80 px-3 py-2.5 text-sm font-medium text-amber-400/80 transition-colors hover:border-amber-500/50 hover:text-amber-300 hover:bg-neutral-800/80"
        >
          Nuevo punto
        </button>
        <Link
          href="/ofertas"
          className="rounded-lg border border-amber-500/25 bg-neutral-900/80 px-3 py-2.5 text-sm font-medium text-amber-400/80 transition-colors hover:border-amber-500/50 hover:text-amber-300 hover:bg-neutral-800/80 text-center"
        >
          Todas las Ofertas
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-amber-500/25 bg-neutral-900/80 px-3 py-2.5 text-sm font-medium text-amber-400/80 transition-colors hover:border-amber-500/50 hover:text-amber-300 hover:bg-neutral-800/80 text-center"
        >
          Home
        </Link>
        <Link
          href="/perfil"
          className="rounded-lg border border-amber-500/25 bg-neutral-900/80 px-3 py-2.5 text-sm font-medium text-amber-400/80 transition-colors hover:border-amber-500/50 hover:text-amber-300 hover:bg-neutral-800/80 text-center"
        >
          Perfil
        </Link>
        <Link
          href="/bodega"
          className="rounded-lg border border-amber-500/25 bg-neutral-900/80 px-3 py-2.5 text-sm font-medium text-amber-400/80 transition-colors hover:border-amber-500/50 hover:text-amber-300 hover:bg-neutral-800/80 text-center"
        >
          Metricas
        </Link>
        <Link
          href="/seguimientos"
          className="rounded-lg border border-amber-500/25 bg-neutral-900/80 px-3 py-2.5 text-sm font-medium text-amber-400/80 transition-colors hover:border-amber-500/50 hover:text-amber-300 hover:bg-neutral-800/80 text-center"
        >
          Seguimientos
        </Link>
        <Link
          href="/postulaciones"
          className="rounded-lg border border-amber-500/25 bg-neutral-900/80 px-3 py-2.5 text-sm font-medium text-amber-400/80 transition-colors hover:border-amber-500/50 hover:text-amber-300 hover:bg-neutral-800/80 text-center"
        >
          Postulaciones
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
      {modalNuevoPuntoAbierto &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="fixed inset-0 bg-black/70"
              onClick={handleCloseNuevoPunto}
            />
            <div className="relative z-10 w-full max-w-sm rounded-xl border border-white/10 bg-neutral-950 p-6 shadow-2xl">
              <h2 className="mb-5 text-sm font-medium text-white">
                Nuevo punto
              </h2>
              <div className="space-y-3">
                <input
                  autoFocus
                  type="text"
                  placeholder="Nombre *"
                  value={nuevoPunto.nombre}
                  onChange={(e) =>
                    setNuevoPunto((p) => ({ ...p, nombre: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCrearPunto();
                  }}
                  className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-600 outline-none focus:border-amber-500/50"
                />
                <div className="flex gap-3">
                  <input
                    type="number"
                    step="any"
                    placeholder="Lat"
                    value={nuevoPunto.lat}
                    onChange={(e) =>
                      setNuevoPunto((p) => ({ ...p, lat: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCrearPunto();
                    }}
                    className="w-1/2 rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-600 outline-none focus:border-amber-500/50"
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Lng"
                    value={nuevoPunto.lng}
                    onChange={(e) =>
                      setNuevoPunto((p) => ({ ...p, lng: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCrearPunto();
                    }}
                    className="w-1/2 rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-600 outline-none focus:border-amber-500/50"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Municipio"
                  value={nuevoPunto.municipio}
                  onChange={(e) =>
                    setNuevoPunto((p) => ({ ...p, municipio: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCrearPunto();
                  }}
                  className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-600 outline-none focus:border-amber-500/50"
                />
                <input
                  type="text"
                  placeholder="Dirección"
                  value={nuevoPunto.direccion}
                  onChange={(e) =>
                    setNuevoPunto((p) => ({
                      ...p,
                      direccion: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCrearPunto();
                  }}
                  className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-600 outline-none focus:border-amber-500/50"
                />
                <input
                  type="text"
                  placeholder="Web"
                  value={nuevoPunto.website}
                  onChange={(e) =>
                    setNuevoPunto((p) => ({ ...p, website: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleCrearPunto();
                  }}
                  className="w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-600 outline-none focus:border-amber-500/50"
                />
              </div>
              <div className="mt-5 flex justify-end gap-3">
                <button
                  onClick={handleCloseNuevoPunto}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-neutral-400 hover:border-white/30 hover:text-neutral-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCrearPunto}
                  disabled={creandoPunto || !nuevoPunto.nombre.trim()}
                  className="rounded-lg bg-amber-500/80 px-4 py-2 text-sm font-medium text-black hover:bg-amber-500 disabled:opacity-40 transition-colors"
                >
                  {creandoPunto ? "..." : "Crear"}
                </button>
              </div>
            </div>
          </div>,
          document.getElementById("modal-root")!,
        )}
      <OfertasTabla
        ofertas={ofertasData.ofertas}
        postulaciones={postulaciones}
        onSeguirEmpresa={onSelectEmpresa}
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

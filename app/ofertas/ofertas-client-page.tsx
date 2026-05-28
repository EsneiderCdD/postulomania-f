"use client";

import { useState, useCallback } from "react";
import OfertasTabla from "../_components/ofertas-tabla";
import { fetchOfertasPaginated } from "../actions";

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

export default function OfertasClientPage({
  ofertasInicial,
  postulaciones,
}: {
  ofertasInicial: OfertasResponse;
  postulaciones: PostulacionItem[];
}) {
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

  return (
    <OfertasTabla
      ofertas={ofertasData.ofertas}
      postulaciones={postulaciones.map((p) => ({
        id: p.id,
        oferta_id: p.oferta_id,
        estado_proceso: p.estado_proceso,
      }))}
      orderBy={orderBy}
      orderDir={orderDir}
      onSort={handleSort}
      total={ofertasData.total}
      page={page}
      pageSize={ofertasData.page_size}
      onPageChange={handlePageChange}
    />
  );
}

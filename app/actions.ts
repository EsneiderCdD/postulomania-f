"use server";

export async function createPostulacion(ofertaId: number) {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/postulaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oferta_id: ofertaId, estado_proceso: "Postulado", plataforma: "Computrabajo" }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`[createPostulacion] HTTP ${res.status}: ${body}`);
    return null;
  }
  return res.json();
}

export async function updatePostulacion(id: number, estado_proceso: string) {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/postulaciones/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado_proceso }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`[updatePostulacion] HTTP ${res.status}: ${body}`);
    return null;
  }
  return res.json();
}

export async function deletePostulacion(id: number) {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/postulaciones/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`[deletePostulacion] HTTP ${res.status}: ${body}`);
    return null;
  }
  return res.json();
}

export async function deleteOferta(id: number) {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/ofertas/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`[deleteOferta] HTTP ${res.status}: ${body}`);
    return null;
  }
  return res.json();
}

export async function getEmpresa(id: number) {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/empresas/${id}`);
  if (!res.ok) {
    const body = await res.text();
    console.error(`[getEmpresa] HTTP ${res.status}: ${body}`);
    return null;
  }
  return res.json();
}

export type EmpresaFields = {
  lat?: number | null;
  lng?: number | null;
  direccion?: string | null;
  website?: string | null;
  municipio?: string | null;
  departamento?: string | null;
  estado_visual?: string | null;
};

export async function updateEmpresa(id: number, fields: EmpresaFields) {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/empresas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`[updateEmpresa] HTTP ${res.status}: ${body}`);
    return null;
  }
  return res.json();
}

export type OfertaFields = {
  id_oferta: string;
  origen_proceso: string;
  titulo?: string | null;
  enlace?: string | null;
  descripcion?: string | null;
  municipio?: string | null;
  departamento?: string | null;
  fecha_publicacion_estimada?: string | null;
  experiencia_anios?: number | null;
  requiere_ingles?: boolean;
  keyword?: string | null;
  empresa_id?: number | null;
  empresa?: string | null;
  tecnologias?: string[] | null;
  compatibilidad?: number | null;
};

export async function createOferta(fields: OfertaFields) {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/ofertas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`[createOferta] HTTP ${res.status}: ${body}`);
    return { error: body };
  }
  return res.json();
}

export type OfertaCompleta = {
  id: number;
  id_oferta: string;
  titulo: string | null;
  enlace: string | null;
  descripcion: string | null;
  municipio: string | null;
  departamento: string | null;
  fecha_publicacion_estimada: string | null;
  fecha_extraccion: string | null;
  experiencia_anios: number | null;
  requiere_ingles: boolean;
  keyword: string | null;
  origen_proceso: string;
  empresa_id: number | null;
  empresa: string | null;
  tecnologias: string[];
  compatibilidad: number | null;
};

export async function getOferta(id: number): Promise<OfertaCompleta | { error: string }> {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/ofertas/${id}`);
  if (!res.ok) {
    const body = await res.text();
    console.error(`[getOferta] HTTP ${res.status}: ${body}`);
    return { error: body };
  }
  return res.json();
}

export type OfertaSearchItem = {
  id: number;
  titulo: string | null;
  empresa: string | null;
};

export async function searchOfertas(q: string): Promise<OfertaSearchItem[]> {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/ofertas?q=${encodeURIComponent(q)}&limite=20`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.ofertas ?? [];
}

export type OfertasPaginatedResponse = {
  total: number;
  page: number;
  page_size: number;
  ofertas: {
    id: number;
    id_oferta: string;
    titulo: string;
    enlace: string;
    descripcion: string | null;
    fecha_publicacion_estimada: string | null;
    fecha_extraccion: string;
    experiencia_anios: number | null;
    requiere_ingles: boolean;
    keyword: string | null;
    origen_proceso: string;
    empresa_id: number | null;
    empresa: string | null;
    compatibilidad: number;
    tecnologias: string[];
  }[];
};

export async function fetchOfertasPaginated(
  orderBy: string,
  orderDir: string,
  page: number,
  pageSize: number,
): Promise<OfertasPaginatedResponse | null> {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const url = `${baseUrl}/api/v1/ofertas?order_by=${encodeURIComponent(orderBy)}&order_dir=${encodeURIComponent(orderDir)}&page=${page}&page_size=${pageSize}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`[fetchOfertasPaginated] HTTP ${res.status}`);
    return null;
  }
  return res.json();
}

export type EmpresaSearchItem = {
  id: number;
  nombre: string;
};

export async function searchEmpresas(q: string): Promise<EmpresaSearchItem[]> {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/empresas?q=${encodeURIComponent(q)}&limite=10`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.empresas ?? [];
}

export async function updateOferta(id: number, fields: Partial<OfertaFields>) {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/ofertas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`[updateOferta] HTTP ${res.status}: ${body}`);
    return { error: body };
  }
  return res.json();
}

export type TecnologiaItem = {
  id: number;
  nombre: string;
  categoria: string | null;
};

export async function getTecnologias(): Promise<TecnologiaItem[]> {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/tecnologias`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.tecnologias ?? [];
}

export async function createTecnologia(nombre: string, categoria: string): Promise<TecnologiaItem | null> {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/tecnologias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, categoria }),
  });
  if (!res.ok) {
    console.error(`[createTecnologia] HTTP ${res.status}`);
    return null;
  }
  return res.json();
}

export type PerfilData = {
  tecnico: Record<string, number>;
  categorias: Record<string, string>;
  perfil_tech_ids: Record<string, number | null>;
  idiomas: Record<string, number>;
  experiencia: number;
  nivel_educativo: number;
  metricas: {
    total_tecnologias_db: number;
    tecnologias_calificadas: number;
    tecnologias_sin_calificar: number;
    score_promedio: number;
  };
  tecnologias_db: string[];
};

export async function getPerfil(): Promise<PerfilData | null> {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/perfil`);
  if (!res.ok) return null;
  return res.json();
}

export async function updatePerfil(scores: Record<string, number>): Promise<{ message: string } | null> {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/perfil`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scores }),
  });
  if (!res.ok) {
    console.error(`[updatePerfil] HTTP ${res.status}`);
    return null;
  }
  return res.json();
}

export async function deletePerfilTech(perfilTechId: number): Promise<boolean> {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/perfil/${perfilTechId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    console.error(`[deletePerfilTech] HTTP ${res.status}`);
    return false;
  }
  return true;
}

export async function toggleSeguimiento(empresaId: number, enSeguimiento: boolean) {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/empresas/${empresaId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ en_seguimiento: enSeguimiento }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`[toggleSeguimiento] HTTP ${res.status}: ${body}`);
    return null;
  }
  return res.json();
}

export type SeguimientoEmpresa = {
  id: number;
  nombre: string;
  website: string | null;
  tipo: string | null;
  foto_url: string | null;
  estado_visual: string | null;
  estado_estrella: string;
};

export async function getSeguimientosEmpresas(): Promise<SeguimientoEmpresa[]> {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/seguimientos/empresas`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.empresas ?? [];
}

export type SeguimientoOferta = {
  id: number;
  titulo: string;
  enlace: string | null;
  compatibilidad: number | null;
  postulado: boolean;
};

export type SeguimientoTech = {
  tech: string;
  ofertas: number;
};

export type SeguimientoDetail = {
  empresa: {
    id: number;
    nombre: string;
    website: string | null;
    tipo: string | null;
    foto_url: string | null;
    estado_visual: string | null;
    estado_estrella: string;
  };
  ofertas: SeguimientoOferta[];
  tecnologias: SeguimientoTech[];
};

export async function getSeguimientoDetail(empresaId: number): Promise<SeguimientoDetail | null> {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/seguimientos/${empresaId}`);
  if (!res.ok) {
    console.error(`[getSeguimientoDetail] HTTP ${res.status}`);
    return null;
  }
  return res.json();
}

export async function setEmpresaTipo(empresaId: number, tipo: string) {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/empresas/${empresaId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tipo }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`[setEmpresaTipo] HTTP ${res.status}: ${body}`);
    return null;
  }
  return res.json();
}

export type NotaItem = {
  id: number;
  oferta_id: number | null;
  empresa_id: number | null;
  contenido: string;
  fecha_creacion: string;
};

export async function getNotas(ofertaId: number): Promise<NotaItem[]> {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/notas?oferta_id=${ofertaId}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.notas ?? [];
}

export async function createNota(ofertaId: number, contenido: string): Promise<NotaItem | null> {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/notas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oferta_id: ofertaId, contenido }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`[createNota] HTTP ${res.status}: ${body}`);
    return null;
  }
  return res.json();
}

export async function updateNota(id: number, contenido: string): Promise<NotaItem | null> {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/notas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contenido }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`[updateNota] HTTP ${res.status}: ${body}`);
    return null;
  }
  return res.json();
}

export async function deleteNota(id: number): Promise<boolean> {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const res = await fetch(`${baseUrl}/api/v1/notas/${id}`, { method: "DELETE" });
  if (!res.ok) {
    console.error(`[deleteNota] HTTP ${res.status}`);
    return false;
  }
  return true;
}

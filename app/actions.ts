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

export type PerfilData = {
  tecnico: Record<string, number>;
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

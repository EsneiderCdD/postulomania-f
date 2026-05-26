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

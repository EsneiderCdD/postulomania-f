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

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";

  try {
    const res = await fetch(`${baseUrl}/api/v1/postulaciones/export`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`[export] backend responded ${res.status}`);
      return new Response("Error al exportar", { status: res.status });
    }

    const blob = await res.blob();

    return new Response(blob, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=postulaciones.xlsx",
      },
    });
  } catch (err) {
    console.error("[export] fetch error:", err);
    return new Response("Error al conectar con el servidor", { status: 502 });
  }
}

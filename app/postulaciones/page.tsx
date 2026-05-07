import PostulacionesTabla from "../_components/postulaciones-tabla";

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

type PostulacionesResponse = {
  total: number;
  postulaciones: PostulacionItem[];
};

async function fetchApi<T>(path: string): Promise<T> {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const url = `${baseUrl}${path}`;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      const body = await response.text();
      console.error(`[fetchApi] ${path} → HTTP ${response.status}: ${body}`);
      throw new Error(`${path}: HTTP ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (err) {
    console.error(`[fetchApi] ${path} → ${err instanceof Error ? err.message : err}`);
    throw err;
  }
}

export default async function PostulacionesPage() {
  const data = await fetchApi<PostulacionesResponse>("/api/v1/postulaciones");

  return (
    <main className="flex min-h-screen items-start justify-center bg-neutral-950 px-4 py-10 text-neutral-100">
      <div className="w-full max-w-6xl">
        <section className="rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white">
                Postulaciones
              </h1>
              <p className="text-sm text-neutral-500">
                {data.total} postulaciones
              </p>
            </div>
            {data.total > 0 && (
              <a
                href="/api/postulaciones/export"
                className="rounded border border-white/10 px-4 py-2 text-xs text-neutral-400 hover:border-white/30 hover:text-neutral-200"
              >
                Descargar Excel
              </a>
            )}
          </div>
          <PostulacionesTabla postulaciones={data.postulaciones} />
        </section>
      </div>
    </main>
  );
}

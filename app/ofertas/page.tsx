import OfertasTabla from "../_components/ofertas-tabla";

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
};

type OfertasResponse = {
  total: number;
  ofertas: Oferta[];
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

export default async function OfertasPage() {
  const data = await fetchApi<OfertasResponse>("/api/v1/ofertas");

  return (
    <main className="flex min-h-screen items-start justify-center bg-neutral-950 px-4 py-10 text-neutral-100">
      <div className="w-full max-w-6xl">
        <section className="rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
          <h1 className="mb-1 text-center text-3xl font-semibold tracking-tight text-white">
            Ofertas
          </h1>
          <p className="mb-6 text-center text-sm text-neutral-500">
            {data.total} ofertas capturadas
          </p>
          <OfertasTabla ofertas={data.ofertas} />
        </section>
      </div>
    </main>
  );
}

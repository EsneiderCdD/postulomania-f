import type { MapaResponse } from "../_components/mapa-ofertas";
import MapaWrapper from "../_components/mapa-wrapper";

async function fetchMapaOfertas(): Promise<MapaResponse> {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const url = `${baseUrl}/api/v1/mapa/empresas?departamento=Antioquia`;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      const body = await response.text();
      console.error(`[fetchMapa] → HTTP ${response.status}: ${body}`);
      throw new Error(`mapa/ofertas: HTTP ${response.status}`);
    }
    return (await response.json()) as MapaResponse;
  } catch (err) {
    console.error(`[fetchMapa] → ${err instanceof Error ? err.message : err}`);
    throw err;
  }
}

export default async function Principal() {
  const mapa = await fetchMapaOfertas();
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(251,191,36,0.12) 0%, rgba(245,158,11,0.04) 40%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto w-[98%] max-w-[1333px] min-h-screen rounded-3xl border border-white/5 bg-neutral-900">
        <div className="flex min-h-screen flex-col items-center px-6 py-8">
          <h1 className="hero-title text-center text-4xl md:text-5xl">
            Postulomaniaco
          </h1>

          <div className="mt-8 w-full">
            <MapaWrapper data={mapa} />
          </div>
        </div>
      </div>
    </main>
  );
}

import HomeForex from "./_components/home-forex";
import type { MapaResponse } from "./_components/mapa-ofertas";
import MapaWrapper from "./_components/mapa-wrapper";

type TimelineStats = {
  metrica: string;
  serie: Array<{ fecha: string; total: number; origenes: Record<string, number> }>;
  resumen: { total_historico: number; primer_dia: string | null; ultimo_dia: string | null; dias_con_datos: number; promedio_diario: number; mediana_diaria: number };
  postulaciones: {
    serie: Array<{ fecha: string; total: number; origenes: Record<string, number> }>;
    resumen: { total_historico: number; primer_dia: string | null; ultimo_dia: string | null; dias_con_datos: number; promedio_diario: number; mediana_diaria: number };
  };
  comparativa: {
    hoy: { fecha: string; ofertas: number; postulaciones: number; tasa_postulacion: number };
    historico: { total_ofertas: number; total_postulaciones: number; tasa_postulacion: number };
  };
};

async function fetchStats<T>(endpoint: string): Promise<T> {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const url = `${baseUrl}/api/v1/stats/${endpoint}`;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      const body = await response.text();
      console.error(`[fetchStats] ${endpoint} → HTTP ${response.status}: ${body}`);
      throw new Error(`${endpoint}: HTTP ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (err) {
    console.error(`[fetchStats] ${endpoint} → ${err instanceof Error ? err.message : err}`);
    throw err;
  }
}

async function fetchMapaOfertas(): Promise<MapaResponse> {
  const baseUrl = process.env.BACKEND_API_URL ?? "http://127.0.0.1:8000";
  const url = `${baseUrl}/api/v1/mapa/ofertas?departamento=Antioquia`;
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

type OrigenStats = {
  metrica: string;
  frecuencia: Record<string, number>;
  distribucion_porcentaje: Record<string, number>;
  moda: string;
  ratio_nulos: string;
};

export default async function Home() {
  const [timeline, origen, mapa] = await Promise.all([
    fetchStats<TimelineStats>("timeline"),
    fetchStats<OrigenStats>("origen"),
    fetchMapaOfertas(),
  ]);
  return (
    <>
      <HomeForex data={timeline} origen={origen} />
      <div className="flex items-start justify-center px-4 pb-10">
        <div className="w-full max-w-6xl">
          <MapaWrapper data={mapa} />
        </div>
      </div>
    </>
  );
}

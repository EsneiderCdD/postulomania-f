import OrigenDonut from "../_components/origen-donut";
import EmpresaVisual from "../_components/empresa-visual";
import TechStackVisual from "../_components/tech-stack-visual";
import ExperienceVisual from "../_components/experience-visual";
import EnglishVisual from "../_components/english-visual";
import TimingVisual from "../_components/timing-visual";
import TitleVisual from "../_components/title-visual";
import IdVisual from "../_components/id-visual";
import OrigenExperienceVisual from "../_components/origen-experience-visual";
import OrigenTimingVisual from "../_components/origen-timing-visual";
import OrigenEmpresaVisual from "../_components/origen-empresa-visual";
import EnglishTimingVisual from "../_components/english-timing-visual";
import ExperienceEmpresaVisual from "../_components/experience-empresa-visual";
import ExperienceCompatibilityVisual from "../_components/experience-compatibility-visual";
import ExperienceTimingVisual from "../_components/experience-timing-visual";
import EmpresaCompatibilityVisual from "../_components/empresa-compatibility-visual";
import TechCompatibilityVisual from "../_components/tech-compatibility-visual";

type OrigenStats = { metrica: string; frecuencia: Record<string, number>; distribucion_porcentaje: Record<string, number>; moda: string; ratio_nulos: string };
type EmpresaStats = { metrica: string; total_empresas_identificadas: number; total_ofertas_anonimas: number; ratio_ofertas_anonimas: string; top_10_empresas: Record<string, number>; ratio_nulos_empresa: string; total_empresas_solo_ingles: number; empresas_solo_ingles: string[]; analisis_larga_cola: { empresas_identificadas_con_una_oferta: number; porcentaje_larga_cola_identificadas: string } };
type ExperienceStats = { metrica: string; promedio: number; mediana: number; moda: number; volatilidad_std: number; tasa_entry_level: string; distribucion_niveles: Record<string, number>; correlacion_exp_vs_techs: number; extremos: { max_anios: number; techs_asociadas: string[] } };
type EnglishStats = { metrica: string; proporcion_general: string; impacto_experiencia_anios: Record<string, number>; carga_tecnica_promedio: Record<string, number>; impacto_compatibilidad: Record<string, number>; concentracion_por_origen: Record<string, string>; top_tecnologias_bilingues: Record<string, number> };
type TimingStats = { metrica: string; volumen_por_dia: Record<string, number>; frecuencia_por_hora: Record<string, number>; recencia: { ultimas_24h: number; ultimas_48h: number }; antiguedad_maxima_dias: number; dia_pico_absoluto: string; fuga_fin_de_semana: string };
type TitleStats = { metrica: string; nube_de_palabras: unknown[]; nota: string };
type IdStats = { metrica: string; auditoria_integridad: { total_registros_volumen: number; registros_unicos_unicidad: number; duplicados_detectados: number; tasa_duplicidad: string } };
type OrigenExperienceStats = { metrica: string; promedio_por_origen: Record<string, number>; mediana_por_origen: Record<string, number>; moda_por_origen: Record<string, number>; distribucion_niveles_por_origen: Record<string, Record<string, number>>; tasa_entry_level_por_origen: Record<string, string> };
type TechStackStats = { metrica: string; total_tecnologias_unicas: number; popularidad_top_15: Record<string, number>; promedio_techs_por_oferta: number; rango_densidad: { min: number; max: number }; combinaciones_frecuentes: Record<string, number>; tecnologias_raras: Record<string, number>; tendencia_por_origen: Record<string, Record<string, number>> };
type OrigenTimingStats = { metrica: string; volumen_por_dia_por_origen: Record<string, Record<string, number>>; dia_pico_por_origen: Record<string, string>; fuga_finde_por_origen: Record<string, string> };
type OrigenEmpresaStats = { metrica: string; empresas_identificadas_por_origen: Record<string, number>; top_3_por_origen: Record<string, Record<string, number>>; larga_cola_por_origen: Record<string, string> };
type EnglishTimingStats = { metrica: string; volumen_por_dia_por_ingles: Record<string, Record<string, number>>; dia_pico_por_ingles: Record<string, string>; fuga_finde_por_ingles: Record<string, string> };
type ExperienceEmpresaStats = { metrica: string; top_experiencia_empresas: Record<string, number>; nivel_mas_demandado: Record<string, number> };
type ExperienceCompatibilityStats = { metrica: string; score_por_nivel: Record<string, number>; correlacion_exp_vs_score: number; rango_experiencia_analizado: { min: number; max: number } };
type ExperienceTimingStats = { metrica: string; promedio_exp_por_dia: Record<string, number>; mediana_exp_por_dia: Record<string, number>; dia_con_mas_experiencia_promedio: string | null };
type EmpresaCompatibilityStats = { metrica: string; top_score_empresas: Record<string, number>; empresas_con_match_cero: number };
type TechCompatibilityStats = { metrica: string; top_score_tecnologias: Record<string, number>; bottom_score_tecnologias: Record<string, number> };

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

export default async function Bodega() {
  const [
    origenStats, empresaStats, techStackStats, experienceStats, englishStats,
    timingStats, titleStats, idStats, origenExperienceStats,
    origenTimingStats, origenEmpresaStats, englishTimingStats,
    experienceEmpresaStats, experienceCompatibilityStats, experienceTimingStats,
    empresaCompatibilityStats, techCompatibilityStats,
  ] = await Promise.all([
    fetchStats<OrigenStats>("origen"),
    fetchStats<EmpresaStats>("empresa"),
    fetchStats<TechStackStats>("tech-stack"),
    fetchStats<ExperienceStats>("experience"),
    fetchStats<EnglishStats>("english"),
    fetchStats<TimingStats>("timing"),
    fetchStats<TitleStats>("title"),
    fetchStats<IdStats>("id"),
    fetchStats<OrigenExperienceStats>("origen-experience"),
    fetchStats<OrigenTimingStats>("origen-timing"),
    fetchStats<OrigenEmpresaStats>("origen-empresa"),
    fetchStats<EnglishTimingStats>("english-timing"),
    fetchStats<ExperienceEmpresaStats>("experience-empresa"),
    fetchStats<ExperienceCompatibilityStats>("experience-compatibility"),
    fetchStats<ExperienceTimingStats>("experience-timing"),
    fetchStats<EmpresaCompatibilityStats>("empresa-compatibility"),
    fetchStats<TechCompatibilityStats>("tech-compatibility"),
  ]);

  return (
    <main className="flex min-h-screen items-start justify-center bg-neutral-950 px-4 py-10 text-neutral-100">
      <div className="flex w-full max-w-6xl flex-col gap-8">
        <OrigenDonut data={origenStats} />
        <EmpresaVisual data={empresaStats} />
        <TechStackVisual data={techStackStats} />
        <ExperienceVisual data={experienceStats} />
        <EnglishVisual data={englishStats} />
        <TimingVisual data={timingStats} />
        <TitleVisual data={titleStats} />
        <IdVisual data={idStats} />
        <OrigenExperienceVisual data={origenExperienceStats} />
        <OrigenTimingVisual data={origenTimingStats} />
        <OrigenEmpresaVisual data={origenEmpresaStats} />
        <EnglishTimingVisual data={englishTimingStats} />
        <ExperienceEmpresaVisual data={experienceEmpresaStats} />
        <ExperienceCompatibilityVisual data={experienceCompatibilityStats} />
        <ExperienceTimingVisual data={experienceTimingStats} />
        <EmpresaCompatibilityVisual data={empresaCompatibilityStats} />
        <TechCompatibilityVisual data={techCompatibilityStats} />
      </div>
    </main>
  );
}

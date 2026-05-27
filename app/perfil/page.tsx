import { getPerfil } from "../actions";

const CATEGORY_ORDER = [
  "backend",
  "frontend",
  "bases_de_datos",
  "mobile",
  "devops",
  "cloud",
  "data",
  "arquitectura",
];

const CATEGORY_LABELS: Record<string, string> = {
  backend: "Backend",
  frontend: "Frontend",
  bases_de_datos: "Bases de Datos",
  mobile: "Mobile",
  devops: "DevOps",
  cloud: "Cloud",
  data: "Data",
  arquitectura: "Arquitectura",
  otras: "Otras",
};

const TECH_CATEGORY_MAP: Record<string, string> = {
  // Backend
  "Python": "backend",
  "Java": "backend",
  "C#": "backend",
  ".NET": "backend",
  "PHP": "backend",
  "Ruby": "backend",
  "Go": "backend",
  "Node.js": "backend",
  "Laravel": "backend",
  "Symfony": "backend",
  "Django": "backend",
  "Flask": "backend",
  "Express.js": "backend",
  "NestJS": "backend",
  "Spring Boot": "backend",
  "REST API": "backend",
  "Web Services": "backend",
  "SOAP": "backend",
  "JWT": "backend",
  "SAP": "backend",
  "GraphQL": "backend",
  // Frontend
  "JavaScript": "frontend",
  "TypeScript": "frontend",
  "HTML": "frontend",
  "CSS": "frontend",
  "React": "frontend",
  "Angular": "frontend",
  "Vue.js": "frontend",
  "Next.js": "frontend",
  "jQuery": "frontend",
  // Bases de Datos
  "SQL": "bases_de_datos",
  "MySQL": "bases_de_datos",
  "PostgreSQL": "bases_de_datos",
  "SQL Server": "bases_de_datos",
  "Oracle": "bases_de_datos",
  "MongoDB": "bases_de_datos",
  "Redis": "bases_de_datos",
  "Elasticsearch": "bases_de_datos",
  // Mobile
  "Flutter": "mobile",
  "React Native": "mobile",
  "Ionic": "mobile",
  "iOS": "mobile",
  "Swift": "mobile",
  "Android": "mobile",
  "Kotlin": "mobile",
  // DevOps
  "Linux": "devops",
  "Docker": "devops",
  "Kubernetes": "devops",
  "Git": "devops",
  "CI/CD": "devops",
  "Jira": "devops",
  // Cloud
  "AWS": "cloud",
  "Azure": "cloud",
  "GCP": "cloud",
  "Firebase": "cloud",
  // Data
  "Power BI": "data",
  "Tableau": "data",
  "Pandas": "data",
  "ETL": "data",
  // Arquitectura
  "Microservicios": "arquitectura",
};

export default async function Perfil() {
  const perfil = await getPerfil();

  if (!perfil) {
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
          <div className="flex min-h-screen flex-col items-center justify-center px-6 py-8">
            <h1 className="hero-title text-center text-4xl md:text-5xl">Perfil</h1>
            <p className="mt-6 text-sm text-neutral-400">No se pudo cargar el perfil.</p>
          </div>
        </div>
      </main>
    );
  }

  const grouped: Record<string, [string, number][]> = {};
  for (const cat of [...CATEGORY_ORDER, "otras"]) {
    grouped[cat] = [];
  }

  for (const [nombre, score] of Object.entries(perfil.tecnico)) {
    const cat = TECH_CATEGORY_MAP[nombre] ?? "otras";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push([nombre, score]);
  }

  for (const cat of Object.keys(grouped)) {
    grouped[cat].sort((a, b) => b[1] - a[1]);
  }

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
          <h1 className="hero-title text-center text-4xl md:text-5xl">Perfil</h1>

          <div className="mt-8 w-full max-w-5xl space-y-6">
            <p className="text-sm text-neutral-400 font-[var(--font-exo)]">
              Experiencia {perfil.experiencia.toFixed(2)}
              <span className="mx-3 text-neutral-600">|</span>
              Inglés {perfil.idiomas.ingles?.toFixed(2) ?? "0.00"}
              <span className="mx-3 text-neutral-600">|</span>
              Nivel educativo {perfil.nivel_educativo.toFixed(2)}
              <span className="mx-3 text-neutral-600">|</span>
              Calificadas {perfil.metricas.tecnologias_calificadas}/{perfil.metricas.total_tecnologias_db}
              <span className="mx-3 text-neutral-600">|</span>
              Promedio {perfil.metricas.score_promedio.toFixed(2)}
            </p>

            {[...CATEGORY_ORDER, "otras"].map((cat) => {
              const techs = grouped[cat];
              if (!techs || techs.length === 0) return null;

              return (
                <div key={cat}>
                  <h2 className="mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-[0.15em] font-[var(--font-exo)]">
                    {CATEGORY_LABELS[cat] ?? cat}
                  </h2>
                  <div
                    className="gap-x-4 gap-y-1"
                    style={{ columns: "4 200px" }}
                  >
                    {techs.map(([nombre, score]) => (
                      <div key={nombre} className="flex justify-between text-sm break-inside-avoid">
                        <span className="text-neutral-300 font-[var(--font-exo)] truncate mr-2">{nombre}</span>
                        <span className="text-amber-400 tabular-nums shrink-0">{score.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

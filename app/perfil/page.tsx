import { getPerfil } from "../actions";

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

  const techs = Object.entries(perfil.tecnico).sort((a, b) => b[1] - a[1]);

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

          <div className="mt-8 w-full max-w-4xl space-y-6">
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

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-4 gap-y-1">
              {techs.map(([nombre, score]) => (
                <div key={nombre} className="flex justify-between text-sm">
                  <span className="text-neutral-300 font-[var(--font-exo)] truncate mr-2">{nombre}</span>
                  <span className="text-amber-400 tabular-nums shrink-0">{score.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

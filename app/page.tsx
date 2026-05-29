import Navbar from "./_reusable/navbar";

export default function Home() {
  return (
    <main className="bg-neutral-950">
      <div className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(251,191,36,0.12) 0%, rgba(245,158,11,0.04) 40%, transparent 70%)",
        }}
      />

      {/* Hero section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="relative z-10 mx-auto w-[98%] max-w-[1333px] min-h-screen rounded-3xl border border-white/5 bg-neutral-900">
          <Navbar />

          <div className="grid grid-cols-5 grid-rows-5 min-h-screen">
            <div className="col-span-5 row-span-2 flex items-center justify-center">
              <h1 className="hero-title text-8xl md:text-9xl">
                Postulomaniaco
              </h1>
            </div>

            <div className="col-span-3 row-span-3 col-start-3 row-start-3 flex flex-col items-end justify-start gap-6 px-4">
              <p className="hero-subtitle text-right text-5xl md:text-6xl">
                SOFWARE DE EXTRACCION Y GESTION DE VACANTES
              </p>

              <p className="self-start text-left text-base md:text-lg leading-relaxed text-neutral-400 max-w-xl md:max-w-2xl font-[system-ui] ml-6 md:ml-10">
                Herramienta integral para la búsqueda, extracción y seguimiento de
                ofertas laborales en el ecosistema tech de Antioquia.
              </p>
            </div>

            <div className="col-span-2 row-span-3 row-start-3 relative">
              <img
                src="/images/mascota.png"
                alt="Mascota Postulomanía"
                className="pointer-events-none absolute bottom-0 left-0 z-10 w-[380px] object-contain md:w-[495px]"
                style={{
                  marginLeft: "calc(-1 * (100vw - min(98vw, 1333px)) / 2 - 18px)",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Scraping section */}
      <section className="relative py-24">
        <div className="mx-auto w-[98%] max-w-[1333px]">
          <div className="rounded-3xl border border-white/5 bg-neutral-900">
            <div className="grid grid-cols-5 h-[400px] md:h-[500px]">
              <div className="col-span-2 flex items-center justify-center p-6">
                <img
                  src="/images/scraping.png"
                  alt="Scraping"
                  className="w-full max-w-xs md:max-w-sm object-contain"
                />
              </div>

              <div className="col-span-3 col-start-3 flex flex-col items-end justify-center gap-6 px-4">
                <h2 className="hero-title text-4xl md:text-5xl">
                  Scraping
                </h2>

                <p className="hero-subtitle text-right text-3xl md:text-4xl">
                  Extracción automatizada
                </p>

                <p className="self-start text-left text-base md:text-lg leading-relaxed text-neutral-400 max-w-xl md:max-w-2xl font-[system-ui] ml-6 md:ml-10">
                  Obtención automática de ofertas laborales desde múltiples
                  portales de empleo, manteniendo actualizada la base de datos
                  con las últimas vacantes del ecosistema tech.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Base de datos section */}
      <section className="relative py-24">
        <div className="mx-auto w-[98%] max-w-[1333px]">
          <div className="rounded-3xl border border-white/5 bg-neutral-900">
            <div className="grid grid-cols-5 h-[400px] md:h-[500px]">
              <div className="col-span-2 flex items-center justify-center p-6">
                <img
                  src="/images/basedatos.png"
                  alt="Base de datos"
                  className="w-full max-w-xs md:max-w-sm object-contain"
                />
              </div>

              <div className="col-span-3 col-start-3 flex flex-col items-end justify-center gap-6 px-4">
                <h2 className="hero-title text-4xl md:text-5xl">
                  Almacenamiento Base de Datos
                </h2>

                <p className="self-start text-left text-base md:text-lg leading-relaxed text-neutral-400 max-w-xl md:max-w-2xl font-[system-ui] ml-6 md:ml-10">
                  Limpieza, depuración, extracción de los datos y
                  almacenamiento en PostgreSQL.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compatibilidad section */}
      <section className="relative py-24">
        <div className="mx-auto w-[98%] max-w-[1333px]">
          <div className="rounded-3xl border border-white/5 bg-neutral-900">
            <div className="grid grid-cols-5 h-[400px] md:h-[500px]">
              <div className="col-span-2 flex items-center justify-center p-6">
                <img
                  src="/images/compatibilidad.png"
                  alt="Compatibilidad"
                  className="w-full max-w-xs md:max-w-sm object-contain"
                />
              </div>

              <div className="col-span-3 col-start-3 flex flex-col items-end justify-center gap-6 px-4">
                <h2 className="hero-title text-4xl md:text-5xl">
                  Compatibilidad
                </h2>

                <p className="self-start text-left text-base md:text-lg leading-relaxed text-neutral-400 max-w-xl md:max-w-2xl font-[system-ui] ml-6 md:ml-10">
                  Extracción de perfil psicotécnico y de requisitos técnicos
                  para una lectura y comparativa rápida del mercado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contactar section */}
      <section className="relative py-24">
        <div className="mx-auto w-[98%] max-w-[1333px]">
          <div className="rounded-3xl border border-white/5 bg-neutral-900">
            <div className="grid grid-cols-5 h-[400px] md:h-[500px]">
              <div className="col-span-2 flex items-center justify-center p-6">
                <img
                  src="/images/contactar.png"
                  alt="Contactar"
                  className="w-full max-w-xs md:max-w-sm object-contain"
                />
              </div>

              <div className="col-span-3 col-start-3 flex flex-col items-end justify-center gap-6 px-4">
                <h2 className="hero-title text-4xl md:text-5xl">
                  Contactar
                </h2>

                <p className="self-start text-left text-base md:text-lg leading-relaxed text-neutral-400 max-w-xl md:max-w-2xl font-[system-ui] ml-6 md:ml-10">
                  Genera un estudio de mercado basado en los datos, y encuentra
                  una empresa / oferta seria, y con aspiraciones y proyecciones
                  reales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estrategias section */}
      <section className="relative py-24">
        <div className="mx-auto w-[98%] max-w-[1333px]">
          <div className="rounded-3xl border border-white/5 bg-neutral-900">
            <div className="grid grid-cols-5 h-[400px] md:h-[500px]">
              <div className="col-span-2 flex items-center justify-center p-6">
                <div className="w-full max-w-xs md:max-w-sm aspect-square rounded-2xl border border-dashed border-white/10 flex items-center justify-center text-neutral-600 text-sm">
                  imagen
                </div>
              </div>

              <div className="col-span-3 col-start-3 flex flex-col items-end justify-center gap-6 px-4">
                <h2 className="hero-title text-4xl md:text-5xl">
                  Estrategias
                </h2>

                <p className="self-start text-left text-base md:text-lg leading-relaxed text-neutral-400 max-w-xl md:max-w-2xl font-[system-ui] ml-6 md:ml-10">
                  Organiza tu CV, estrategias e información para contactar y
                  analizar tus postulaciones frente a una oferta de manera más
                  detallada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

import Navbar from "./_reusable/navbar";

export default function Home() {
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
    </main>
  );
}

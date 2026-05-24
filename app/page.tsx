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

      <div className="relative z-10 mx-auto w-[98%] max-w-[1333px] min-h-screen rounded-3xl border border-white/5 bg-neutral-900 px-6 py-16 md:px-10 md:py-24">
        <div className="flex flex-col items-center gap-6 text-center">
          <img
            src="/images/mascota.png"
            alt="Mascota Postulomanía"
            className="h-48 w-48 object-contain drop-shadow-[0_0_40px_rgba(251,191,36,0.3)]"
          />

          <h1 className="font-exo text-6xl font-bold tracking-tight text-white md:text-7xl">
            Postulomaniaco
          </h1>

          <p className="font-amatic-sc text-3xl text-amber-300 md:text-4xl">
            SOFWARE DE EXTRACCION Y GESTION DE VACANTES
          </p>
        </div>
      </div>
    </main>
  );
}

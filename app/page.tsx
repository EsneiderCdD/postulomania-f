import Link from "next/link";

const links = [
  { href: "/principal", label: "Página Principal" },
  { href: "/bodega", label: "Bodega" },
  { href: "/ofertas", label: "Ofertas" },
  { href: "/postulaciones", label: "Postulaciones" },
];

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
        <div className="grid grid-cols-5 grid-rows-5 min-h-screen">
          <div className="col-span-5 row-span-2 flex items-center justify-center">
            <h1 className="hero-title text-7xl md:text-8xl">
              Postulomaniaco
            </h1>
          </div>

          <div className="col-span-3 row-span-3 col-start-3 row-start-3 flex flex-col items-center justify-center gap-6 px-4">
            <p className="hero-subtitle text-center text-3xl md:text-4xl">
              SOFWARE DE EXTRACCION Y GESTION DE VACANTES
            </p>

            <p className="text-center text-sm leading-relaxed text-neutral-400 max-w-md font-[system-ui]">
              Herramienta integral para la búsqueda, extracción y seguimiento de
              ofertas laborales en el ecosistema tech de Antioquia.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {links.map(({ href, label }) => (
                <Link key={href} href={href} className="btn-secondary">
                  {label}
                </Link>
              ))}
            </div>
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

import Link from "next/link";
import { Suspense } from "react";
import LabPanel from "./lab-panel";

const links = [
  { href: "/principal", label: "Principal" },
  { href: "/ofertas", label: "Todas las Ofertas" },
  { href: "/perfil", label: "Perfil" },
  { href: "/bodega", label: "Metricas" },
  { href: "/seguimientos", label: "Seguimientos" },
  { href: "/postulaciones", label: "Postulaciones" },
  { href: "/laboratorio", label: "Laboratorio" },
];

export default function LaboratorioPage() {
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
            Laboratorio de Ofertas
          </h1>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {links.map(({ href, label }) => (
              <Link key={href} href={href} className="btn-secondary">
                {label}
              </Link>
            ))}
          </div>

          <div className="mt-8 w-full space-y-6">
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20 text-sm text-neutral-500">
                  Cargando…
                </div>
              }
            >
              <LabPanel />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/principal", label: "Principal" },
  { href: "/", label: "Home" },
  { href: "/ofertas", label: "Todas las Ofertas" },
  { href: "/perfil", label: "Perfil" },
  { href: "/bodega", label: "Metricas" },
  { href: "/seguimientos", label: "Seguimientos" },
  { href: "/postulaciones", label: "Postulaciones" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 h-screen w-48 border-l border-white/10 bg-neutral-900 p-6">
      <nav className="flex flex-col gap-2">
        {links.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`text-sm ${isActive ? "text-white font-medium" : "text-neutral-400"}`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

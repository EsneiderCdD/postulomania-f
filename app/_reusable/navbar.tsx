import Link from "next/link";

const links = [
  { href: "/principal", label: "Principal" },
  { href: "/ofertas", label: "Todas las Ofertas" },
  { href: "/perfil", label: "Perfil" },
  { href: "/bodega", label: "Metricas" },
  { href: "/seguimientos", label: "Seguimientos" },
  { href: "/postulaciones", label: "Postulaciones" },
];

export default function Navbar() {
  return (
    <nav className="flex items-center justify-center gap-3 px-6 py-4">
      {links.map(({ href, label }) => (
        <Link key={href} href={href} className="btn-secondary">
          {label}
        </Link>
      ))}
    </nav>
  );
}

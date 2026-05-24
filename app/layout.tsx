import type { Metadata } from "next";
import { Exo, Amatic_SC } from "next/font/google";
import "./globals.css";

const exo = Exo({
  subsets: ["latin"],
  variable: "--font-exo",
});

const amaticSC = Amatic_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-amatic-sc",
});

export const metadata: Metadata = {
  title: "Postulomaniaco",
  description: "Frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${exo.variable} ${amaticSC.variable} bg-neutral-950 text-neutral-100 font-exo`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "./_reusable/sidebar";

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
      <body className="bg-neutral-950 text-neutral-100">
        <div className="flex min-h-screen">
          <main className="flex-1">{children}</main>
          <Sidebar />
        </div>
      </body>
    </html>
  );
}

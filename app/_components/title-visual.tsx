"use client";

type TitleStats = {
  metrica: string;
  nube_de_palabras: unknown[];
  nota: string;
};

export default function TitleVisual({ data }: { data: TitleStats }) {
  return (
    <section className="w-full max-w-6xl rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
      <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight text-white">
        {data.metrica}
      </h1>

      <div className="rounded-xl border border-white/10 bg-neutral-950 p-8 text-center">
        <p className="text-6xl">&#8203;</p>
        <p className="text-sm uppercase tracking-wider text-neutral-500">
          Nube de palabras
        </p>
        <p className="mt-4 text-lg text-neutral-400">
          Sin datos disponibles
        </p>
        <p className="mt-2 text-sm text-neutral-600">{data.nota}</p>
      </div>
    </section>
  );
}

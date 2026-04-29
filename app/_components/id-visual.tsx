"use client";

type IdStats = {
  metrica: string;
  auditoria_integridad: {
    total_registros_volumen: number;
    registros_unicos_unicidad: number;
    duplicados_detectados: number;
    tasa_duplicidad: string;
  };
};

export default function IdVisual({ data }: { data: IdStats }) {
  const a = data.auditoria_integridad;

  return (
    <section className="w-full max-w-6xl rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-xl">
      <h1 className="mb-6 text-center text-3xl font-semibold tracking-tight text-white">
        {data.metrica}
      </h1>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Total registros</p>
          <p className="text-3xl font-semibold text-white">
            {a.total_registros_volumen}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Registros únicos</p>
          <p className="text-3xl font-semibold text-white">
            {a.registros_unicos_unicidad}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Duplicados</p>
          <p className="text-3xl font-semibold text-white">
            {a.duplicados_detectados}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-400">Tasa duplicidad</p>
          <p className="text-3xl font-semibold text-white">
            {a.tasa_duplicidad}
          </p>
        </div>
      </div>
    </section>
  );
}

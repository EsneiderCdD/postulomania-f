"use client";

import { useState } from "react";
import { limpiarPostulaciones } from "../actions";

export default function PostulacionesHeader({ total }: { total: number }) {
  const [confirmando, setConfirmando] = useState(false);
  const [limpiando, setLimpiando] = useState(false);

  const handleLimpiar = async () => {
    setLimpiando(true);
    const data = await limpiarPostulaciones();
    if (data?.deleted) {
      window.location.reload();
    } else {
      setLimpiando(false);
      setConfirmando(false);
    }
  };

  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Postulaciones
        </h1>
        <p className="text-sm text-neutral-500">
          {total} postulaciones
        </p>
      </div>
      {total > 0 && (
        <div className="flex gap-2">
          {confirmando ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-400">
                ¿Seguro que querés eliminar todas?
              </span>
              <button
                onClick={handleLimpiar}
                disabled={limpiando}
                className="rounded bg-red-600 px-3 py-2 text-xs text-white hover:bg-red-500 disabled:opacity-50"
              >
                {limpiando ? "Eliminando..." : "Sí, eliminar"}
              </button>
              <button
                onClick={() => setConfirmando(false)}
                className="rounded border border-white/10 px-3 py-2 text-xs text-neutral-400 hover:text-neutral-200"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setConfirmando(true)}
                className="rounded border border-red-500/20 px-4 py-2 text-xs text-red-400 hover:border-red-500/50 hover:text-red-300"
              >
                Limpiar
              </button>
              <a
                href="/api/postulaciones/excel"
                className="rounded border border-white/10 px-4 py-2 text-xs text-neutral-400 hover:border-white/30 hover:text-neutral-200"
              >
                Descargar Excel
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateEmpresa } from "../actions";
import type { MapaResponse } from "./mapa-ofertas";

type EmpresaData = {
  id: number;
  nombre: string;
  website: string | null;
  direccion: string;
  municipio: string;
  departamento: string;
  lat: number | null;
  lng: number | null;
  total_ofertas?: number;
};

type Editando = { empresaId: number; campo: string } | null;

export default function TablaEmpresas({
  data,
  seguidas,
  focusEmpresaId,
  onFocusDone,
}: {
  data: MapaResponse;
  seguidas?: EmpresaData[];
  focusEmpresaId?: number | null;
  onFocusDone?: () => void;
}) {
  const router = useRouter();
  const rowRefs = useRef<Map<number, HTMLTableRowElement>>(new Map());
  const [editando, setEditando] = useState<Editando>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  const allEmpresas = [
    ...data.empresas,
    ...(seguidas ?? []).filter((s) => !data.empresas.some((e) => e.id === s.id)),
  ];

  useEffect(() => {
    if (focusEmpresaId) {
      const row = rowRefs.current.get(focusEmpresaId);
      if (row) {
        row.scrollIntoView({ behavior: "smooth", block: "center" });
        onFocusDone?.();
      }
    }
  }, [focusEmpresaId, onFocusDone]);

  const abrirEdicion = useCallback((empresaId: number, campo: string, valorActual: string | number | null) => {
    setEditando({ empresaId, campo });
    setEditValue(valorActual ?? "");
  }, []);

  const cerrarEdicion = useCallback(() => {
    setEditando(null);
    setEditValue("");
  }, []);

  const guardar = useCallback(async () => {
    if (!editando || saving) return;
    setSaving(true);

    const campo = editando.campo;
    const valor = editando.campo === "lat" || editando.campo === "lng"
      ? parseFloat(editValue)
      : editValue || null;

    await updateEmpresa(editando.empresaId, { [campo]: valor || null });
    router.refresh();
    setEditando(null);
    setEditValue("");
    setSaving(false);
  }, [editando, editValue, saving, router]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") guardar();
      if (e.key === "Escape") cerrarEdicion();
    },
    [guardar, cerrarEdicion],
  );

  function renderCelda(empresaId: number, campo: string, valor: string | number | null, placeholder: string) {
    const editandoEsta = editando?.empresaId === empresaId && editando?.campo === campo;
    if (editandoEsta) {
      return (
        <input
          autoFocus
          type={campo === "lat" || campo === "lng" ? "number" : "text"}
          step="any"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={guardar}
          onKeyDown={handleKeyDown}
          className="w-28 rounded border border-amber-500/50 bg-neutral-800 px-2 py-0.5 text-xs text-white outline-none"
          placeholder={placeholder}
        />
      );
    }

    const display = valor != null ? String(valor) : placeholder;
    const isEmpty = valor == null;

    return (
      <span
        onClick={() => abrirEdicion(empresaId, campo, valor)}
        className={`cursor-pointer transition-colors hover:text-amber-400 ${isEmpty ? "text-neutral-600" : "text-neutral-400"}`}
        title={isEmpty ? "Click para editar" : String(valor)}
      >
        {display}
      </span>
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-900 shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-neutral-300">
          <thead>
            <tr className="border-b border-white/10 bg-neutral-950 text-left text-xs uppercase tracking-wider text-neutral-400">
              <th className="px-5 py-3 font-medium">Nombre</th>
              <th className="px-5 py-3 font-medium">Municipio</th>
              <th className="px-5 py-3 font-medium">Dirección</th>
              <th className="px-5 py-3 font-medium">Web</th>
              <th className="px-5 py-3 font-medium">Lat</th>
              <th className="px-5 py-3 font-medium">Lng</th>
              <th className="px-5 py-3 font-medium text-right">Ofertas</th>
            </tr>
          </thead>
          <tbody>
            {allEmpresas.map((empresa) => (
              <tr
                key={empresa.id}
                ref={(el) => {
                  if (el) rowRefs.current.set(empresa.id, el);
                  else rowRefs.current.delete(empresa.id);
                }}
                className={`border-b border-white/5 transition-colors hover:bg-white/[0.03] ${focusEmpresaId === empresa.id ? "bg-amber-400/5" : ""}`}
              >
                <td className="px-5 py-3 font-medium text-white">
                  {empresa.nombre}
                </td>
                <td className="px-5 py-3">
                  {renderCelda(empresa.id, "municipio", empresa.municipio, "—")}
                </td>
                <td className="px-5 py-3 text-xs">
                  {renderCelda(empresa.id, "direccion", empresa.direccion, "Click para editar")}
                </td>
                <td className="px-5 py-3 text-xs">
                  {renderCelda(empresa.id, "website", empresa.website, "Click para editar")}
                </td>
                <td className="px-5 py-3">
                  {renderCelda(empresa.id, "lat", empresa.lat, "—")}
                </td>
                <td className="px-5 py-3">
                  {renderCelda(empresa.id, "lng", empresa.lng, "—")}
                </td>
                <td className="px-5 py-3 text-right tabular-nums text-neutral-400">
                  {empresa.total_ofertas ?? ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

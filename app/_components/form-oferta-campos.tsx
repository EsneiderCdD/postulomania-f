"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { RefObject } from "react";
import { searchEmpresas, type EmpresaSearchItem } from "../actions";

export type FormCamposFields = {
  id: string;
  id_oferta: string;
  origen_proceso: string;
  titulo: string;
  enlace: string;
  descripcion: string;
  municipio: string;
  departamento: string;
  fecha_publicacion_estimada: string;
  experiencia_anios: string;
  requiere_ingles: boolean;
  keyword: string;
  empresa: string;
  tecnologias: string;
  compatibilidad: string;
};

const inputCls =
  "w-full rounded border border-white/10 bg-neutral-800 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-amber-500/50 placeholder:text-neutral-500";
const labelCls = "block text-xs font-medium text-neutral-400 mb-1";
const hintCls = "mt-0.5 text-[11px] text-neutral-600 leading-tight";

export default function FormOfertaCampos({
  fields,
  set,
  idRef,
  idHint,
  readOnlyId,
  mostrarId,
}: {
  fields: FormCamposFields;
  set: (campo: keyof FormCamposFields, valor: string | boolean) => void;
  idRef?: RefObject<HTMLInputElement | null>;
  idHint?: string;
  readOnlyId?: boolean;
  mostrarId?: boolean;
}) {
  const empresaRef = useRef<HTMLInputElement>(null);
  const empresaListRef = useRef<HTMLUListElement>(null);
  const [empresaAbierto, setEmpresaAbierto] = useState(false);
  const [empresaResultados, setEmpresaResultados] = useState<EmpresaSearchItem[]>([]);
  const [empresaBuscando, setEmpresaBuscando] = useState(false);

  const handleEmpresaInput = useCallback(
    async (valor: string) => {
      set("empresa", valor);
      const t = valor.trim();
      if (t.length < 1) {
        setEmpresaAbierto(false);
        setEmpresaResultados([]);
        return;
      }
      setEmpresaBuscando(true);
      setEmpresaAbierto(true);
      try {
        const items = await searchEmpresas(t);
        setEmpresaResultados(items);
      } catch {
        setEmpresaResultados([]);
      } finally {
        setEmpresaBuscando(false);
      }
    },
    [set],
  );

  const handleEmpresaSelect = useCallback(
    (nombre: string) => {
      set("empresa", nombre);
      setEmpresaAbierto(false);
      setEmpresaResultados([]);
    },
    [set],
  );

  useEffect(() => {
    if (!empresaAbierto) return;
    const handleClick = (e: MouseEvent) => {
      if (
        empresaRef.current &&
        !empresaRef.current.contains(e.target as Node) &&
        empresaListRef.current &&
        !empresaListRef.current.contains(e.target as Node)
      ) {
        setEmpresaAbierto(false);
        setEmpresaResultados([]);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [empresaAbierto]);
  return (
    <>
      {/* ID de BD (solo lectura, visible en edición) */}
      {mostrarId && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>ID</label>
            <input
              className={inputCls + " bg-neutral-900/60 text-amber-400 font-mono"}
              value={fields.id || "Cargando..."}
              readOnly
              disabled
              title="ID autogenerado, no se puede modificar"
            />
            <p className={hintCls}>ID autogenerado. Solo lectura.</p>
          </div>
        </div>
      )}

      {/* sección: requeridos */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>
            ID Oferta <span className="text-red-400">*</span>
          </label>
          <input
            ref={idRef}
            className={inputCls}
            value={fields.id_oferta}
            onChange={(e) => set("id_oferta", e.target.value)}
            required
            readOnly={readOnlyId}
          />
          <p className={hintCls}>
            {idHint ?? "Auto-generado. Podés editarlo si necesitás otro."}
          </p>
        </div>

        <div>
          <label className={labelCls}>
            Origen Proceso <span className="text-red-400">*</span>
          </label>
          <select
            className={inputCls}
            value={fields.origen_proceso}
            onChange={(e) => set("origen_proceso", e.target.value)}
          >
            <option value="dds">DDS</option>
            <option value="dds_full">DDS Full</option>
            <option value="fullstack">Full Stack</option>
            <option value="linkedin">LinkedIn</option>
            <option value="freelance">Freelance</option>
            <option value="otro">Otro</option>
          </select>
        </div>
      </div>

      {/* sección: datos principales */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls}>Título</label>
          <input
            className={inputCls}
            value={fields.titulo}
            onChange={(e) => set("titulo", e.target.value)}
            placeholder="Ej: Desarrollador Frontend React"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>Enlace</label>
          <input
            className={inputCls}
            type="url"
            value={fields.enlace}
            onChange={(e) => set("enlace", e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* descripción */}
      <div>
        <label className={labelCls}>Descripción</label>
        <textarea
          className={inputCls + " h-32 resize-y"}
          value={fields.descripcion}
          onChange={(e) => set("descripcion", e.target.value)}
          placeholder="Descripción de la oferta..."
          rows={5}
        />
      </div>

      {/* ubicación */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Municipio</label>
          <input
            className={inputCls}
            value={fields.municipio}
            onChange={(e) => set("municipio", e.target.value)}
            placeholder="Ej: Medellín"
          />
          <p className={hintCls}>
            Campo vacío = sin información. No uses &quot;-&quot; o
            &quot;null&quot;.
          </p>
        </div>
        <div>
          <label className={labelCls}>Departamento</label>
          <input
            className={inputCls}
            value={fields.departamento}
            onChange={(e) => set("departamento", e.target.value)}
            placeholder="Ej: Antioquia"
          />
          <p className={hintCls}>
            Campo vacío = sin información. No uses &quot;-&quot; o
            &quot;null&quot;.
          </p>
        </div>
      </div>

      {/* detalles */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className={labelCls}>Fecha publicación</label>
          <input
            className={inputCls}
            type="datetime-local"
            value={fields.fecha_publicacion_estimada}
            onChange={(e) =>
              set("fecha_publicacion_estimada", e.target.value)
            }
          />
          <p className={hintCls}>Campo vacío = sin información.</p>
        </div>
        <div>
          <label className={labelCls}>Años experiencia</label>
          <input
            className={inputCls}
            type="number"
            step="0.5"
            min="0"
            value={fields.experiencia_anios}
            onChange={(e) => set("experiencia_anios", e.target.value)}
            placeholder="Ej: 2"
          />
          <p className={hintCls}>Campo vacío = sin información.</p>
        </div>
        <div>
          <label className={labelCls}>Keyword</label>
          <input
            className={inputCls}
            value={fields.keyword}
            onChange={(e) => set("keyword", e.target.value)}
            placeholder="Ej: react"
          />
          <p className={hintCls}>Campo vacío = sin información.</p>
        </div>
      </div>

      {/* tecnologías */}
      <div>
        <label className={labelCls}>Tecnologías</label>
        <input
          className={inputCls}
          value={fields.tecnologias}
          onChange={(e) => set("tecnologias", e.target.value)}
          placeholder="Ej: React, PostgreSQL, Docker"
        />
        <p className={hintCls}>
          Separadas por coma. Si no conocés las tecnologías, dejalo vacío
          y registralas después.
        </p>
      </div>

      {/* compatibilidad */}
      <div>
        <label className={labelCls}>Compatibilidad (%)</label>
        <input
          className={inputCls}
          type="number"
          step="0.1"
          min="0"
          max="100"
          value={fields.compatibilidad}
          onChange={(e) => set("compatibilidad", e.target.value)}
          placeholder="Ej: 6"
        />
        <p className={hintCls}>
          Fórmula: % de tecnologías de la oferta que manejás. Ej: si la oferta
          pide 4 y manejás 3 → 75%. Si no lo calculás ahora, dejalo vacío y
          registralo después.
        </p>
      </div>

      {/* extras */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="relative">
          <label className={labelCls}>Empresa</label>
          <input
            ref={empresaRef}
            className={inputCls}
            value={fields.empresa}
            onChange={(e) => handleEmpresaInput(e.target.value)}
            onFocus={() => {
              if (fields.empresa.trim()) handleEmpresaInput(fields.empresa);
            }}
            placeholder="Ej: Pragma"
            autoComplete="off"
          />
          {empresaAbierto && (
            <ul
              ref={empresaListRef}
              className="absolute z-20 mt-1 w-full rounded-lg border border-white/10 bg-neutral-800 shadow-xl max-h-48 overflow-y-auto"
            >
              {empresaBuscando && (
                <li className="px-3 py-2 text-xs text-neutral-500">
                  Buscando...
                </li>
              )}
              {!empresaBuscando && empresaResultados.length === 0 && (
                <li className="px-3 py-2 text-xs text-neutral-500">
                  Sin coincidencias. Se creará una nueva empresa.
                </li>
              )}
              {empresaResultados.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => handleEmpresaSelect(e.nombre)}
                    className="w-full px-3 py-2 text-left text-sm text-white transition-colors hover:bg-amber-500/10 hover:text-amber-400"
                  >
                    {e.nombre}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className={hintCls}>
            Escribí para buscar empresa existente. Si no aparece, se crea una nueva.
            Campo vacío = sin empresa asociada.
          </p>
        </div>

        <div className="flex items-end pb-2">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={fields.requiere_ingles}
              onChange={(e) => set("requiere_ingles", e.target.checked)}
              className="h-4 w-4 rounded border-white/10 bg-neutral-800 accent-amber-500"
            />
            <span className="text-sm text-neutral-300">Requiere inglés</span>
          </label>
        </div>
      </div>
    </>
  );
}

export const CAMPOS_INITIAL: FormCamposFields = {
  id: "",
  id_oferta: "",
  origen_proceso: "dds",
  titulo: "",
  enlace: "",
  descripcion: "",
  municipio: "",
  departamento: "",
  fecha_publicacion_estimada: "",
  experiencia_anios: "",
  requiere_ingles: false,
  keyword: "",
  empresa: "",
  tecnologias: "",
  compatibilidad: "",
};

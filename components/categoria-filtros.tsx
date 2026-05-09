"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

type Props = {
  marcas: string[];
};

const ORDEN_OPTIONS = [
  { value: "nombre", label: "Nombre A-Z" },
  { value: "semanal_asc", label: "Pago semanal: menor a mayor" },
  { value: "semanal_desc", label: "Pago semanal: mayor a menor" },
  { value: "credito_asc", label: "Precio: menor a mayor" },
  { value: "credito_desc", label: "Precio: mayor a menor" },
];

export function CategoriaFiltros({ marcas }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value === null || value === "") next.delete(key);
    else next.set(key, value);
    router.replace(`${pathname}?${next.toString()}`);
  }

  const marca = params.get("marca") ?? "";
  const orden = params.get("orden") ?? "nombre";
  const semanalMin = params.get("semanalMin") ?? "";
  const semanalMax = params.get("semanalMax") ?? "";

  const hayFiltros = marca || semanalMin || semanalMax;

  function clearAll() {
    router.replace(pathname);
  }

  return (
    <aside className="space-y-6 rounded-lg border bg-card p-4 text-sm md:sticky md:top-20 md:max-h-[calc(100vh-6rem)] md:overflow-y-auto">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Filtros</h3>
        {hayFiltros && (
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            Limpiar
          </button>
        )}
      </div>

      <div>
        <label className="mb-2 block font-medium text-foreground/80">
          Ordenar por
        </label>
        <select
          value={orden}
          onChange={(e) => setParam("orden", e.target.value)}
          className="w-full rounded border px-2 py-1.5 text-sm"
        >
          {ORDEN_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {marcas.length > 1 && (
        <div>
          <label className="mb-2 block font-medium text-foreground/80">Marca</label>
          <select
            value={marca}
            onChange={(e) => setParam("marca", e.target.value)}
            className="w-full rounded border px-2 py-1.5 text-sm"
          >
            <option value="">Todas</option>
            {marcas.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="mb-2 block font-medium text-foreground/80">
          Pago semanal
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Mín"
            value={semanalMin}
            onChange={(e) => setParam("semanalMin", e.target.value || null)}
            className="w-full rounded border px-2 py-1.5 text-sm"
          />
          <span className="text-muted-foreground/70">—</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Máx"
            value={semanalMax}
            onChange={(e) => setParam("semanalMax", e.target.value || null)}
            className="w-full rounded border px-2 py-1.5 text-sm"
          />
        </div>
      </div>
    </aside>
  );
}

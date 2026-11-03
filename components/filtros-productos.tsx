"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowUpDown, Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Opcion = { value: string | null; label: string };

type Props = {
  marcas: string[];
  /** Solo en /productos: filtro por categoría. */
  categorias?: { id: string; nombre: string }[];
};

const ORDEN_OPTIONS: Opcion[] = [
  { value: "nombre", label: "Nombre A-Z" },
  { value: "semanal_asc", label: "Pago semanal: menor a mayor" },
  { value: "semanal_desc", label: "Pago semanal: mayor a menor" },
  { value: "credito_asc", label: "Precio: menor a mayor" },
  { value: "credito_desc", label: "Precio: mayor a menor" },
];

/**
 * Barra de filtros de los listados (categoría y todos los productos).
 * Arriba de la grilla en vez de sidebar: en celular solo se ven el buscador y
 * el botón "Filtros", que despliega el resto. Los selects son los de la UI
 * (popup con colores del tema): los <select> nativos pintaban la lista blanca
 * con texto claro en modo oscuro.
 */
export function FiltrosProductos({ marcas, categorias }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [abierto, setAbierto] = useState(false);

  // Último cambio enviado que la URL aún no refleja: si se cambian dos filtros
  // seguidos, el segundo se arma sobre el primero y no lo pisa.
  const pendiente = useRef<string | null>(null);
  useEffect(() => {
    if (params.toString() === pendiente.current) pendiente.current = null;
  }, [params]);

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(pendiente.current ?? params.toString());
    if (value === null || value === "") next.delete(key);
    else next.set(key, value);
    pendiente.current = next.toString();
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function limpiar() {
    pendiente.current = null;
    router.replace(pathname, { scroll: false });
  }

  const q = params.get("q") ?? "";
  const orden = params.get("orden") ?? "nombre";
  const categoria = params.get("categoria");
  const marca = params.get("marca");
  const semanalMin = params.get("semanalMin") ?? "";
  const semanalMax = params.get("semanalMax") ?? "";

  const activos = [categoria, marca, semanalMin, semanalMax].filter(Boolean).length;
  const hayFiltros = activos > 0 || q !== "" || orden !== "nombre";

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-2.5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 md:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <CampoDiferido
            type="search"
            inicial={q}
            onCommit={(v) => setParam("q", v.trim() || null)}
            placeholder="Marca o modelo…"
            aria-label="Buscar por marca o modelo"
            className="h-9 pl-8"
          />
        </div>

        <button
          type="button"
          onClick={() => setAbierto((a) => !a)}
          aria-expanded={abierto}
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-input px-3 text-sm font-medium transition-colors hover:bg-muted md:hidden dark:bg-input/30"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
          {activos > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-700 px-1 text-[11px] font-semibold text-white dark:bg-blue-600">
              {activos}
            </span>
          )}
        </button>

        {/* En celular es un panel plegable en 2 columnas; en md+ `contents`
            suelta los controles en la misma fila que el buscador. */}
        <div
          className={cn(
            "w-full grid-cols-2 gap-2 md:contents",
            abierto ? "grid" : "hidden"
          )}
        >
          <FiltroSelect
            opciones={ORDEN_OPTIONS}
            valor={orden}
            onCambio={(v) => setParam("orden", v === "nombre" ? null : v)}
            icono={<ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />}
            className="col-span-2 sm:col-span-1"
          />
          {categorias && categorias.length > 0 && (
            <FiltroSelect
              opciones={[
                { value: null, label: "Todas las categorías" },
                ...categorias.map((c) => ({ value: c.id, label: c.nombre.trim() })),
              ]}
              valor={categoria}
              vacio="Categoría"
              onCambio={(v) => setParam("categoria", v)}
            />
          )}
          {(marcas.length > 1 || marca) && (
            <FiltroSelect
              opciones={[
                { value: null, label: "Todas las marcas" },
                ...marcas.map((m) => ({ value: m, label: m })),
              ]}
              valor={marca}
              vacio="Marca"
              onCambio={(v) => setParam("marca", v)}
            />
          )}

          <div className="col-span-2 flex items-center gap-1.5 sm:col-span-1">
            <span className="shrink-0 text-xs text-muted-foreground">
              Pago semanal
            </span>
            <CampoDiferido
              type="number"
              inputMode="numeric"
              inicial={semanalMin}
              onCommit={(v) => setParam("semanalMin", v || null)}
              placeholder="Mín"
              aria-label="Pago semanal mínimo"
              className="h-9 md:w-20"
            />
            <span className="text-muted-foreground/70">—</span>
            <CampoDiferido
              type="number"
              inputMode="numeric"
              inicial={semanalMax}
              onCommit={(v) => setParam("semanalMax", v || null)}
              placeholder="Máx"
              aria-label="Pago semanal máximo"
              className="h-9 md:w-20"
            />
          </div>

          {hayFiltros && (
            <button
              type="button"
              onClick={limpiar}
              className="col-span-2 flex h-9 items-center justify-center gap-1 rounded-lg px-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:col-span-1 md:ml-auto"
            >
              <X className="h-3.5 w-3.5" />
              Limpiar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FiltroSelect({
  opciones,
  valor,
  vacio,
  onCambio,
  icono,
  className,
}: {
  opciones: Opcion[];
  valor: string | null;
  /** Texto corto del botón cuando no hay nada elegido ("Todas las
   * categorías" no cabe en la columna del celular). */
  vacio?: string;
  onCambio: (v: string | null) => void;
  icono?: React.ReactNode;
  className?: string;
}) {
  return (
    <Select
      items={opciones}
      value={valor}
      onValueChange={(v) => onCambio((v as string | null) ?? null)}
    >
      <SelectTrigger className={cn("h-9 w-full min-w-0 md:w-auto md:max-w-56", className)}>
        {icono}
        <SelectValue>
          {(v: string | null) =>
            v === null && vacio ? (
              <span className="text-muted-foreground">{vacio}</span>
            ) : (
              opciones.find((o) => o.value === v)?.label
            )
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {opciones.map((o) => (
          <SelectItem key={o.value ?? "todas"} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Input que espera a que el cliente deje de escribir para filtrar: evita
 * recargar la lista con cada tecla. `inicial` es el valor en la URL. */
function CampoDiferido({
  inicial,
  onCommit,
  ...props
}: { inicial: string; onCommit: (v: string) => void } & Omit<
  React.ComponentProps<typeof Input>,
  "value" | "defaultValue" | "onChange"
>) {
  const [valor, setValor] = useState(inicial);
  // Último valor que este campo mandó a la URL.
  const [enviado, setEnviado] = useState(inicial);
  const [previo, setPrevio] = useState(inicial);
  if (inicial !== previo) {
    setPrevio(inicial);
    // Si la URL cambió por fuera (p. ej. "Limpiar") el campo la adopta; si es
    // el eco de lo que el campo envió, se respeta lo que se siga escribiendo.
    if (inicial !== enviado) setValor(inicial);
  }

  useEffect(() => {
    if (valor === inicial) return;
    const t = setTimeout(() => {
      setEnviado(valor);
      onCommit(valor);
    }, 400);
    return () => clearTimeout(t);
  }, [valor, inicial, onCommit]);

  return <Input {...props} value={valor} onChange={(e) => setValor(e.target.value)} />;
}

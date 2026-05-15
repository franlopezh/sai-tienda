import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatMXN } from "@/lib/format";
import { calcularPlanDefault } from "@/lib/credito";
import type { Producto } from "@/lib/types";

const DIAS_NUEVO = 30;

function getBadge(p: Producto): { label: string; tone: string } | null {
  const ahora = Date.now();
  const creado = p.created_at ? Date.parse(p.created_at) : 0;
  const esNuevo =
    creado > 0 && (ahora - creado) / (1000 * 60 * 60 * 24) <= DIAS_NUEVO;

  if (esNuevo) {
    return { label: "Nuevo", tone: "bg-blue-600 text-white" };
  }

  if (!p.enganche || p.enganche === 0) {
    return { label: "Sin enganche", tone: "bg-emerald-600 text-white" };
  }

  return null;
}

export function ProductCard({ producto }: { producto: Producto }) {
  const badge = getBadge(producto);

  // Calcular pago al vuelo desde precio_contado con el plan default
  // del segmento del producto (pequenos/medianos/grandes).
  // Esto reemplaza la dependencia de pago_semanal/pago_diario/precio_credito
  // de BD, que pueden estar desactualizados o NULL en productos nuevos.
  const precio = producto.precio_contado ?? 0;
  const plan = precio > 0 ? calcularPlanDefault(precio) : null;
  const pagoSemanal = plan?.pagoSemanal ?? producto.pago_semanal ?? 0;
  const pagoDiario = plan?.pagoDiario ?? producto.pago_diario ?? 0;
  const totalFinanciado = plan?.total ?? producto.precio_credito ?? 0;

  return (
    <Link href={`/producto/${producto.slug}`} className="group block h-full">
      <Card className="flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:border-blue-300 animate-in fade-in-0 slide-in-from-bottom-2 fill-mode-both">
        <div className="relative h-44 w-full shrink-0 flex items-center justify-center text-muted-foreground/40 p-4 md:h-52">
          {badge && (
            <span
              className={`absolute top-3 left-3 z-10 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow-sm ${badge.tone}`}
            >
              {badge.label}
            </span>
          )}
          {producto.imagen_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={producto.imagen_url}
              alt={producto.nombre}
              loading="lazy"
              className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-[1.05]"
            />
          ) : (
            <span className="text-5xl">📦</span>
          )}
        </div>
        <CardContent className="border-t p-4">
          {producto.marca && (
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {producto.marca.trim()}
            </p>
          )}
          <h3 className="mt-1 line-clamp-2 text-sm font-medium">
            {producto.nombre}
          </h3>
          {pagoDiario > 0 ? (
            <div className="mt-3">
              <p className="text-base font-semibold">
                {formatMXN(pagoDiario)}
                <span className="text-xs font-normal text-muted-foreground">
                  {" "}/ día
                </span>
              </p>
              {pagoSemanal > 0 ? (
                <p className="text-xs text-muted-foreground">
                  o {formatMXN(pagoSemanal)} / semana
                </p>
              ) : null}
            </div>
          ) : pagoSemanal > 0 ? (
            <p className="mt-3 text-base font-semibold">
              {formatMXN(pagoSemanal)}
              <span className="text-xs font-normal text-muted-foreground">
                {" "}/ semana
              </span>
            </p>
          ) : precio > 0 ? (
            <p className="mt-3 text-base font-semibold">{formatMXN(precio)}</p>
          ) : null}
          {totalFinanciado > 0 ? (
            <p className="mt-0.5 text-xs text-muted-foreground">
              o {formatMXN(totalFinanciado)} financiado
            </p>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}

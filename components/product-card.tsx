import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { formatMXN } from "@/lib/format";
import { calcularPlanDefault, getPrecioPublico } from "@/lib/credito";
import { cn } from "@/lib/utils";
import type { Producto } from "@/lib/types";

const DIAS_NUEVO = 30;

function getBadge(p: Producto): { label: string; tone: string } | null {
  if (p.activo === false) {
    return { label: "Agotado", tone: "bg-zinc-700/90 text-white" };
  }
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

export function ProductCard({
  producto,
  index = 0,
}: {
  producto: Producto;
  index?: number;
}) {
  const badge = getBadge(producto);
  const agotado = producto.activo === false;
  const animationDelay = `${Math.min(index, 11) * 50}ms`;

  const precio = getPrecioPublico(producto);
  const plan = precio > 0 ? calcularPlanDefault(precio) : null;
  const pagoDiario = plan?.pagoDiario ?? producto.pago_diario ?? 0;
  const pagoSemanal = plan?.pagoSemanal ?? producto.pago_semanal ?? 0;
  const enganche = plan?.enganche ?? producto.enganche ?? 0;
  const plazoMeses = plan?.plazoMeses ?? null;

  return (
    <Link href={`/producto/${producto.slug}`} className="group block h-full">
      <Card
        className="flex h-full flex-col overflow-hidden rounded-2xl border-border/40 bg-white p-0 transition-all duration-300 hover:-translate-y-1 hover:border-blue-300/60 hover:shadow-xl active:translate-y-0 active:scale-[0.99] active:duration-100 dark:bg-card dark:hover:border-blue-700/60 animate-in fade-in-0 slide-in-from-bottom-3 fill-mode-both"
        style={{ animationDuration: "500ms", animationDelay }}
      >
        {/* Imagen flotante aspect-square */}
        <div className="relative aspect-square w-full overflow-hidden bg-white">
          {badge && (
            <span
              className={`absolute left-3 top-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider shadow-sm backdrop-blur-sm ${badge.tone}`}
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
              className={cn(
                "absolute inset-0 h-full w-full object-contain p-8 transition-transform duration-500 ease-out group-hover:-translate-y-2",
                agotado && "opacity-60 grayscale"
              )}
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-6xl text-muted-foreground/30">
              📦
            </span>
          )}
        </div>

        {/* Info — centrada, editorial */}
        <div className="flex flex-1 flex-col items-center gap-2 px-5 pb-5 pt-3 text-center">
          {producto.marca && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {producto.marca.trim()}
            </p>
          )}
          <h3 className="line-clamp-2 font-sans text-sm font-semibold leading-snug tracking-normal text-foreground md:text-base">
            {producto.nombre}
          </h3>

          {/* Precio principal centrado */}
          {pagoDiario > 0 ? (
            <p className="mt-1 font-mono text-xl font-bold tabular-nums tracking-tight text-foreground">
              {formatMXN(pagoDiario)}
              <span className="ml-1 font-sans text-xs font-normal text-muted-foreground">
                / día
              </span>
            </p>
          ) : pagoSemanal > 0 ? (
            <p className="mt-1 font-mono text-xl font-bold tabular-nums tracking-tight text-foreground">
              {formatMXN(pagoSemanal)}
              <span className="ml-1 font-sans text-xs font-normal text-muted-foreground">
                / semana
              </span>
            </p>
          ) : precio > 0 ? (
            <p className="mt-1 font-mono text-xl font-bold tabular-nums tracking-tight text-foreground">
              {formatMXN(precio)}
            </p>
          ) : null}

          {/* Tags/pills con plazo y enganche */}
          {(plazoMeses || enganche > 0) && (
            <div className="mt-1 flex items-center justify-center gap-1.5">
              {plazoMeses && (
                <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] font-medium tabular-nums text-muted-foreground">
                  {Number.isInteger(plazoMeses)
                    ? `${plazoMeses} m`
                    : `${plazoMeses} m`}
                </span>
              )}
              {enganche > 0 && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  <span className="font-sans">Eng. </span>
                  <span className="font-mono tabular-nums">{formatMXN(enganche)}</span>
                </span>
              )}
            </div>
          )}

          {/* CTA que aparece on hover (oculto si agotado) */}
          {!agotado && (
            <div className="mt-3 flex w-full items-center justify-center gap-1 rounded-full bg-blue-700 px-4 py-2 text-xs font-semibold text-white opacity-0 transition-all duration-300 group-hover:opacity-100 dark:bg-blue-600">
              Financiar
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}

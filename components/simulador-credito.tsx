"use client";

import { useMemo, useState } from "react";
import {
  calcularPlanes,
  getPlazoDefault,
  getPrecioPublico,
  type PlanCredito,
} from "@/lib/credito";
import { formatMXN } from "@/lib/format";
import type { Producto } from "@/lib/types";
import { LeadModal } from "@/components/lead-modal";
import { cn } from "@/lib/utils";

type Props = {
  producto: Producto;
};

function formatPlazo(meses: number): string {
  return Number.isInteger(meses) ? `${meses} meses` : `${meses} meses`;
}

export function SimuladorCredito({ producto }: Props) {
  const precio = getPrecioPublico(producto);
  const planes = useMemo(() => calcularPlanes(precio), [precio]);
  const planDefault =
    planes.find((p) => p.plazo === getPlazoDefault(precio)) ?? planes[0];
  const [seleccionado, setSeleccionado] = useState<PlanCredito>(planDefault);

  if (!precio || precio <= 0 || planes.length === 0) return null;

  const gridCols =
    planes.length === 4
      ? "grid-cols-2 lg:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-3";

  return (
    <section className="mt-2">
      <header className="mb-4">
        <h2 className="text-base font-semibold tracking-tight">
          Simula tu crédito
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Elige el plazo que mejor se acomode. El enganche es del 10% del total.
        </p>
      </header>

      <div className={cn("grid gap-3", gridCols)}>
        {planes.map((plan) => {
          const activo = plan.plazo === seleccionado.plazo;
          return (
            <button
              key={plan.plazo}
              type="button"
              onClick={() => setSeleccionado(plan)}
              aria-pressed={activo}
              className={cn(
                "group/plan relative cursor-pointer rounded-xl border bg-card p-4 text-left transition-all duration-300 ease-out",
                "hover:-translate-y-1 hover:shadow-lg",
                "active:translate-y-0 active:scale-[0.98] active:duration-100",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
                activo
                  ? "border-blue-600 shadow-md ring-1 ring-blue-600/20 dark:border-blue-500 dark:ring-blue-500/30"
                  : "border-border/50 hover:border-blue-300/70 dark:hover:border-blue-700/60"
              )}
            >
              {/* Marca de selección sutil */}
              {activo && (
                <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-500" />
              )}

              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={cn(
                    "text-sm font-semibold transition-colors",
                    activo
                      ? "text-blue-700 dark:text-blue-400"
                      : "text-foreground"
                  )}
                >
                  {formatPlazo(plan.plazoMeses)}
                </span>
                <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  {plan.semanas} sem
                </span>
              </div>

              <div className="mt-3">
                <div className="font-mono text-2xl font-bold leading-tight tabular-nums tracking-tight text-foreground">
                  {formatMXN(plan.pagoSemanal)}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  por semana
                </div>
              </div>

              <dl className="mt-3 space-y-1.5 border-t border-border/40 pt-3 text-[11px]">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Por día</dt>
                  <dd className="font-mono font-medium tabular-nums text-foreground">
                    {formatMXN(plan.pagoDiario)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Enganche</dt>
                  <dd className="font-mono font-medium tabular-nums text-foreground">
                    {formatMXN(plan.enganche)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Total</dt>
                  <dd className="font-mono font-semibold tabular-nums text-foreground">
                    {formatMXN(plan.total)}
                  </dd>
                </div>
              </dl>
            </button>
          );
        })}
      </div>

      {/* Caja resumen + CTA — más integrada */}
      <div className="mt-4 flex flex-col gap-2 rounded-xl border border-border/50 bg-gradient-to-br from-blue-50/60 to-transparent p-4 sm:flex-row sm:items-center sm:justify-between dark:from-blue-950/30 dark:to-transparent">
        <p className="text-xs text-muted-foreground">
          Plan elegido:{" "}
          <span className="font-semibold text-foreground">
            {formatPlazo(seleccionado.plazoMeses)}
          </span>
          {" · "}
          <span className="font-mono font-semibold tabular-nums text-blue-700 dark:text-blue-400">
            {formatMXN(seleccionado.pagoSemanal)}
          </span>
          <span className="text-muted-foreground">/semana</span>
        </p>
        <div className="shrink-0">
          <LeadModal
            producto={producto}
            pagoSemanal={seleccionado.pagoSemanal}
            semanas={seleccionado.semanas}
            planSeleccionado={seleccionado}
            ctaLabel="💬 Quiero este plan"
          />
        </div>
      </div>
    </section>
  );
}

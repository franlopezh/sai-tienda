"use client";

import { useMemo, useState } from "react";
import {
  calcularPlanes,
  getPlazoDefault,
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
  const precio = producto.precio_contado ?? 0;
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
      <header className="mb-3">
        <h2 className="text-base font-semibold tracking-tight">
          Simula tu crédito
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Elige el plazo. El enganche es del 10% del total.
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
                "rounded-lg border bg-card p-4 text-left transition",
                "hover:-translate-y-0.5 hover:shadow-md",
                activo
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border opacity-80 hover:opacity-100"
              )}
            >
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold">
                  {formatPlazo(plan.plazoMeses)}
                </span>
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {plan.semanas} sem
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold leading-tight tracking-tight">
                  {formatMXN(plan.pagoSemanal)}
                </div>
                <div className="text-xs text-muted-foreground">por semana</div>
              </div>
              <dl className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Por día</dt>
                  <dd>{formatMXN(plan.pagoDiario)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Enganche</dt>
                  <dd>{formatMXN(plan.enganche)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Total a pagar</dt>
                  <dd className="font-medium text-foreground">
                    {formatMXN(plan.total)}
                  </dd>
                </div>
              </dl>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-2 rounded-lg border bg-muted/40 p-3 sm:flex-row sm:items-center sm:justify-between dark:bg-zinc-900/40">
        <p className="text-xs text-muted-foreground">
          Plan elegido:{" "}
          <span className="font-medium text-foreground">
            {formatPlazo(seleccionado.plazoMeses)}
          </span>
          {" · "}
          <span className="font-medium text-foreground">
            {formatMXN(seleccionado.pagoSemanal)}
          </span>
          /semana
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

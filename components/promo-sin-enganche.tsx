import Link from "next/link";
import { ArrowRight, CalendarDays, Info } from "lucide-react";
import { PromoVideo } from "@/components/promo-video";
import { PROMO_SIN_ENGANCHE, type FasePromo } from "@/lib/promo";
import { cn } from "@/lib/utils";

/**
 * Banner de la promo de 0% de enganche en el inicio: texto + flyer + video.
 * La home decide si se muestra según la fase (lib/promo.ts) y dónde va
 * (`className`); aquí solo cambia el tono entre "ya viene" y "ya comenzó".
 */
export function PromoSinEnganche({
  fase,
  className,
}: {
  fase: FasePromo;
  className?: string;
}) {
  const activa = fase === "activa";
  const p = PROMO_SIN_ENGANCHE;
  const fechas = `${p.fechas.charAt(0).toUpperCase()}${p.fechas.slice(1)}`;

  return (
    <section className={cn("mx-auto max-w-6xl px-4", className)}>
      <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-800 to-blue-900 p-6 text-white shadow-2xl ring-1 ring-white/15 md:grid-cols-[1fr_auto] md:p-10">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider ring-1 ring-white/20">
            <CalendarDays className="h-3.5 w-3.5" />
            {activa ? "¡Ya comenzó! · Termina el 7 de noviembre" : `Muy pronto · ${p.fechas}`}
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            {p.nombre}:{" "}
            <span className="text-red-400">0% de enganche</span>
          </h2>
          <p className="mt-3 max-w-md text-base text-blue-100">
            {activa
              ? `Solo ${p.fechas}, ${p.descripcionArticulos} se van sin enganche. Financias el 100% y pagas en semanas.`
              : `${fechas}, ${p.descripcionArticulos} se van sin enganche. Ve eligiendo el tuyo.`}
          </p>
          <Link
            href="/sin-enganche"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-blue-800 shadow-md transition hover:bg-blue-50"
          >
            {activa ? "Ver artículos sin enganche" : "Ver artículos participantes"}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-5 flex max-w-md gap-2 rounded-lg bg-white/10 px-3 py-2.5 text-xs leading-relaxed text-blue-100 ring-1 ring-white/15">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {p.disclaimerCorto}
          </p>
        </div>

        {/* Columnas en proporción a los aspectos del flyer (1122×1402) y del
            video (9:16) para que ambos queden a la misma altura. */}
        <div className="grid grid-cols-[1.42fr_1fr] gap-3 md:w-[30rem] lg:w-[34rem]">
          <a
            href={p.flyer}
            target="_blank"
            rel="noopener"
            className="block overflow-hidden rounded-2xl ring-1 ring-white/20 transition hover:ring-white/50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.flyer}
              alt={`Flyer ${p.nombre}: 0% de enganche ${p.fechas}`}
              loading="lazy"
              className="aspect-[1122/1402] w-full object-cover"
            />
          </a>
          <PromoVideo
            src={p.video}
            poster={p.videoPoster}
            label={`Video ${p.nombre}: 0% de enganche ${p.fechas}`}
            className="aspect-[9/16] rounded-2xl ring-1 ring-white/20"
          />
        </div>
      </div>
    </section>
  );
}

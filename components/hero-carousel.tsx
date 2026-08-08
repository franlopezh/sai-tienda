"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  image?: string;
  imageAlt?: string;
  // Gradiente del fondo. Se mantiene SAI blue por default pero permite variantes por slide.
  bgGradient?: string;
};

type Props = {
  slides: HeroSlide[];
  intervalMs?: number;
};

export function HeroCarousel({ slides, intervalMs = 6000 }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(
    () => setCurrent((c) => (c + 1) % slides.length),
    [slides.length]
  );
  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const t = setInterval(next, intervalMs);
    return () => clearInterval(t);
  }, [paused, slides.length, intervalMs, next]);

  if (slides.length === 0) return null;

  return (
    <section
      className="group relative w-full overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Productos destacados"
    >
      <div className="relative">
        {slides.map((slide, idx) => {
          const isActive = idx === current;
          return (
            <article
              key={idx}
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out",
                isActive
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0"
              )}
            >
              <div
                className={cn(
                  "h-full w-full bg-gradient-to-br text-white",
                  slide.bgGradient ?? "from-blue-900 via-blue-700 to-blue-500"
                )}
              >
                <div className="mx-auto grid h-full max-w-6xl gap-2 px-6 sm:px-10 md:grid-cols-2 md:items-center md:gap-6 md:px-12 lg:px-16">
                  {/* En mobile: imagen va primero (arriba), texto después.
                      En md+: texto a la izq, imagen a la der (orden natural). */}
                  <div className="order-2 pb-56 text-center md:order-1 md:pt-32 md:pb-64 md:text-left">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-200">
                      {slide.eyebrow}
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight md:mt-3 md:text-5xl md:leading-tight lg:text-6xl">
                      {slide.title}
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-sm text-blue-100 md:mx-0 md:mt-4 md:text-lg">
                      {slide.subtitle}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-3 md:mt-7 md:justify-start">
                      <Link
                        href={slide.ctaPrimary.href}
                        className={cn(
                          buttonVariants({ size: "lg" }),
                          "rounded-full bg-white text-blue-800 hover:bg-blue-50"
                        )}
                      >
                        {slide.ctaPrimary.label}
                      </Link>
                      {slide.ctaSecondary && (
                        <Link
                          href={slide.ctaSecondary.href}
                          className={cn(
                            buttonVariants({ size: "lg", variant: "outline" }),
                            "rounded-full border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                          )}
                        >
                          {slide.ctaSecondary.label}
                        </Link>
                      )}
                    </div>
                  </div>
                  {slide.image && (
                    <div className="order-1 flex items-center justify-center pt-28 md:order-2 md:h-full md:pb-48 md:pt-32">
                      {/* Marco blanco redondeado: encuadra la foto como una ficha
                          del carrusel en vez de una imagen pegada al degradado.
                          De paso uniforma el tamaño — el cuadrado fijo + contain
                          da la misma presencia a fotos de cualquier proporción. */}
                      <div className="flex aspect-square h-64 items-center justify-center overflow-hidden rounded-3xl bg-white p-2 shadow-2xl ring-1 ring-black/5 md:h-[19rem] md:p-2.5 lg:h-[26rem] xl:h-[30rem]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={slide.image}
                          alt={slide.imageAlt ?? slide.title}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        {/* Spacer para forzar altura, el slide activo lo cubre con absolute */}
        <div className="invisible">
          <div className="mx-auto grid max-w-6xl gap-2 px-6 md:grid-cols-2 md:items-center md:gap-6 md:px-12">
            {/* Texto (orden invertido en mobile como el slide real) */}
            <div className="order-2 pb-56 md:order-1 md:pt-32 md:pb-64">
              <p className="text-[11px]">eyebrow</p>
              <h2 className="mt-2 text-2xl md:mt-3 md:text-5xl md:leading-tight lg:text-6xl">
                Placeholder altura
                <br />
                dos líneas mínimo
              </h2>
              <p className="mt-3 text-sm md:mt-4 md:text-lg">subtitle</p>
              <div className="mt-5 h-12 md:mt-7" />
            </div>
            {/* Imagen (placeholder de altura) — debe seguir al marco blanco de
                arriba: como es aspect-square, su alto = su ancho tope. */}
            <div className="order-1 h-64 pt-28 md:order-2 md:h-[19rem] md:pt-32 lg:h-[26rem] xl:h-[30rem]" />
          </div>
        </div>

        {/* Flechas — pegadas al borde de la pantalla, fuera del max-w del contenido */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition-all duration-200 hover:scale-110 hover:bg-white/25 active:scale-95 active:duration-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:left-4 md:h-12 md:w-12"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Siguiente"
              className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition-all duration-200 hover:scale-110 hover:bg-white/25 active:scale-95 active:duration-100 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:right-4 md:h-12 md:w-12"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </>
        )}

        {/* Dots */}
        {slides.length > 1 && (
          <div
            role="tablist"
            aria-label="Slides"
            className="absolute bottom-32 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 md:bottom-40"
          >
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={idx === current}
                aria-label={`Slide ${idx + 1}`}
                onClick={() => setCurrent(idx)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  idx === current
                    ? "w-8 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/70"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

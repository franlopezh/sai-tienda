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
      className="group relative mx-auto max-w-6xl px-4 pt-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Productos destacados"
    >
      <div className="relative overflow-hidden rounded-2xl shadow-xl">
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
                <div className="grid h-full gap-6 md:grid-cols-2 md:items-center">
                  <div className="px-6 py-12 md:px-12 md:py-20">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-200">
                      {slide.eyebrow}
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl md:leading-tight">
                      {slide.title}
                    </h2>
                    <p className="mt-4 max-w-md text-base text-blue-100 md:text-lg">
                      {slide.subtitle}
                    </p>
                    <div className="mt-7 flex flex-wrap items-center gap-3">
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
                    <div className="flex items-center justify-center px-6 pb-12 md:h-full md:px-12 md:pb-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide.image}
                        alt={slide.imageAlt ?? slide.title}
                        className="max-h-72 w-auto object-contain drop-shadow-2xl md:max-h-96"
                      />
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        {/* Spacer para forzar altura, el slide activo lo cubre con absolute */}
        <div className="invisible">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div className="px-6 py-12 md:px-12 md:py-20">
              <p className="text-[11px]">eyebrow</p>
              <h2 className="mt-3 text-3xl md:text-5xl md:leading-tight">
                Placeholder de altura del hero
                <br />
                en dos líneas mínimo
              </h2>
              <p className="mt-4 text-base md:text-lg">subtitle</p>
              <div className="mt-7 h-12" />
            </div>
            <div className="hidden md:block md:h-96" />
          </div>
        </div>

        {/* Flechas */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition hover:bg-white/25 group-hover:opacity-100 md:left-5 md:h-12 md:w-12"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Siguiente"
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition hover:bg-white/25 group-hover:opacity-100 md:right-5 md:h-12 md:w-12"
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
            className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 md:bottom-6"
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

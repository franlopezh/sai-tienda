"use client";

import { useState } from "react";
import { ImageZoom } from "@/components/image-zoom";
import { cn } from "@/lib/utils";

type Props = {
  imagenes: string[];
  nombre: string;
};

/**
 * Galería de imágenes interactiva para la ficha de producto.
 * - Imagen principal con zoom on hover (ImageZoom).
 * - Thumbnails clickeables que cambian la imagen principal.
 * - Animación fade al cambiar de imagen.
 * - Estado activo del thumbnail seleccionado.
 */
export function ProductGallery({ imagenes, nombre }: Props) {
  const [indexActivo, setIndexActivo] = useState(0);

  if (imagenes.length === 0) {
    return (
      <div className="flex h-80 w-full items-center justify-center rounded-xl border border-border/60 bg-white p-6 text-muted-foreground/70 md:h-[440px]">
        <span className="text-7xl">📦</span>
      </div>
    );
  }

  const activa = imagenes[indexActivo] ?? imagenes[0];

  return (
    <div className="animate-in fade-in-0 duration-500">
      {/* Imagen principal con zoom — key fuerza re-render con animación al cambiar */}
      <div
        key={activa}
        className="animate-in fade-in-0 duration-300"
      >
        <ImageZoom
          src={activa}
          alt={nombre}
          containerClassName="h-80 w-full rounded-xl border border-border/60 bg-white p-6 md:h-[440px]"
          imageClassName="p-2"
        />
      </div>

      {/* Thumbnails — clickeables si hay más de uno */}
      {imagenes.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {imagenes.slice(0, 4).map((url, idx) => (
            <button
              key={url + idx}
              type="button"
              onClick={() => setIndexActivo(idx)}
              aria-label={`Ver imagen ${idx + 1}`}
              aria-pressed={idx === indexActivo}
              className={cn(
                "group/thumb relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg border-2 bg-white p-2 transition-all duration-200 active:scale-95 active:duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
                idx === indexActivo
                  ? "border-blue-600 shadow-md dark:border-blue-500"
                  : "border-border/40 hover:border-blue-300/80 hover:shadow-md dark:hover:border-blue-700/60"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`${nombre} ${idx + 1}`}
                className={cn(
                  "h-full w-full object-contain transition-opacity",
                  idx !== indexActivo &&
                    "opacity-70 group-hover/thumb:opacity-100"
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

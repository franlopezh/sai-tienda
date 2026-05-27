"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  /** Clases para el contenedor (altura, border, padding) */
  containerClassName?: string;
  /** Clases para la imagen en estado normal (sin zoom) */
  imageClassName?: string;
  /** Factor de zoom (default 2x = 200% de tamaño) */
  zoomLevel?: number;
};

/**
 * Imagen con zoom on hover estilo Mercado Libre. En desktop, al pasar
 * el cursor sobre la imagen, se hace zoom siguiendo la posición del
 * cursor. En mobile/touch no aplica (los hover no existen).
 */
export function ImageZoom({
  src,
  alt,
  containerClassName,
  imageClassName,
  zoomLevel = 2,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden cursor-zoom-in select-none",
        containerClassName
      )}
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Imagen normal — visible cuando no hay zoom */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "h-full w-full object-contain transition-opacity duration-200",
          imageClassName,
          zoomed && "opacity-0"
        )}
      />
      {/* Capa de zoom — visible solo en hover */}
      {zoomed && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: `${zoomLevel * 100}%`,
            backgroundPosition: `${position.x}% ${position.y}%`,
          }}
        />
      )}
    </div>
  );
}

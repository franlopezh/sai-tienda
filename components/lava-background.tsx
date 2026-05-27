"use client";

import { useEffect, useRef } from "react";

/**
 * Fondo animado tipo lava lamp.
 * - 5 blobs gradient-blurred posicionados estratégicamente.
 * - Cada uno con su propia animación CSS keyframe (rotación/escala/translate).
 * - Mouse parallax suave: el cursor mueve los blobs ligeramente con magnitudes
 *   distintas por blob (algunos siguen, otros huyen) para crear sensación de
 *   profundidad. Se anima con rAF + lerp para que el movimiento sea fluido.
 * - Respeta prefers-reduced-motion (las animaciones se detienen vía CSS).
 * - z-index -10 + pointer-events-none → nunca interfiere con contenido.
 */
export function LavaBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // sin parallax si el usuario pidió menos movimiento

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    function onMove(e: MouseEvent) {
      // Normalizar a -0.5..0.5 respecto al centro del viewport
      targetX = e.clientX / window.innerWidth - 0.5;
      targetY = e.clientY / window.innerHeight - 0.5;
    }

    function tick() {
      // Lerp suave (5% por frame) para que el movimiento sea fluido
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      const el = containerRef.current;
      if (el) {
        el.style.setProperty("--mx", currentX.toFixed(3));
        el.style.setProperty("--my", currentY.toFixed(3));
      }
      rafId = requestAnimationFrame(tick);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Blob 1 — top-left, azul/indigo */}
      <div
        className="lava-blob lava-blob-1 absolute -left-40 -top-40 h-[40rem] w-[40rem] rounded-full bg-gradient-to-br from-blue-300 to-indigo-400 opacity-40 blur-2xl dark:from-blue-700 dark:to-indigo-800 dark:opacity-25"
        style={{ translate: "calc(var(--mx, 0) * 40px) calc(var(--my, 0) * 30px)" }}
      />
      {/* Blob 2 — centro-arriba, cyan */}
      <div
        className="lava-blob lava-blob-2 absolute left-1/2 top-1/4 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-cyan-200 to-blue-400 opacity-30 blur-2xl dark:from-cyan-800 dark:to-blue-700 dark:opacity-20"
        style={{ translate: "calc(var(--mx, 0) * -50px) calc(var(--my, 0) * 35px)" }}
      />
      {/* Blob 3 — bottom-right, purple/indigo */}
      <div
        className="lava-blob lava-blob-3 absolute -right-40 bottom-0 h-[42rem] w-[42rem] rounded-full bg-gradient-to-br from-purple-200 via-indigo-300 to-blue-400 opacity-30 blur-2xl dark:from-purple-800 dark:via-indigo-800 dark:to-blue-800 dark:opacity-20"
        style={{ translate: "calc(var(--mx, 0) * 30px) calc(var(--my, 0) * -25px)" }}
      />
      {/* Blob 4 — bottom-left, sky */}
      <div
        className="lava-blob lava-blob-4 absolute -left-32 bottom-1/4 h-[30rem] w-[30rem] rounded-full bg-gradient-to-br from-sky-200 to-blue-400 opacity-35 blur-2xl dark:from-sky-800 dark:to-blue-700 dark:opacity-20"
        style={{ translate: "calc(var(--mx, 0) * -35px) calc(var(--my, 0) * -40px)" }}
      />
      {/* Blob 5 — top-right, indigo soft */}
      <div
        className="lava-blob lava-blob-5 absolute right-1/4 -top-20 h-[26rem] w-[26rem] rounded-full bg-gradient-to-br from-indigo-200 to-purple-300 opacity-30 blur-2xl dark:from-indigo-800 dark:to-purple-900 dark:opacity-20"
        style={{ translate: "calc(var(--mx, 0) * 45px) calc(var(--my, 0) * 20px)" }}
      />
    </div>
  );
}

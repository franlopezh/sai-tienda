"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, X } from "lucide-react";
import { PROMO_SIN_ENGANCHE, promoSinEngancheActiva } from "@/lib/promo";
import { cn } from "@/lib/utils";

// La confirmación de solicitud redirige a WhatsApp: ahí no se interrumpe.
const RUTAS_EXCLUIDAS = ["/solicitud"];
// Con red lenta no dejamos al cliente viendo un póster congelado.
const TIMEOUT_ARRANQUE_MS = 6000;
const FADE_MS = 300;

type Estado = "cerrado" | "abierto" | "cerrando";

/**
 * Video de bienvenida de la promo: cada vez que se abre la tienda (carga
 * completa de página, no en la navegación interna) oscurece el fondo,
 * reproduce el video y al terminar deja la página lista para navegar. Solo
 * mientras la promo está activa y siempre con "Saltar" a la vista.
 * Sale aunque el sistema pida "reducir movimiento" (decisión del negocio: el
 * equipo del owner lo tiene activado y no lo veía); ahí solo se quita el zoom.
 * Decide en el navegador (en el server no pinta nada), así también funciona en
 * páginas estáticas.
 */
export function PromoVideoIntro() {
  const p = PROMO_SIN_ENGANCHE;
  const ref = useRef<HTMLVideoElement>(null);
  const [estado, setEstado] = useState<Estado>("cerrado");
  const [muted, setMuted] = useState(true);
  const [progreso, setProgreso] = useState(0);

  const cerrar = useCallback(() => {
    ref.current?.pause();
    setEstado((e) => (e === "abierto" ? "cerrando" : e));
  }, []);

  // Solo al abrir la tienda (primer render), no en cada navegación interna.
  useEffect(() => {
    if (!promoSinEngancheActiva()) return;
    const ruta = window.location.pathname;
    if (RUTAS_EXCLUIDAS.some((r) => ruta.startsWith(r))) return;
    // Un respiro para que la página pinte antes de oscurecerla.
    const t = setTimeout(() => setEstado("abierto"), 250);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (estado !== "abierto") return;
    const v = ref.current;
    if (!v) return;

    // Primero con sonido; si el navegador lo bloquea (lo normal cuando el
    // cliente aún no ha tocado la página) arranca en silencio y se ofrece
    // activarlo con un toque.
    v.muted = false;
    v.play()
      .then(() => setMuted(false))
      .catch(() => {
        v.muted = true;
        setMuted(true);
        v.play().catch(cerrar);
      });

    const arranque = setTimeout(() => {
      if (v.currentTime === 0) cerrar();
    }, TIMEOUT_ARRANQUE_MS);

    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(arranque);
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [estado, cerrar]);

  useEffect(() => {
    if (estado !== "cerrando") return;
    const t = setTimeout(() => setEstado("cerrado"), FADE_MS);
    return () => clearTimeout(t);
  }, [estado]);

  function toggleSonido() {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused) v.play().catch(() => {});
  }

  if (estado === "cerrado") return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Video de la promoción ${p.nombre}`}
      onClick={cerrar}
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm",
        estado === "cerrando"
          ? "animate-out fade-out-0 fill-mode-forwards"
          : "animate-in fade-in-0"
      )}
      style={{ animationDuration: `${FADE_MS}ms` }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col items-center gap-3 animate-in fade-in-0 motion-safe:zoom-in-95"
        style={{ animationDuration: "450ms" }}
      >
        <div className="relative aspect-[9/16] h-[min(70vh,720px)] overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/15">
          <video
            ref={ref}
            src={p.video}
            poster={p.videoPoster}
            playsInline
            preload="auto"
            onClick={() => muted && toggleSonido()}
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration) setProgreso(v.currentTime / v.duration);
            }}
            onEnded={cerrar}
            onError={cerrar}
            className="h-full w-full object-cover"
          />

          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar video"
            className="absolute right-2 top-2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/70"
          >
            <X className="h-4 w-4" />
          </button>

          {muted ? (
            <button
              type="button"
              onClick={toggleSonido}
              className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-white/95 px-3.5 py-2 text-xs font-semibold text-blue-900 shadow-lg transition hover:bg-white"
            >
              <VolumeX className="h-4 w-4" />
              Toca para activar el sonido
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleSonido}
              aria-label="Silenciar"
              className="absolute bottom-4 right-2 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition hover:bg-black/70"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          )}

          {/* Barra de avance: deja claro que dura poco. */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
            <div
              className="h-full bg-white transition-[width] duration-300 ease-linear"
              style={{ width: `${progreso * 100}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={cerrar}
          className="rounded-full px-3 py-1 text-sm font-medium text-white/85 transition hover:text-white hover:underline underline-offset-4"
        >
          Saltar e ir a la tienda
        </button>
        <p className="max-w-sm text-center text-[11px] leading-snug text-white/60">
          {p.disclaimerCorto}
        </p>
      </div>
    </div>
  );
}

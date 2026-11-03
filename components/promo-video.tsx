"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  poster: string;
  label: string;
  className?: string;
};

/**
 * Video promocional en loop, sin sonido de inicio (los navegadores solo dejan
 * autoreproducir videos silenciados) con botón para activar el audio.
 * Si el navegador bloquea el autoplay (p. ej. ahorro de batería) queda el
 * póster con un botón de play.
 */
export function PromoVideo({ src, poster, label, className }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  // El play va aquí y no con `autoPlay`: React no siempre pinta el atributo
  // `muted` en el HTML del servidor y sin él el navegador bloquea el autoplay.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  function togglePlay() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }

  function toggleSound() {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused) v.play().catch(() => {});
  }

  return (
    <div className={cn("relative overflow-hidden bg-black", className)}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClick={togglePlay}
        className="h-full w-full cursor-pointer object-cover"
      />
      {!playing && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Reproducir video"
          className="absolute inset-0 flex items-center justify-center bg-black/20"
        >
          <span className="rounded-full bg-white/90 p-3 text-blue-800 shadow-lg">
            <Play className="h-6 w-6 fill-current" />
          </span>
        </button>
      )}
      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Activar sonido" : "Silenciar"}
        className="absolute bottom-2 right-2 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm transition hover:bg-black/75"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </div>
  );
}

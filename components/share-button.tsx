"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  nombre: string;
  /** Path relativo del producto, ej. "/producto/mh-110" */
  path: string;
};

/**
 * Botón "Compartir" que abre un mini popover con opciones:
 * - Compartir por WhatsApp.
 * - Copiar link al portapapeles.
 */
export function ShareButton({ nombre, path }: Props) {
  const [open, setOpen] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const urlAbsoluta =
    typeof window !== "undefined"
      ? `${window.location.origin}${path}`
      : path;

  const mensaje = `Mira este producto en Market SAI: ${nombre} — ${urlAbsoluta}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;

  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(urlAbsoluta);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch {
      // Fallback silencioso si clipboard API no disponible
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Compartir producto"
        aria-expanded={open}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border/60 bg-card/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300/80 hover:bg-card hover:text-foreground active:translate-y-0 active:scale-95 active:duration-100 dark:hover:border-blue-700/60"
      >
        <Share2 className="h-3.5 w-3.5" />
        Compartir
      </button>

      {open && (
        <>
          {/* Backdrop para cerrar al click fuera */}
          <button
            type="button"
            aria-hidden
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 cursor-default"
          />
          <div
            role="dialog"
            className="absolute right-0 top-full z-40 mt-2 w-52 overflow-hidden rounded-lg border bg-popover shadow-xl"
          >
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-muted"
            >
              <span className="text-base">💬</span>
              WhatsApp
            </a>
            <button
              type="button"
              onClick={copiarLink}
              className={cn(
                "flex w-full items-center gap-2.5 border-t px-3 py-2.5 text-left text-sm transition-colors",
                copiado
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {copiado ? (
                <>
                  <Check className="h-4 w-4" />
                  Link copiado
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  Copiar link
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

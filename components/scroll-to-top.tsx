"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Fuerza scroll al top en cada cambio de ruta.
 * Next.js debería hacerlo solo, pero el sticky CTA mobile en /producto/[slug]
 * hace que el browser ajuste el viewport para mostrarlo, dejando la página
 * pegada al fondo. Este componente fixea ese caso.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, search]);

  return null;
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, FormEvent } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  /** Clases del form. Por defecto: barra del header, oculta en celular. */
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
  /** Se llama al enviar una búsqueda (p. ej. para cerrar el buscador móvil). */
  onBuscar?: () => void;
};

export function SearchInput({
  className = "hidden min-w-40 md:flex flex-1 max-w-sm mx-6",
  inputClassName,
  autoFocus,
  onBuscar,
}: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/buscar?q=${encodeURIComponent(term)}`);
    onBuscar?.();
  }

  return (
    <form onSubmit={onSubmit} role="search" className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar moto, modelo..."
        aria-label="Buscar productos"
        autoFocus={autoFocus}
        enterKeyHint="search"
        className={cn("h-9 pl-8", inputClassName)}
      />
    </form>
  );
}

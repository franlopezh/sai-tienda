"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SearchInput } from "@/components/search-input";
import { PulseLogo } from "@/components/pulse-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

type Categoria = {
  id: string;
  slug: string;
  nombre: string;
};

type Props = {
  categorias: Categoria[];
  overlay?: boolean;
};

export function SiteHeaderClient({ categorias, overlay = false }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!overlay) return;
    const handleScroll = () => setScrolled(window.scrollY > 80);
    handleScroll(); // estado inicial
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [overlay]);

  // Cerrar menú mobile al cambiar a desktop.
  useEffect(() => {
    const close = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  // Cuando estamos en overlay Y todavía arriba (sobre el carrusel azul oscuro):
  // - bg transparente
  // - texto blanco
  // Cuando overlay y ya scrolleamos (sobre contenido normal):
  // - bg sólido con backdrop
  // - texto adapta al tema (foreground/muted-foreground)
  const isFloatingOverHero = overlay && !scrolled;

  return (
    <header
      className={cn(
        "top-0 left-0 right-0 z-30 transition-colors duration-300",
        overlay ? "fixed" : "sticky",
        isFloatingOverHero
          ? "bg-transparent"
          : "border-b bg-background/90 backdrop-blur"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:gap-4">
        {/* Hamburger button — solo mobile/tablet, antes del logo */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors lg:hidden",
            isFloatingOverHero
              ? "text-white hover:bg-white/10"
              : "text-foreground hover:bg-muted"
          )}
        >
          {menuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
        <Link href="/" className="shrink-0">
          <PulseLogo />
        </Link>
        <Suspense
          fallback={<div className="hidden md:flex flex-1 max-w-sm mx-6" />}
        >
          <SearchInput />
        </Suspense>
        <nav className="hidden gap-5 text-sm lg:flex">
          {categorias.map((c) => (
            <Link
              key={c.id}
              href={`/categoria/${c.slug}`}
              className={cn(
                "transition-colors",
                isFloatingOverHero
                  ? "text-white/80 hover:text-white"
                  : "text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-zinc-100"
              )}
            >
              {c.nombre}
            </Link>
          ))}
          <Link
            href="/productos"
            className={cn(
              "font-medium transition-colors",
              isFloatingOverHero
                ? "text-white hover:text-blue-200"
                : "text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
            )}
          >
            Todos
          </Link>
        </nav>
        <ThemeToggle />
      </div>

      {/* Dropdown mobile con categorías — hereda el estilo del header
          (semitransparente azul sobre carrusel para garantizar contraste con
          imágenes variadas, sólido al scrollear) */}
      {menuOpen && (
        <div
          className={cn(
            "lg:hidden",
            isFloatingOverHero
              ? "bg-blue-950/60 backdrop-blur-lg"
              : "border-t bg-background/95 backdrop-blur"
          )}
        >
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {categorias.map((c) => (
              <Link
                key={c.id}
                href={`/categoria/${c.slug}`}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2.5 text-sm transition-colors",
                  isFloatingOverHero
                    ? "text-white/90 hover:bg-white/10 hover:text-white"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {c.nombre}
              </Link>
            ))}
            <Link
              href="/productos"
              onClick={() => setMenuOpen(false)}
              className={cn(
                "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isFloatingOverHero
                  ? "text-white hover:bg-white/10"
                  : "text-blue-700 hover:bg-muted dark:text-blue-400"
              )}
            >
              Todos
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

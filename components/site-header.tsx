import { Suspense } from "react";
import Link from "next/link";
import { getCategorias } from "@/lib/queries";
import { SearchInput } from "@/components/search-input";
import { PulseLogo } from "@/components/pulse-logo";
import { ThemeToggle } from "@/components/theme-toggle";

export async function SiteHeader() {
  const categorias = await getCategorias();
  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
        <Link href="/" className="shrink-0">
          <PulseLogo />
        </Link>
        <Suspense fallback={<div className="hidden md:flex flex-1 max-w-sm mx-6" />}>
          <SearchInput />
        </Suspense>
        <nav className="hidden gap-5 text-sm lg:flex">
          {categorias.map((c) => (
            <Link
              key={c.id}
              href={`/categoria/${c.slug}`}
              className="text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {c.nombre}
            </Link>
          ))}
          <Link
            href="/productos"
            className="font-medium text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
          >
            Todos
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}

import Link from "next/link";
import { Search, SearchX } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/empty-state";
import { buscarProductos } from "@/lib/queries";

type Search = Promise<{ q?: string }>;

export const metadata = {
  title: "Buscar — Market SAI",
};

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const { q = "" } = await searchParams;
  const productos = q.trim() ? await buscarProductos(q) : [];

  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
        <nav className="text-sm text-muted-foreground">
          <Link href="/">Inicio</Link> › <span>Buscar</span>
        </nav>

        <h1 className="mt-4 text-3xl font-semibold">
          {q.trim() ? `Resultados para "${q}"` : "Buscar"}
        </h1>

        {q.trim() && (
          <p className="mt-1 text-sm text-muted-foreground">
            {productos.length} producto{productos.length === 1 ? "" : "s"}
          </p>
        )}

        {q.trim() && productos.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={SearchX}
              title={`Sin resultados para "${q}"`}
              description="Prueba con otro nombre, marca o modelo. También puedes ver el catálogo completo."
              primaryAction={{
                label: "Ver todos los productos",
                href: "/productos",
              }}
              secondaryAction={{
                label: "Volver al inicio",
                href: "/",
              }}
            />
          </div>
        ) : null}

        {!q.trim() && (
          <div className="mt-8">
            <EmptyState
              icon={Search}
              title="¿Qué estás buscando?"
              description="Escribe el nombre, marca o modelo que te interesa. Por ejemplo: Honda CB 190, iPhone 13, Smart TV."
              primaryAction={{
                label: "Ver todos los productos",
                href: "/productos",
              }}
            />
          </div>
        )}

        {productos.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {productos.map((p, idx) => (
              <ProductCard key={p.id} producto={p} index={idx} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

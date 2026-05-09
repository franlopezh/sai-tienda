import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { buscarProductos } from "@/lib/queries";

type Search = Promise<{ q?: string }>;

export const metadata = {
  title: "Buscar — SAI Tienda",
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
          <div className="mt-8 rounded-lg border border-dashed border-border bg-muted/50 p-12 text-center text-sm text-muted-foreground">
            Sin resultados para “{q}”. Prueba con un nombre, marca o modelo.
          </div>
        ) : null}

        {productos.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {productos.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

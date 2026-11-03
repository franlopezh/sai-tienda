import Link from "next/link";
import { PackageX } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { FiltrosProductos } from "@/components/filtros-productos";
import { EmptyState } from "@/components/empty-state";
import {
  getCategorias,
  getTodosLosProductos,
  getMarcasPorCategoria,
  type OrdenProductos,
} from "@/lib/queries";

type Search = Promise<{
  q?: string;
  categoria?: string;
  marca?: string;
  semanalMin?: string;
  semanalMax?: string;
  orden?: string;
}>;

const ORDENES_VALIDOS: OrdenProductos[] = [
  "nombre",
  "credito_asc",
  "credito_desc",
  "semanal_asc",
  "semanal_desc",
];

export const metadata = {
  title: "Todos los productos — Market SAI",
};

export default async function TodosProductosPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const sp = await searchParams;
  const orden = ORDENES_VALIDOS.includes(sp.orden as OrdenProductos)
    ? (sp.orden as OrdenProductos)
    : "nombre";
  const semanalMin = sp.semanalMin ? Number(sp.semanalMin) : undefined;
  const semanalMax = sp.semanalMax ? Number(sp.semanalMax) : undefined;

  // Las marcas salen de la categoría elegida (o de todo el catálogo), no de
  // los productos ya filtrados: si no, al elegir una marca el select se
  // quedaba con una sola opción y desaparecía.
  const [categorias, productos, marcas] = await Promise.all([
    getCategorias(),
    getTodosLosProductos({
      q: sp.q,
      categoriaId: sp.categoria,
      marca: sp.marca,
      semanalMin: Number.isFinite(semanalMin) ? semanalMin : undefined,
      semanalMax: Number.isFinite(semanalMax) ? semanalMax : undefined,
      orden,
    }),
    getMarcasPorCategoria(sp.categoria),
  ]);


  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:py-12">
        <nav className="text-sm text-muted-foreground">
          <Link href="/">Inicio</Link> › <span>Todos los productos</span>
        </nav>

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h1 className="text-2xl font-semibold md:text-3xl">Todos los productos</h1>
          <span className="text-sm text-muted-foreground">
            {productos.length} resultado{productos.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-6">
          <FiltrosProductos categorias={categorias} marcas={marcas} />
        </div>

        <div className="mt-6">
          {productos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {productos.map((p, idx) => (
                <ProductCard key={p.id} producto={p} index={idx} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={PackageX}
              title="Sin productos con esos filtros"
              description="No hay productos que coincidan con tu selección. Prueba quitar algún filtro o explora por categoría."
              primaryAction={{
                label: "Limpiar filtros",
                href: "/productos",
              }}
              secondaryAction={{
                label: "Volver al inicio",
                href: "/",
              }}
            />
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

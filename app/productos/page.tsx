import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { TodosProductosFiltros } from "@/components/todos-productos-filtros";
import {
  getCategorias,
  getTodosLosProductos,
  type OrdenProductos,
} from "@/lib/queries";

type Search = Promise<{
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
  title: "Todos los productos — SAI Tienda",
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

  const [categorias, productos] = await Promise.all([
    getCategorias(),
    getTodosLosProductos({
      categoriaId: sp.categoria,
      marca: sp.marca,
      semanalMin: Number.isFinite(semanalMin) ? semanalMin : undefined,
      semanalMax: Number.isFinite(semanalMax) ? semanalMax : undefined,
      orden,
    }),
  ]);

  const marcas = Array.from(
    new Set(productos.map((p) => p.marca?.trim()).filter((m): m is string => !!m))
  ).sort();

  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
        <nav className="text-sm text-muted-foreground">
          <Link href="/">Inicio</Link> › <span>Todos los productos</span>
        </nav>

        <div className="mt-4 flex items-baseline justify-between">
          <h1 className="text-3xl font-semibold">Todos los productos</h1>
          <span className="text-sm text-muted-foreground">
            {productos.length} resultado{productos.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[16rem_1fr] md:items-start">
          <TodosProductosFiltros categorias={categorias} marcas={marcas} />

          {productos.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {productos.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-muted/50 p-12 text-center text-sm text-muted-foreground">
              No hay productos que coincidan con los filtros.
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

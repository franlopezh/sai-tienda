import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { CategoriaFiltros } from "@/components/categoria-filtros";
import {
  getCategoriaBySlug,
  getProductosPorCategoria,
  getMarcasPorCategoria,
  type OrdenProductos,
} from "@/lib/queries";

type Params = Promise<{ slug: string }>;
type Search = Promise<{
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

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const categoria = await getCategoriaBySlug(slug);

  if (!categoria) notFound();

  const orden = ORDENES_VALIDOS.includes(sp.orden as OrdenProductos)
    ? (sp.orden as OrdenProductos)
    : "nombre";
  const semanalMin = sp.semanalMin ? Number(sp.semanalMin) : undefined;
  const semanalMax = sp.semanalMax ? Number(sp.semanalMax) : undefined;

  const [productos, marcas] = await Promise.all([
    getProductosPorCategoria(categoria.id, {
      marca: sp.marca,
      semanalMin: Number.isFinite(semanalMin) ? semanalMin : undefined,
      semanalMax: Number.isFinite(semanalMax) ? semanalMax : undefined,
      orden,
    }),
    getMarcasPorCategoria(categoria.id),
  ]);

  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
        <nav className="text-sm text-muted-foreground">
          <Link href="/">Inicio</Link> › <span>{categoria.nombre}</span>
        </nav>

        <div className="mt-4 flex items-baseline justify-between">
          <h1 className="text-3xl font-semibold">{categoria.nombre}</h1>
          <span className="text-sm text-muted-foreground">
            {productos.length} producto{productos.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[16rem_1fr] md:items-start">
          <CategoriaFiltros marcas={marcas} />

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

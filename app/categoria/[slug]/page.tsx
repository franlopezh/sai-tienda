import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageX, PackageOpen } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { FiltrosProductos } from "@/components/filtros-productos";
import { EmptyState } from "@/components/empty-state";
import {
  getCategoriaBySlug,
  getProductosPorCategoria,
  getMarcasPorCategoria,
  type OrdenProductos,
} from "@/lib/queries";

type Params = Promise<{ slug: string }>;
type Search = Promise<{
  q?: string;
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
  const hayFiltros = !!(sp.q || sp.marca || sp.semanalMin || sp.semanalMax);

  const [productos, marcas] = await Promise.all([
    getProductosPorCategoria(categoria.id, {
      q: sp.q,
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
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:py-12">
        <nav className="text-sm text-muted-foreground">
          <Link href="/">Inicio</Link> › <span>{categoria.nombre}</span>
        </nav>

        {/* flex-wrap: con nombres largos ("Celulares/Tecnología") el
            contador se salía de la pantalla en celular. */}
        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h1 className="text-2xl font-semibold md:text-3xl">{categoria.nombre}</h1>
          <span className="text-sm text-muted-foreground">
            {productos.length} producto{productos.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="mt-6">
          <FiltrosProductos marcas={marcas} />
        </div>

        <div className="mt-6">
          {productos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {productos.map((p, idx) => (
                <ProductCard key={p.id} producto={p} index={idx} />
              ))}
            </div>
          ) : hayFiltros ? (
            <EmptyState
              icon={PackageX}
              title="Sin productos con esos filtros"
              description="Prueba con otra búsqueda, otra marca o ajusta el rango de pago semanal. También puedes ver el catálogo completo."
              primaryAction={{
                label: "Limpiar filtros",
                href: `/categoria/${categoria.slug}`,
              }}
              secondaryAction={{
                label: "Ver todos los productos",
                href: "/productos",
              }}
            />
          ) : (
            <EmptyState
              icon={PackageOpen}
              title="Aún no hay artículos a la venta"
              description={`Estamos preparando la oferta de ${categoria.nombre}. Mientras tanto, mira el resto del catálogo o vuelve más tarde.`}
              primaryAction={{
                label: "Ver todos los productos",
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

import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LeadModal } from "@/components/lead-modal";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatMXN } from "@/lib/format";
import {
  getProductoBySlug,
  getProductosRelacionados,
  getCategoriaById,
} from "@/lib/queries";
import { ProductCard } from "@/components/product-card";

type Params = Promise<{ slug: string }>;

export default async function ProductoPage({ params }: { params: Params }) {
  const { slug } = await params;
  const producto = await getProductoBySlug(slug);

  if (!producto) notFound();

  const [relacionados, categoria] = await Promise.all([
    getProductosRelacionados(producto.categoria_id, producto.id, 4),
    getCategoriaById(producto.categoria_id),
  ]);

  const galeria: string[] = producto.imagenes?.length
    ? producto.imagenes
    : producto.imagen_url
      ? [producto.imagen_url]
      : [];

  const pagoSemanal = producto.pago_semanal ?? 0;
  const semanasEstimadas =
    pagoSemanal > 0 && producto.precio_credito > 0
      ? Math.ceil(producto.precio_credito / pagoSemanal)
      : 78;

  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
        <nav className="text-sm text-muted-foreground">
          <Link href="/">Inicio</Link> › <span>{producto.nombre}</span>
        </nav>

        <div className="mt-6 grid gap-8 md:grid-cols-2 md:items-start">
          <div className="mx-auto w-full max-w-md md:mx-0">
            <div className="relative h-80 w-full overflow-hidden rounded-lg border bg-card flex items-center justify-center text-muted-foreground/70 p-6 md:h-[420px]">
              {galeria[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={galeria[0]}
                  alt={producto.nombre}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-7xl">📦</span>
              )}
            </div>
            {galeria.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {galeria.slice(0, 4).map((url, idx) => (
                  <div
                    key={url + idx}
                    className="aspect-square w-full overflow-hidden rounded-md border bg-card flex items-center justify-center p-2"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`${producto.nombre} ${idx + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            {producto.marca && (
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {producto.marca}
              </p>
            )}
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              {producto.nombre}
            </h1>

            <div className="mt-6 space-y-3">
              {producto.precio_contado > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Precio de contado</p>
                  <p className="text-2xl font-semibold">
                    {formatMXN(producto.precio_contado)}
                  </p>
                </div>
              )}

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Financia desde</p>
                {producto.pago_diario && producto.pago_diario > 0 ? (
                  <>
                    <p className="text-3xl font-semibold">
                      {formatMXN(producto.pago_diario)} / día
                    </p>
                    <p className="text-sm text-muted-foreground">
                      o {formatMXN(pagoSemanal)} / semana · {semanasEstimadas} semanas
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-3xl font-semibold">
                      {formatMXN(pagoSemanal)} / semana
                    </p>
                    <p className="text-sm text-muted-foreground">a {semanasEstimadas} semanas</p>
                  </>
                )}
                {producto.enganche && producto.enganche > 0 ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enganche: {formatMXN(producto.enganche)}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-8 hidden md:block">
              <LeadModal
                producto={producto}
                pagoSemanal={pagoSemanal}
                semanas={semanasEstimadas}
              />
            </div>

            <ul className="mt-6 space-y-1 text-sm text-foreground/80">
              <li>✓ Sin checador</li>
              <li>✓ Aprobación en 24h</li>
              <li>✓ Entrega a domicilio</li>
            </ul>

            {producto.modelo && (
              <div className="mt-8">
                <Badge variant="outline">Modelo {producto.modelo}</Badge>
              </div>
            )}
          </div>
        </div>

        {producto.descripcion && (
          <section className="mt-16">
            <h2 className="text-xl font-semibold">Descripción</h2>
            <p className="mt-3 max-w-prose whitespace-pre-line text-sm text-foreground/80">
              {producto.descripcion}
            </p>
          </section>
        )}

        {relacionados.length > 0 && (
          <section className="mt-16 border-t border-border pt-12 pb-16 md:pb-0 dark:border-zinc-800">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Otros modelos disponibles
            </p>
            <h2 className="mt-1 text-xl font-semibold">
              Más {(categoria?.nombre ?? "productos").toLowerCase()} para
              financiar
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tu solicitud actual es para{" "}
              <span className="font-medium text-foreground/80 dark:text-zinc-300">
                {producto.nombre}
              </span>
              . Estos son otros modelos por si quieres comparar.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {relacionados.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Sticky CTA solo en mobile */}
      <div className="sticky bottom-0 z-20 border-t bg-card/95 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs text-muted-foreground">{producto.nombre}</p>
            <p className="text-base font-semibold">
              {formatMXN(pagoSemanal)}
              <span className="text-xs font-normal text-muted-foreground">
                {" "}/ semana
              </span>
            </p>
          </div>
          <div className="shrink-0">
            <LeadModal
              producto={producto}
              pagoSemanal={pagoSemanal}
              semanas={semanasEstimadas}
              compact
            />
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

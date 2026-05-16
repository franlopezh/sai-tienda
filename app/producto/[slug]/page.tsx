import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LeadModal } from "@/components/lead-modal";
import { SimuladorCredito } from "@/components/simulador-credito";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatMXN } from "@/lib/format";
import {
  getProductoBySlug,
  getProductosRelacionados,
  getCategoriaById,
} from "@/lib/queries";
import { calcularPlanDefault } from "@/lib/credito";
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

  // Plan default según segmento del producto (pequenos/medianos/grandes)
  // calculado al vuelo desde precio_contado. Se usa para el sticky CTA mobile
  // y como fallback del lead-modal cuando el cliente no interactúa con el simulador.
  const planDefault = calcularPlanDefault(producto.precio_contado ?? 0);
  const pagoSemanal = planDefault?.pagoSemanal ?? 0;
  const semanasEstimadas = planDefault?.semanas ?? 52;
  const agotado = producto.activo === false;

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
                <>
                  {/* Ambient: campo de color extendido desde los bordes de
                      la imagen. Scale alto + blur extremo = casi no se ve la
                      imagen, solo el color predominante. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={galeria[0]}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 h-full w-full scale-[3] object-cover blur-[120px]"
                  />
                  {/* Imagen real */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={galeria[0]}
                    alt={producto.nombre}
                    className="relative z-10 max-h-full max-w-full object-contain"
                  />
                </>
              ) : (
                <span className="text-7xl">📦</span>
              )}
            </div>
            {galeria.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {galeria.slice(0, 4).map((url, idx) => (
                  <div
                    key={url + idx}
                    className="relative aspect-square w-full overflow-hidden rounded-md border bg-card flex items-center justify-center p-2"
                  >
                    {/* Ambient: campo de color del thumbnail */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 h-full w-full scale-[3] object-cover blur-[80px]"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`${producto.nombre} ${idx + 1}`}
                      className="relative z-10 max-h-full max-w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              {producto.marca && (
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {producto.marca}
                </p>
              )}
              {agotado && (
                <span className="rounded-full bg-zinc-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  Agotado
                </span>
              )}
            </div>
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

              {agotado ? (
                <div className="rounded-lg border border-dashed border-border bg-muted/30 p-5">
                  <p className="text-sm font-semibold text-foreground">
                    Producto agotado por el momento
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    No tenemos unidades disponibles ahora. Echa un vistazo a los
                    otros modelos abajo o vuelve más tarde.
                  </p>
                </div>
              ) : (
                <SimuladorCredito producto={producto} />
              )}
            </div>

            {!agotado && (
              <ul className="mt-6 space-y-1 text-sm text-foreground/80">
                <li>✓ Sin checador</li>
                <li>✓ Aprobación en 24h</li>
                <li>✓ Entrega a domicilio</li>
              </ul>
            )}

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

      {/* Sticky CTA solo en mobile (oculto si el producto está agotado) */}
      <div
        className={
          agotado
            ? "hidden"
            : "sticky bottom-0 z-20 border-t bg-card/95 backdrop-blur md:hidden"
        }
      >
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

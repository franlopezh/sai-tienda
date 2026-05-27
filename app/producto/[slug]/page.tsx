import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LeadModal } from "@/components/lead-modal";
import { SimuladorCredito } from "@/components/simulador-credito";
import { ProductGallery } from "@/components/product-gallery";
import { ShareButton } from "@/components/share-button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Clock4, Truck, ChevronRight, Wrench } from "lucide-react";
import { formatMXN } from "@/lib/format";
import {
  getProductoBySlug,
  getProductosRelacionados,
  getCategoriaById,
} from "@/lib/queries";
import { calcularPlanDefault } from "@/lib/credito";
import { ProductCard } from "@/components/product-card";

type Params = Promise<{ slug: string }>;

/**
 * Parsea la descripción para extraer specs (líneas tipo "Cilindrada: 200cc").
 * Devuelve { specs: [{key, value}], texto: "resto sin specs" }.
 * Si no hay specs, devuelve el texto completo.
 */
function parseDescripcion(desc: string): {
  specs: { key: string; value: string }[];
  texto: string;
} {
  const lineas = desc.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const specs: { key: string; value: string }[] = [];
  const otrasLineas: string[] = [];

  for (const linea of lineas) {
    // Patrón: "Clave: valor" donde la clave es relativamente corta (max 40 chars)
    const m = linea.match(/^([A-Za-zÁ-ÿ0-9\s/().-]{2,40}):\s*(.+)$/);
    if (m && m[2].trim().length > 0 && m[2].trim().length < 100) {
      specs.push({ key: m[1].trim(), value: m[2].trim() });
    } else {
      otrasLineas.push(linea);
    }
  }

  return { specs, texto: otrasLineas.join("\n") };
}

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

  const planDefault = calcularPlanDefault(producto.precio_contado ?? 0);
  const pagoSemanal = planDefault?.pagoSemanal ?? 0;
  const pagoDiario = planDefault?.pagoDiario ?? 0;
  const semanasEstimadas = planDefault?.semanas ?? 52;
  const plazoMeses = planDefault?.plazoMeses ?? null;
  const agotado = producto.activo === false;

  const descripcionParsed = producto.descripcion
    ? parseDescripcion(producto.descripcion)
    : null;

  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
        {/* Breadcrumb con categoría */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Inicio
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
          {categoria && (
            <>
              <Link
                href={`/categoria/${categoria.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {categoria.nombre}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            </>
          )}
          <span className="truncate text-foreground/80">{producto.nombre}</span>
        </nav>

        <div className="mt-6 grid gap-8 md:grid-cols-2 md:items-start">
          {/* Galería interactiva + especificaciones debajo */}
          <div className="mx-auto w-full max-w-md md:mx-0">
            <ProductGallery imagenes={galeria} nombre={producto.nombre} />

            {/* Especificaciones técnicas — compactas, justo bajo la imagen.
                Animación con delay para que aparezca después de la galería
                y llame la atención sin opacar al producto. */}
            {descripcionParsed && descripcionParsed.specs.length > 0 && (
              <section
                className="mt-5 animate-in fade-in-0 slide-in-from-bottom-4 fill-mode-both"
                style={{ animationDuration: "700ms", animationDelay: "400ms" }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    <Wrench className="h-3.5 w-3.5" />
                  </span>
                  <h2 className="text-sm font-semibold tracking-tight text-foreground">
                    Especificaciones técnicas
                  </h2>
                </div>
                <div className="overflow-hidden rounded-lg border border-blue-200/60 bg-gradient-to-br from-blue-50/60 to-transparent shadow-sm dark:border-blue-900/40 dark:from-blue-950/30 dark:to-transparent">
                  <dl className="divide-y divide-blue-200/40 dark:divide-blue-900/30">
                    {descripcionParsed.specs.map((s, idx) => (
                      <div
                        key={s.key + idx}
                        className={`grid grid-cols-[45%_55%] transition-colors ${
                          idx % 2 === 0
                            ? "bg-blue-50/40 dark:bg-blue-950/30"
                            : "bg-transparent"
                        }`}
                      >
                        <dt className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-blue-700/80 dark:text-blue-300/80">
                          {s.key}
                        </dt>
                        <dd className="px-3 py-2 text-xs font-medium text-foreground">
                          {s.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </section>
            )}
          </div>

          {/* Info del producto */}
          <div>
            <div className="flex items-center justify-between gap-2">
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
              <ShareButton
                nombre={producto.nombre}
                path={`/producto/${producto.slug}`}
              />
            </div>
            <h1 className="mt-1 font-sans text-3xl font-semibold tracking-tight">
              {producto.nombre}
            </h1>

            <div className="mt-6 space-y-3">
              {producto.precio_contado > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Precio de contado
                  </p>
                  <p className="font-mono text-2xl font-semibold tabular-nums">
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
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { Icon: ShieldCheck, label: "Sin checador" },
                  { Icon: Clock4, label: "Aprobación 24h" },
                  { Icon: Truck, label: "Entrega a domicilio" },
                ].map(({ Icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-start gap-2 rounded-lg border border-border/40 bg-card/40 p-3"
                  >
                    <span className="rounded-full bg-blue-50 p-1.5 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-[11px] font-medium leading-tight text-foreground">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {producto.modelo && (
              <div className="mt-8">
                <Badge variant="outline">Modelo {producto.modelo}</Badge>
              </div>
            )}
          </div>
        </div>

        {/* Descripción libre (lo que no es spec) */}
        {descripcionParsed && descripcionParsed.texto.trim().length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-semibold">Descripción</h2>
            <p className="mt-3 max-w-prose whitespace-pre-line text-sm text-foreground/80">
              {descripcionParsed.texto}
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
              {relacionados.map((p, idx) => (
                <ProductCard key={p.id} producto={p} index={idx} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Sticky CTA mobile rediseñado — más jerarquía: plazo + pago + CTA */}
      <div
        className={
          agotado
            ? "hidden"
            : "sticky bottom-0 z-20 border-t border-border/60 bg-card/95 backdrop-blur-md md:hidden"
        }
      >
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {producto.nombre}
            </p>
            <div className="mt-0.5 flex items-baseline gap-1.5">
              <span className="font-mono text-xl font-bold tabular-nums text-blue-700 dark:text-blue-400">
                {formatMXN(pagoDiario > 0 ? pagoDiario : pagoSemanal)}
              </span>
              <span className="text-[11px] text-muted-foreground">
                /{pagoDiario > 0 ? "día" : "sem"}
              </span>
              {plazoMeses && (
                <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 font-mono text-[9px] font-medium tabular-nums text-muted-foreground">
                  {Number.isInteger(plazoMeses) ? `${plazoMeses}m` : `${plazoMeses}m`}
                </span>
              )}
            </div>
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

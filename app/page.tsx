import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { Testimonios } from "@/components/testimonios";
import { getCategoriasConPreview, getProductosDestacados } from "@/lib/queries";
import { formatMXN } from "@/lib/format";
import {
  ShieldCheck,
  Clock4,
  Truck,
  CalendarClock,
} from "lucide-react";

const ICONO_FALLBACK: Record<string, string> = {
  motocicletas: "🏍️",
  celulares: "📱",
  televisores: "📺",
  electrodomesticos: "🧊",
};

// Imagen de preview por defecto cuando la categoría aún no tiene productos cargados.
const PREVIEW_FALLBACK: Record<string, string> = {
  televisores:
    "https://images.unsplash.com/photo-1586024486164-ce9b3d87e09f?fm=jpg&q=60&w=1200&auto=format&fit=crop",
  electrodomesticos:
    "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?fm=jpg&q=60&w=1200&auto=format&fit=crop",
};

export default async function Home() {
  const [categorias, destacados] = await Promise.all([
    getCategoriasConPreview(),
    getProductosDestacados(8),
  ]);

  const heroProducto = destacados.find((p) => p.imagen_url) ?? destacados[0];
  const restoDestacados = heroProducto
    ? destacados.filter((p) => p.id !== heroProducto.id).slice(0, 4)
    : destacados.slice(0, 4);

  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-800 via-blue-700 to-blue-500 text-white">
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
              <div className="px-8 py-12 md:py-16">
                <p className="text-xs uppercase tracking-widest text-blue-200">
                  Financiamiento SAI
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                  Llévate hoy lo que necesitas, paga en semanas.
                </h1>
                <p className="mt-4 max-w-md text-blue-100">
                  Sin checador. Aprobación en 24 horas. Entrega a domicilio.
                </p>
                {heroProducto ? (
                  <div className="mt-8 rounded-xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
                    <p className="text-xs uppercase tracking-wide text-blue-200">
                      Destacado
                    </p>
                    <p className="mt-1 text-lg font-medium">
                      {heroProducto.nombre}
                    </p>
                    {heroProducto.pago_semanal ? (
                      <p className="mt-1 text-sm text-blue-100">
                        Desde {formatMXN(heroProducto.pago_semanal)} / semana
                      </p>
                    ) : null}
                    <Link
                      href={`/producto/${heroProducto.slug}`}
                      className={buttonVariants({
                        size: "lg",
                        className: "mt-4",
                      })}
                    >
                      Ver detalle →
                    </Link>
                  </div>
                ) : (
                  categorias[0] && (
                    <Link
                      href={`/categoria/${categorias[0].slug}`}
                      className={buttonVariants({
                        size: "lg",
                        className: "mt-8",
                      })}
                    >
                      Ver catálogo →
                    </Link>
                  )
                )}
              </div>
              {heroProducto?.imagen_url && (
                <div className="flex aspect-square items-center justify-center bg-white/5 p-8 md:aspect-auto md:h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={heroProducto.imagen_url}
                    alt={heroProducto.nombre}
                    className="max-h-80 w-auto object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              {
                Icon: ShieldCheck,
                titulo: "Sin checador",
                texto: "No revisamos buró.",
              },
              {
                Icon: Clock4,
                titulo: "Aprobación 24h",
                texto: "Te avisamos al día siguiente.",
              },
              {
                Icon: Truck,
                titulo: "Entrega a domicilio",
                texto: "Sin que te muevas de casa.",
              },
              {
                Icon: CalendarClock,
                titulo: "Pagos diarios o semanales",
                texto: "Tú eliges la frecuencia.",
              },
            ].map(({ Icon, titulo, texto }) => (
              <div
                key={titulo}
                className="flex items-start gap-3 rounded-lg border bg-card p-4"
              >
                <span className="rounded-full bg-blue-50 p-2 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{titulo}</p>
                  <p className="text-xs text-muted-foreground">{texto}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="mb-6 text-2xl font-semibold">Categorías</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {categorias.map((c) => (
              <Link key={c.id} href={`/categoria/${c.slug}`} className="block h-full">
                <Card className="flex h-full flex-col overflow-hidden transition hover:shadow-md hover:border-border">
                  <div className="relative h-40 w-full shrink-0 overflow-hidden flex items-center justify-center p-4">
                    {(() => {
                      const preview =
                        c.preview_imagen ?? PREVIEW_FALLBACK[c.slug ?? ""];
                      return preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={preview}
                          alt={c.nombre}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-5xl">
                          {ICONO_FALLBACK[c.slug ?? ""] ?? "🛒"}
                        </span>
                      );
                    })()}
                  </div>
                  <CardContent className="border-t p-4">
                    <p className="text-sm font-medium">{c.nombre}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {c.total_productos} producto
                      {c.total_productos === 1 ? "" : "s"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="mb-6 text-2xl font-semibold">Más solicitados</h2>
          {restoDestacados.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {restoDestacados.map((p) => (
                <ProductCard key={p.id} producto={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-muted/50 p-12 text-center text-sm text-muted-foreground">
              No hay productos cargados todavía.
            </div>
          )}
        </section>

        <Testimonios />
      </main>

      <SiteFooter />
    </div>
  );
}

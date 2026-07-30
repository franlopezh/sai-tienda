import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { Testimonios } from "@/components/testimonios";
import { HeroCarousel, type HeroSlide } from "@/components/hero-carousel";
import {
  getCategoriasConPreview,
  getProductosCarrusel,
  getProductosDestacados,
} from "@/lib/queries";
import { calcularPlanDefault, getPrecioPublico } from "@/lib/credito";
import { formatMXN } from "@/lib/format";
import {
  ShieldCheck,
  Clock4,
  Truck,
  CalendarClock,
} from "lucide-react";

// La home se regenera (ISR) cada 5 min para reflejar cambios del admin —
// sobre todo qué productos se marcan como destacados para el carrusel— sin
// necesidad de un redeploy. Un deploy la actualiza al instante igualmente.
export const revalidate = 300;

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
  const [categorias, carrusel, destacados] = await Promise.all([
    getCategoriasConPreview(),
    // Sin argumento: muestra TODOS los productos marcados en el admin. El 4 que
    // recibe por defecto solo aplica al fallback de cuando no hay ninguno.
    getProductosCarrusel(),
    getProductosDestacados(8),
  ]);

  // Slides del hero: los productos que el admin marcó como destacados
  // (`productos.destacado`). Con fallback interno si no hay ninguno marcado.
  const slidesProductos: HeroSlide[] = carrusel.map((p, idx) => {
    const plan = calcularPlanDefault(getPrecioPublico(p));
    const desde = plan?.pagoDiario ?? p.pago_diario ?? 0;
    // Gradientes más oscuros para integrar mejor con bg-background (dark)
    // y que el fade arriba/abajo del carrusel se vea natural.
    const gradients = [
      "from-blue-950 via-blue-800 to-blue-900",
      "from-slate-950 via-slate-900 to-blue-900",
      "from-blue-900 via-indigo-900 to-blue-950",
      "from-blue-950 via-blue-900 to-slate-900",
    ];
    return {
      eyebrow: p.marca?.toUpperCase() ?? "DESTACADO",
      title: p.nombre,
      subtitle:
        desde > 0
          ? `Desde ${formatMXN(desde)} al día. Aprobación en 24h. Entrega a domicilio.`
          : "Aprobación en 24h. Entrega a domicilio.",
      ctaPrimary: { label: "Quiero financiarlo", href: `/producto/${p.slug}` },
      ctaSecondary: { label: "Más información", href: `/producto/${p.slug}` },
      image: p.imagen_url ?? undefined,
      imageAlt: p.nombre,
      bgGradient: gradients[idx % gradients.length],
    };
  });

  // Slide de marca SAI siempre visible (incluso sin destacados).
  const slideSAI: HeroSlide = {
    eyebrow: "FINANCIAMIENTO SAI",
    title: "Llévate hoy lo que necesitas, paga en semanas.",
    subtitle:
      "Aprobación en 24 horas. Entrega a domicilio en toda la región.",
    ctaPrimary: {
      label: "Ver catálogo",
      href: categorias[0] ? `/categoria/${categorias[0].slug}` : "/productos",
    },
    ctaSecondary: { label: "Preguntas frecuentes", href: "/faq" },
    bgGradient: "from-blue-950 via-blue-800 to-blue-900",
  };

  const heroSlides: HeroSlide[] =
    slidesProductos.length > 0 ? slidesProductos : [slideSAI];

  // "Más solicitados": destacados generales, excluyendo los que ya salen en el
  // carrusel para no repetir producto.
  const carruselIds = new Set(carrusel.map((p) => p.id));
  const restoDestacados = destacados
    .filter((p) => !carruselIds.has(p.id))
    .slice(0, 4);

  return (
    <div className="flex flex-col flex-1">
      <SiteHeader overlay />

      <main className="flex-1">
        <HeroCarousel slides={heroSlides} />

        <section className="relative z-20 mx-auto -mt-16 max-w-6xl px-4 md:-mt-20 md:px-6">
          <div className="grid gap-4 rounded-2xl border bg-card/95 p-4 shadow-xl backdrop-blur-md md:grid-cols-4 md:p-6">
            {[
              {
                Icon: ShieldCheck,
                titulo: "No revisamos buró",
                texto: "Tu historial no es obstáculo.",
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
              <div key={titulo} className="flex items-start gap-3">
                <span className="shrink-0 rounded-full bg-blue-50 p-2.5 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {titulo}
                  </p>
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
              {restoDestacados.map((p, idx) => (
                <ProductCard key={p.id} producto={p} index={idx} />
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

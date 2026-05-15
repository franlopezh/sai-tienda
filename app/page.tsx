import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { Testimonios } from "@/components/testimonios";
import { HeroCarousel, type HeroSlide } from "@/components/hero-carousel";
import { getCategoriasConPreview, getProductosDestacados } from "@/lib/queries";
import { calcularPlanDefault } from "@/lib/credito";
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

  // Toma los primeros 4 destacados con imagen para los slides del hero.
  const destacadosConImagen = destacados.filter((p) => p.imagen_url).slice(0, 4);

  // Curated: si hay destacados, arma slides. Si no, deja al menos el slide genérico SAI.
  const slidesProductos: HeroSlide[] = destacadosConImagen.map((p, idx) => {
    const plan = calcularPlanDefault(p.precio_contado ?? 0);
    const desde = plan?.pagoDiario ?? p.pago_diario ?? 0;
    const gradients = [
      "from-blue-900 via-blue-700 to-blue-500",
      "from-slate-900 via-slate-800 to-blue-700",
      "from-blue-800 via-indigo-700 to-blue-500",
      "from-blue-950 via-blue-800 to-blue-600",
    ];
    return {
      eyebrow: p.marca?.toUpperCase() ?? "DESTACADO",
      title: p.nombre,
      subtitle:
        desde > 0
          ? `Desde ${formatMXN(desde)} al día. Aprobación en 24h, sin checador.`
          : "Aprobación en 24h, sin checador. Entrega a domicilio.",
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
      "Sin checador. Aprobación en 24 horas. Entrega a domicilio en toda la región.",
    ctaPrimary: {
      label: "Ver catálogo",
      href: categorias[0] ? `/categoria/${categorias[0].slug}` : "/productos",
    },
    ctaSecondary: { label: "Preguntas frecuentes", href: "/faq" },
    bgGradient: "from-blue-900 via-blue-700 to-blue-500",
  };

  const heroSlides: HeroSlide[] =
    slidesProductos.length > 0 ? slidesProductos : [slideSAI];

  const restoDestacados = destacados
    .filter((p) => !destacadosConImagen.some((d) => d.id === p.id))
    .slice(0, 4);

  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />

      <main className="flex-1">
        <HeroCarousel slides={heroSlides} />

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

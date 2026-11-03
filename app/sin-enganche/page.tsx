import Link from "next/link";
import { CalendarX2, Info, PackageX } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/empty-state";
import { getCategorias, getTodosLosProductos } from "@/lib/queries";
import { getPrecioPublico, participaEnPromoSinEnganche } from "@/lib/credito";
import { getFasePromo, PROMO_SIN_ENGANCHE } from "@/lib/promo";

// Igual que la home: ISR de 5 min para que la página cambie sola de
// "ya viene" a "ya comenzó" y a "terminó" sin redeploy.
export const revalidate = 300;

export const metadata = {
  title: "0% de enganche — Market SAI",
  description: `Promoción ${PROMO_SIN_ENGANCHE.nombre}: ${PROMO_SIN_ENGANCHE.descripcionArticulos} sin enganche, ${PROMO_SIN_ENGANCHE.fechas}. Aplican restricciones.`,
};

export default async function SinEnganchePage() {
  const fase = getFasePromo();
  const p = PROMO_SIN_ENGANCHE;

  const [categorias, productos] = await Promise.all([
    getCategorias(),
    getTodosLosProductos({ orden: "credito_asc" }),
  ]);

  // Los agotados no se pueden pedir: en una página de promo solo estorban.
  const participantes = productos.filter(
    (prod) =>
      prod.activo &&
      !prod.agotado &&
      participaEnPromoSinEnganche(getPrecioPublico(prod))
  );

  const grupos = categorias
    .map((c) => ({
      categoria: c,
      productos: participantes.filter((prod) => prod.categoria_id === c.id),
    }))
    .filter((g) => g.productos.length > 0);

  const vigente = fase === "anuncio" || fase === "activa";

  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
        <nav className="text-sm text-muted-foreground">
          <Link href="/">Inicio</Link> › <span>0% de enganche</span>
        </nav>

        {!vigente ? (
          <EmptyState
            className="mt-8"
            icon={CalendarX2}
            title="Esta promoción ya terminó"
            description={`La promoción ${p.nombre} de 0% de enganche fue ${p.fechas}. Sigue financiando con SAI: aprobación en 24 horas y pagos semanales.`}
            primaryAction={{ label: "Ver todos los productos", href: "/productos" }}
            secondaryAction={{ label: "Volver al inicio", href: "/" }}
          />
        ) : (
          <>
            <header className="mt-4 rounded-2xl bg-gradient-to-br from-blue-950 via-blue-800 to-blue-900 p-6 text-white md:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">
                {fase === "activa"
                  ? "¡Ya comenzó! · Termina el 7 de noviembre"
                  : `Muy pronto · ${p.fechas}`}
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                {p.nombre}:{" "}
                <span className="text-red-400">0% de enganche</span>
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-blue-100 md:text-base">
                {fase === "activa"
                  ? `Solo ${p.fechas}, ${p.descripcionArticulos} se van sin enganche: financias el 100% y pagas en semanas.`
                  : `${p.fechas.charAt(0).toUpperCase()}${p.fechas.slice(1)}, ${p.descripcionArticulos} se van sin enganche. Ve eligiendo el tuyo.`}
              </p>
              <p className="mt-4 flex max-w-2xl gap-2 rounded-lg bg-white/10 px-3 py-2.5 text-xs leading-relaxed text-blue-100 ring-1 ring-white/15">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  <strong>{p.disclaimerTitulo}:</strong> {p.disclaimer}
                </span>
              </p>
            </header>

            {grupos.length > 0 ? (
              grupos.map((g) => (
                <section key={g.categoria.id} className="mt-12">
                  <div className="mb-5 flex items-baseline justify-between gap-4">
                    <h2 className="text-xl font-semibold">
                      {g.categoria.nombre.trim()}
                    </h2>
                    <Link
                      href={`/categoria/${g.categoria.slug}`}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Ver categoría ›
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {g.productos.map((prod, idx) => (
                      <ProductCard key={prod.id} producto={prod} index={idx} />
                    ))}
                  </div>
                </section>
              ))
            ) : (
              <EmptyState
                className="mt-8"
                icon={PackageX}
                title="Aún no hay artículos participantes"
                description="Vuelve pronto o explora todo el catálogo."
                primaryAction={{ label: "Ver todos los productos", href: "/productos" }}
              />
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

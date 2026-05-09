import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ConfirmacionRedirect } from "./confirmacion-redirect";
import { buttonVariants } from "@/components/ui/button";

type Params = Promise<{ id: string }>;
type Search = Promise<{ wa?: string }>;

export default async function ConfirmacionPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  const { id } = await params;
  const { wa } = await searchParams;

  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-4 py-20 text-center">
        <span className="text-5xl">✅</span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          ¡Listo!
        </h1>
        <p className="mt-4 text-muted-foreground">
          Te estamos conectando con un ejecutivo SAI para tu solicitud.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Folio: <span className="font-mono">{id.slice(0, 8).toUpperCase()}</span>
        </p>

        {wa ? (
          <>
            <ConfirmacionRedirect waUrl={wa} />
            <div className="mt-8">
              <a
                href={wa}
                className={buttonVariants({ size: "lg" })}
              >
                💬 Abrir WhatsApp
              </a>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              ¿No se abrió automáticamente? Toca el botón.
            </p>
          </>
        ) : (
          <p className="mt-6 max-w-md text-sm text-muted-foreground">
            Ya guardamos tu solicitud. En breve un ejecutivo te contactará por
            WhatsApp.
          </p>
        )}

        <Link
          href="/"
          className="mt-12 text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          ← Volver al catálogo
        </Link>
      </main>

      <SiteFooter />
    </div>
  );
}

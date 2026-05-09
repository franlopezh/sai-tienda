import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PulseLogo } from "@/components/pulse-logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 text-center">
      <Link href="/" className="mb-12">
        <PulseLogo />
      </Link>

      <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
        404 — No encontrado
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">
        Esta página tomó otro camino.
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        El enlace que seguiste no existe o el producto fue retirado del
        catálogo.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          Volver al inicio
        </Link>
        <Link
          href="/categoria/motocicletas"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Ver motos
        </Link>
        <Link
          href="/categoria/celulares"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Ver celulares
        </Link>
      </div>
    </div>
  );
}

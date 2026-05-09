import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductGridSkeleton } from "@/components/product-card-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
        <div className="h-3 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-9 w-64 animate-pulse rounded bg-muted" />
        <div className="mt-8 grid gap-6 md:grid-cols-[16rem_1fr]">
          <div className="h-80 animate-pulse rounded-lg bg-muted" />
          <ProductGridSkeleton count={9} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

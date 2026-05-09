import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ProductGridSkeleton } from "@/components/product-card-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-9 w-72 animate-pulse rounded bg-muted" />
        <div className="mt-8">
          <ProductGridSkeleton count={6} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

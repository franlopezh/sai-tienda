import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function Loading() {
  return (
    <div className="flex flex-col flex-1">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
        <div className="h-3 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-lg bg-muted" />
          <div>
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-9 w-3/4 animate-pulse rounded bg-muted" />
            <div className="mt-8 h-3 w-32 animate-pulse rounded bg-muted" />
            <div className="mt-2 h-7 w-40 animate-pulse rounded bg-muted" />
            <div className="mt-12 h-12 w-full animate-pulse rounded bg-muted" />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

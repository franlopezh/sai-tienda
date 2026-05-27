import { Card } from "@/components/ui/card";

export function ProductCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-2xl border-border/40 bg-card/70 p-0">
      <div className="aspect-square w-full animate-pulse bg-muted/60" />
      <div className="flex flex-1 flex-col items-center gap-2 px-5 pb-5 pt-3">
        <div className="h-2.5 w-16 animate-pulse rounded-full bg-muted/60" />
        <div className="mt-1 h-4 w-3/4 animate-pulse rounded bg-muted/60" />
        <div className="mt-2 h-6 w-28 animate-pulse rounded bg-muted/60" />
        <div className="mt-1 flex items-center gap-1.5">
          <div className="h-4 w-10 animate-pulse rounded-full bg-muted/60" />
          <div className="h-4 w-16 animate-pulse rounded-full bg-muted/60" />
        </div>
      </div>
    </Card>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

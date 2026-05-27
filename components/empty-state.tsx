import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Action = {
  label: string;
  href: string;
};

type Props = {
  icon: LucideIcon;
  title: string;
  description?: string;
  primaryAction?: Action;
  secondaryAction?: Action;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-gradient-to-br from-muted/40 via-card/30 to-transparent px-6 py-14 text-center",
        className,
      )}
    >
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700 ring-8 ring-blue-50/50 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-950/20">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm font-sans text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {(primaryAction || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {primaryAction && (
            <Link
              href={primaryAction.href}
              className={buttonVariants({ size: "sm" })}
            >
              {primaryAction.label}
            </Link>
          )}
          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

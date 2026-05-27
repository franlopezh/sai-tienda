import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Altura del logo en clases tailwind. Default h-10 (40px). */
  size?: "sm" | "md" | "lg";
  /**
   * "default" → logo original (colores azules + texto gris).
   * "light" → logo en blanco silueta, para usar sobre fondos oscuros (hero overlay).
   */
  variant?: "default" | "light";
};

const SIZE_CLASSES = {
  sm: "h-7",
  md: "h-10",
  lg: "h-14",
} as const;

export function PulseLogo({
  className,
  size = "md",
  variant = "default",
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center transition-all duration-300",
        SIZE_CLASSES[size],
        className,
      )}
      aria-label="Market SAI"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/img/logo/market-sai.png"
        alt="Market SAI"
        className={cn(
          "h-full w-auto select-none object-contain transition-[filter] duration-300",
          variant === "light"
            ? "[filter:brightness(0)_invert(1)] drop-shadow-md"
            : "dark:[filter:brightness(0)_invert(1)] dark:drop-shadow-md",
        )}
        draggable={false}
      />
    </span>
  );
}

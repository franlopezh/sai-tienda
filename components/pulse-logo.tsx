type Props = {
  className?: string;
  showText?: boolean;
};

export function PulseLogo({ className, showText = true }: Props) {
  return (
    <span
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-md bg-blue-700 px-4 py-1.5 ${className ?? ""}`}
      aria-label="SAI Tienda"
    >
      <svg
        viewBox="0 0 160 36"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full text-white/25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M0 18 H56 L60 18 L66 6 L72 30 L78 10 L84 22 L90 18 H160" />
      </svg>
      {showText && (
        <span
          className="relative text-xl tracking-wide whitespace-nowrap text-white"
          style={{ fontFamily: "var(--font-logo)" }}
        >
          SAI Tienda
        </span>
      )}
    </span>
  );
}

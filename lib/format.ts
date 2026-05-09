export function formatMXN(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "—";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(num);
}

export function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === "") return 0;
  const num = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
}

export function buildWhatsAppLink(
  telefono: string,
  mensaje: string
): string {
  const cleanTel = telefono.replace(/\D/g, "");
  return `https://wa.me/${cleanTel}?text=${encodeURIComponent(mensaje)}`;
}

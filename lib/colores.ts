/**
 * Colores de la ficha de producto (`productos.colores_disponibles`).
 *
 * Un color puede ser de un tono ("Rojo") o de dos tonos ("Negro/Rojo"), como
 * los círculos partidos del catálogo de motos: base a la izquierda y acento a
 * la derecha. El admin los guarda tal cual; aquí se traducen al puntito de
 * muestra y a la etiqueta del chip.
 */

const GRIS_NEUTRO = "#9ca3af";

const MAPA: Record<string, string> = {
  negro: "#1a1a1a",
  blanco: "#f5f5f5",
  gris: "#9ca3af",
  "gris oscuro": "#4b5563",
  plata: "#c0c0c0",
  plateado: "#c0c0c0",
  dorado: "#d4af37",
  oro: "#d4af37",
  azul: "#2563eb",
  "azul claro": "#60a5fa",
  "azul oscuro": "#1e3a8a",
  celeste: "#7dd3fc",
  rojo: "#dc2626",
  rosa: "#ec4899",
  rosado: "#ec4899",
  "rosa claro": "#f9a8d4",
  verde: "#16a34a",
  "verde menta": "#6ee7b7",
  amarillo: "#facc15",
  naranja: "#f97316",
  morado: "#7c3aed",
  violeta: "#8b5cf6",
  "violeta claro": "#c4b5fd",
  lila: "#c4b5fd",
  cafe: "#92400e",
  marron: "#92400e",
  beige: "#e7d8c0",
  turquesa: "#14b8a6",
};

function normalizar(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

/** Partes de un color: "Negro/Rojo" → ["Negro", "Rojo"]; "Rojo" → ["Rojo"]. */
function tonos(nombre: string): string[] {
  return nombre
    .split("/")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

/** Color CSS de un tono suelto. Si no se reconoce, gris neutro. */
export function swatchColor(nombre: string): string {
  return MAPA[normalizar(nombre)] ?? GRIS_NEUTRO;
}

/**
 * Fondo CSS del puntito de muestra. Un tono → color sólido; dos tonos →
 * círculo partido a la mitad (izquierda la base, derecha el acento).
 */
export function swatchFondo(nombre: string): string {
  const [base, acento] = tonos(nombre);
  if (!base) return GRIS_NEUTRO;
  if (!acento) return swatchColor(base);
  return `linear-gradient(90deg, ${swatchColor(base)} 50%, ${swatchColor(acento)} 50%)`;
}

/** Texto del chip: "Negro/Rojo" → "Negro / Rojo". */
export function etiquetaColor(nombre: string): string {
  return tonos(nombre).join(" / ");
}

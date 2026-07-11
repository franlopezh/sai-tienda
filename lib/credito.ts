// Lógica de cálculo de planes de crédito SAI por segmento.
// Fórmula validada contra la "nueva calculadora de precios articulos sai 14 mayo 2026":
//   1. Cada producto se clasifica por precio_contado en un segmento.
//   2. Cada segmento tiene su propia tabla de plazos y multiplicadores.
//   3. Para cada plazo:
//      total            = precio_contado * multiplicador (= 1 + interesPct/100)
//      enganche         = total * 10%
//      total_a_financiar = total * 90%
//      pago_semanal     = total_a_financiar / semanas
//      pago_diario      = total_a_financiar / dias (≈ pago_semanal / 6)

export type Segmento = "pequenos" | "medianos" | "grandes";

export type PlanCredito = {
  plazo: number; // meses (puede ser decimal: 4.5, 7.5)
  plazoMeses: number;
  semanas: number;
  dias: number;
  multiplicador: number;
  interesPct: number;
  segmento: Segmento;
  total: number;
  enganche: number;
  totalAFinanciar: number;
  pagoSemanal: number;
  pagoDiario: number;
};

type ConfigPlazo = {
  plazo: number;
  semanas: number;
  dias: number;
  multiplicador: number;
  interesPct: number;
};

const CONFIG_POR_SEGMENTO: Record<Segmento, ConfigPlazo[]> = {
  // Productos baratos (precio_contado < $7,000): celulares de gama media,
  // accesorios, productos chicos. Plazos cortos.
  pequenos: [
    { plazo: 3, semanas: 12, dias: 72, multiplicador: 1.45, interesPct: 45 },
    { plazo: 4.5, semanas: 18, dias: 108, multiplicador: 1.6, interesPct: 60 },
    { plazo: 6, semanas: 26, dias: 156, multiplicador: 1.75, interesPct: 75 },
    { plazo: 7.5, semanas: 32, dias: 192, multiplicador: 1.9, interesPct: 90 },
  ],
  // Productos de precio medio ($7,000–$14,999): celulares de gama alta,
  // TVs medianas, motonetas baratas.
  medianos: [
    { plazo: 4, semanas: 17, dias: 102, multiplicador: 1.6, interesPct: 60 },
    { plazo: 6, semanas: 26, dias: 156, multiplicador: 1.75, interesPct: 75 },
    { plazo: 8, semanas: 35, dias: 210, multiplicador: 1.9, interesPct: 90 },
    { plazo: 10, semanas: 43, dias: 258, multiplicador: 2.05, interesPct: 105 },
  ],
  // Productos caros (precio_contado ≥ $15,000): motos, cuatrimotos,
  // electrodomésticos grandes.
  grandes: [
    { plazo: 6, semanas: 26, dias: 156, multiplicador: 1.35, interesPct: 35 },
    { plazo: 9, semanas: 39, dias: 234, multiplicador: 1.525, interesPct: 52.5 },
    { plazo: 12, semanas: 52, dias: 313, multiplicador: 1.7, interesPct: 70 },
    { plazo: 15, semanas: 65, dias: 390, multiplicador: 1.85, interesPct: 85 },
  ],
};

const PLAZO_DEFAULT_POR_SEGMENTO: Record<Segmento, number> = {
  pequenos: 4.5,
  medianos: 6,
  grandes: 12,
};

// Slug de la categoría de motos en Supabase (categorias_productos).
export const CATEGORIA_MOTOS_SLUG = "motocicletas";

// Regla de negocio (jul 2026): las motos dejaron de ofrecer el plazo de 15 meses.
// El resto de categorías conserva todos los plazos de su segmento de precio.
const PLAZOS_EXCLUIDOS_POR_CATEGORIA: Record<string, number[]> = {
  [CATEGORIA_MOTOS_SLUG]: [15],
};

const ENGANCHE_PCT = 0.1;
const DIAS_POR_SEMANA = 6;

/**
 * Precio público que ve el cliente y base para los plazos de financiamiento.
 * `precio_credito` (con markup ya aplicado por el admin SAI) es la fuente de
 * verdad. Fallback a `precio_contado` para productos legacy sin precio_credito.
 */
export function getPrecioPublico(producto: {
  precio_contado: number;
  precio_credito: number;
}): number {
  return producto.precio_credito > 0
    ? producto.precio_credito
    : producto.precio_contado;
}

export function getSegmento(precio: number): Segmento {
  if (precio < 7000) return "pequenos";
  if (precio < 15000) return "medianos";
  return "grandes";
}

export function getPlazoDefault(precio: number): number {
  return PLAZO_DEFAULT_POR_SEGMENTO[getSegmento(precio)];
}

export function getPlazosDisponibles(precio: number): number[] {
  return CONFIG_POR_SEGMENTO[getSegmento(precio)].map((c) => c.plazo);
}

export function calcularPlan(
  precio: number,
  plazo: number
): PlanCredito | null {
  const segmento = getSegmento(precio);
  const config = CONFIG_POR_SEGMENTO[segmento].find((c) => c.plazo === plazo);
  if (!config) return null;
  const total = precio * config.multiplicador;
  const enganche = total * ENGANCHE_PCT;
  const totalAFinanciar = total - enganche;
  const pagoSemanal = totalAFinanciar / config.semanas;
  const pagoDiario = pagoSemanal / DIAS_POR_SEMANA;
  return {
    plazo: config.plazo,
    plazoMeses: config.plazo,
    semanas: config.semanas,
    dias: config.dias,
    multiplicador: config.multiplicador,
    interesPct: config.interesPct,
    segmento,
    total,
    enganche,
    totalAFinanciar,
    pagoSemanal,
    pagoDiario,
  };
}

export function calcularPlanes(
  precio: number,
  categoriaSlug?: string | null
): PlanCredito[] {
  const segmento = getSegmento(precio);
  const excluidos = categoriaSlug
    ? (PLAZOS_EXCLUIDOS_POR_CATEGORIA[categoriaSlug] ?? [])
    : [];
  return CONFIG_POR_SEGMENTO[segmento]
    .filter((c) => !excluidos.includes(c.plazo))
    .map((c) => calcularPlan(precio, c.plazo))
    .filter((p): p is PlanCredito => p !== null);
}

// Plan por defecto a usar en cards y vistas previas.
export function calcularPlanDefault(precio: number): PlanCredito | null {
  return calcularPlan(precio, getPlazoDefault(precio));
}

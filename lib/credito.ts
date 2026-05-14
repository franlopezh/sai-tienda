// Lógica de cálculo de planes de crédito SAI.
// Fórmula validada contra la TABLA DE AMORTIZACION oficial:
//   total            = precio * multiplicador
//   enganche         = total * 10%
//   total_a_financiar = total - enganche
//   pago_semanal     = total_a_financiar / semanas
//   pago_diario      = pago_semanal / 6

export type PlazoCredito = 4 | 9 | 12 | 18;

export type PlanCredito = {
  plazo: PlazoCredito;
  plazoMeses: number;
  semanas: number;
  multiplicador: number;
  interesPct: number;
  total: number;
  enganche: number;
  totalAFinanciar: number;
  pagoSemanal: number;
  pagoDiario: number;
};

const CONFIG_PLAZOS: Record<
  PlazoCredito,
  { multiplicador: number; semanas: number; interesPct: number }
> = {
  // Plazo corto pensado para celulares (109 días ≈ 18 semanas).
  // Mismo multiplicador que 12 meses: el total a pagar es igual,
  // solo cambia la duración (pagos más altos en menos tiempo).
  4: { multiplicador: 1.7, semanas: 18, interesPct: 70 },
  9: { multiplicador: 1.525, semanas: 39, interesPct: 52.5 },
  12: { multiplicador: 1.7, semanas: 52, interesPct: 70 },
  18: { multiplicador: 2.05, semanas: 78, interesPct: 105 },
};

export const PLAZOS_DISPONIBLES: PlazoCredito[] = [4, 9, 12, 18];
export const PLAZO_DEFAULT: PlazoCredito = 12;

const ENGANCHE_PCT = 0.1;
const DIAS_POR_SEMANA = 6;

export function calcularPlan(
  precio: number,
  plazo: PlazoCredito
): PlanCredito {
  const config = CONFIG_PLAZOS[plazo];
  const total = precio * config.multiplicador;
  const enganche = total * ENGANCHE_PCT;
  const totalAFinanciar = total - enganche;
  const pagoSemanal = totalAFinanciar / config.semanas;
  const pagoDiario = pagoSemanal / DIAS_POR_SEMANA;
  return {
    plazo,
    plazoMeses: plazo,
    semanas: config.semanas,
    multiplicador: config.multiplicador,
    interesPct: config.interesPct,
    total,
    enganche,
    totalAFinanciar,
    pagoSemanal,
    pagoDiario,
  };
}

export function calcularPlanes(precio: number): PlanCredito[] {
  return PLAZOS_DISPONIBLES.map((plazo) => calcularPlan(precio, plazo));
}

// Promoción temporal "El Gran Fin: 0% de enganche" (noviembre 2026).
//
// Del 4 al 7 de noviembre TODOS los artículos de la tienda se venden sin
// enganche: el cliente financia el 100% del total en sus pagos. Fuera de esas
// fechas todo vuelve solo al 10% de enganche — no hace falta deploy para
// apagarla.
//
// Fechas en hora del centro de México (UTC-6; sin horario de verano desde 2022).
// Para otra promo igual basta con cambiar las fechas y los segmentos de aquí.

import type { Segmento } from "./credito";

export const PROMO_SIN_ENGANCHE = {
  nombre: "El Gran Fin",
  // Desde cuándo el inicio muestra el flyer y el video ("¡Espéralo pronto!").
  anuncio: new Date("2026-11-03T00:00:00-06:00"),
  inicio: new Date("2026-11-04T00:00:00-06:00"),
  // Exclusivo: la promo cubre todo el 10 de noviembre (se extendió el 7 de
  // noviembre; originalmente terminaba el 7). Los textos siguen diciendo
  // "4 al 7" hasta que el owner mande el flyer y los textos de la extensión.
  fin: new Date("2026-11-11T00:00:00-06:00"),
  // Segmentos de precio de lib/credito.ts que entran (hoy: todos).
  segmentos: ["pequenos", "medianos", "grandes"] as Segmento[],
  descripcionArticulos: "todos los artículos de la tienda",
  fechas: "del 4 al 7 de noviembre",
  // Textos legales del owner (nov 2026). El completo va en el flujo de compra
  // (ficha, solicitud, /sin-enganche); el corto en banners (inicio, video).
  disclaimerTitulo: "Aviso legal y condiciones de promoción",
  disclaimer:
    'Promoción "El Gran Fin" válida únicamente durante el periodo del 4 al 7 de noviembre de 2026 o hasta agotar existencias. Oferta sujeta a la disponibilidad de inventario al momento de procesar la solicitud. Beneficio exclusivo para clientes seleccionados, sujeto a evaluación y aprobación previa con base en el historial de créditos y comportamiento de pago registrado con la empresa. Aplican restricciones y criterios internos de crédito. Los plazos y precios pueden variar. Nos reservamos el derecho de modificar o cancelar los términos de esta promoción en cualquier momento sin previo aviso.',
  disclaimerCorto:
    "Válido del 4 al 7 de noviembre de 2026 o hasta agotar existencias. Sujeto a disponibilidad de inventario. Beneficio aplicable exclusivamente según la evaluación del historial de créditos del cliente con la empresa y sujeto a políticas internas de crédito. Los plazos y precios pueden variar. Aplican restricciones.",
  flyer: "/promo/sin-enganche-flyer.jpg",
  video: "/promo/sin-enganche-video.mp4",
  videoPoster: "/promo/sin-enganche-video-poster.jpg",
};

export type FasePromo = "sin-anunciar" | "anuncio" | "activa" | "terminada";

// Solo en desarrollo: simula otra fecha para revisar la promo en local, p. ej.
//   $env:NEXT_PUBLIC_PROMO_FECHA_SIMULADA="2026-11-05T12:00:00-06:00"; npm run dev
// Es NEXT_PUBLIC_ para que también la vea el navegador (video de bienvenida).
// En producción se ignora siempre.
function ahoraReal(): Date {
  const simulada =
    process.env.NODE_ENV !== "production"
      ? process.env.NEXT_PUBLIC_PROMO_FECHA_SIMULADA
      : undefined;
  return simulada ? new Date(simulada) : new Date();
}

export function getFasePromo(ahora: Date = ahoraReal()): FasePromo {
  const t = ahora.getTime();
  if (t < PROMO_SIN_ENGANCHE.anuncio.getTime()) return "sin-anunciar";
  if (t < PROMO_SIN_ENGANCHE.inicio.getTime()) return "anuncio";
  if (t < PROMO_SIN_ENGANCHE.fin.getTime()) return "activa";
  return "terminada";
}

/** True mientras corre la promo (4–7 nov). Las páginas lo calculan en el
 * servidor y se lo pasan a los componentes cliente, para que server y browser
 * usen el mismo reloj al calcular los planes. */
export function promoSinEngancheActiva(ahora: Date = ahoraReal()): boolean {
  return getFasePromo(ahora) === "activa";
}

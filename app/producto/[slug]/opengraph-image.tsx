import { ImageResponse } from "next/og";
import { getProductoBySlug } from "@/lib/queries";
import { calcularPlanDefault, getPrecioPublico } from "@/lib/credito";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Market SAI";

export default async function OpenGraphImage({
  params,
}: {
  params: { slug: string };
}) {
  const producto = await getProductoBySlug(params.slug);

  const nombre = producto?.nombre ?? "Market SAI";
  const marca = producto?.marca?.trim() ?? "";
  const planDefault = producto
    ? calcularPlanDefault(getPrecioPublico(producto))
    : null;
  const pagoSemanal = planDefault?.pagoSemanal ?? producto?.pago_semanal ?? 0;
  const pagoDiario = planDefault?.pagoDiario ?? producto?.pago_diario ?? 0;
  const imagen = producto?.imagen_url ?? null;

  const formatMXN = (v: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(v);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #3b82f6 100%)",
          color: "white",
          padding: 60,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <svg
              viewBox="0 0 24 24"
              width={40}
              height={40}
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span
              style={{
                fontSize: 32,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              MARKET SAI
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {marca && (
              <span
                style={{
                  fontSize: 22,
                  textTransform: "uppercase",
                  letterSpacing: 2,
                  color: "#dbeafe",
                }}
              >
                {marca}
              </span>
            )}
            <span
              style={{
                fontSize: 64,
                fontWeight: 600,
                marginTop: 8,
                lineHeight: 1.1,
                maxWidth: 600,
              }}
            >
              {nombre}
            </span>
            {pagoDiario > 0 ? (
              <span style={{ fontSize: 36, marginTop: 24, color: "white" }}>
                desde{" "}
                <span style={{ fontWeight: 700 }}>
                  {formatMXN(pagoDiario)} / día
                </span>
              </span>
            ) : pagoSemanal > 0 ? (
              <span style={{ fontSize: 36, marginTop: 24, color: "white" }}>
                desde{" "}
                <span style={{ fontWeight: 700 }}>
                  {formatMXN(pagoSemanal)} / semana
                </span>
              </span>
            ) : null}
          </div>

          <span
            style={{
              fontSize: 22,
              color: "#dbeafe",
              fontWeight: 500,
            }}
          >
            No revisamos buró · Aprobación 24h · Entrega a domicilio
          </span>
        </div>

        {imagen && (
          <div
            style={{
              width: 480,
              height: 480,
              alignSelf: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: 32,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img
              src={imagen}
              width={416}
              height={416}
              style={{ objectFit: "contain" }}
            />
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}

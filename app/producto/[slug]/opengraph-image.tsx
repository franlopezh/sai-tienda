import { ImageResponse } from "next/og";
import { getProductoBySlug } from "@/lib/queries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "SAI Shop";

export default async function OpenGraphImage({
  params,
}: {
  params: { slug: string };
}) {
  const producto = await getProductoBySlug(params.slug);

  const nombre = producto?.nombre ?? "SAI Shop";
  const marca = producto?.marca?.trim() ?? "";
  const pagoSemanal = producto?.pago_semanal ?? 0;
  const pagoDiario = producto?.pago_diario ?? 0;
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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <svg
              viewBox="0 0 80 24"
              width={64}
              height={20}
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M0 12 H18 L22 12 L26 4 L30 20 L34 8 L38 14 L42 12 H80" />
            </svg>
            <span style={{ fontSize: 28, fontWeight: 600 }}>SAI Shop</span>
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
            Sin checador · Aprobación 24h · Entrega a domicilio
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

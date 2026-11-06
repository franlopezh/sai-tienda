// Modo mantenimiento: con la variable de entorno MANTENIMIENTO=1 toda la
// tienda responde con una página "En mantenimiento" (HTTP 503) y nadie ve el
// catálogo. Se responde aquí, antes de renderizar, para que no salgan el
// layout, el botón de WhatsApp ni el video de la promo.
//
// Prender:  vercel env add MANTENIMIENTO production   (valor: 1)  → vercel --prod --yes
// Apagar:   vercel env rm MANTENIMIENTO production --yes          → vercel --prod --yes
// En local: $env:MANTENIMIENTO="1"; npm run dev

export function proxy() {
  if (process.env.MANTENIMIENTO !== "1") return;
  return new Response(PAGINA, {
    status: 503,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Retry-After": "3600",
      "X-Robots-Tag": "noindex",
    },
  });
}

export const config = {
  // Todo menos los archivos que usa la propia página (logo, favicon) y los
  // estáticos de Next.
  matcher: ["/((?!_next/static|_next/image|img/|icon|favicon.ico).*)"],
};

const PAGINA = `<!doctype html>
<html lang="es-MX">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Market SAI — En mantenimiento</title>
<link rel="icon" href="/icon">
<style>
  :root { --fondo: #f8fafc; --texto: #0f172a; --suave: #475569; --linea: #e2e8f0; --tarjeta: #ffffff; --acento: #1d4ed8; }
  @media (prefers-color-scheme: dark) {
    :root { --fondo: #0b1120; --texto: #f1f5f9; --suave: #94a3b8; --linea: #1e293b; --tarjeta: #111827; --acento: #60a5fa; }
    .logo { filter: brightness(0) invert(1); }
  }
  * { box-sizing: border-box; }
  html, body { height: 100%; margin: 0; }
  body {
    display: flex; align-items: center; justify-content: center; padding: 24px 16px;
    background: var(--fondo); color: var(--texto);
    font-family: "DM Sans", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }
  main {
    width: 100%; max-width: 440px; text-align: center; padding: 40px 28px;
    background: var(--tarjeta); border: 1px solid var(--linea); border-radius: 24px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, .06);
  }
  .logo { height: 56px; width: auto; margin: 0 auto 28px; display: block; }
  .icono {
    width: 52px; height: 52px; margin: 0 auto 16px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: color-mix(in srgb, var(--acento) 12%, transparent); color: var(--acento);
  }
  h1 { font-size: 24px; line-height: 1.25; margin: 0 0 10px; }
  p { font-size: 15px; line-height: 1.6; margin: 0; color: var(--suave); }
</style>
</head>
<body>
<main>
  <img class="logo" src="/img/logo/market-sai.png" alt="Market SAI">
  <div class="icono" aria-hidden="true">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
  </div>
  <h1>Estamos en mantenimiento</h1>
  <p>Estamos haciendo mejoras en la tienda. Vuelve pronto.</p>
</main>
</body>
</html>`;

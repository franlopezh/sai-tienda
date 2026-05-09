@AGENTS.md

# SAI Tienda — contexto del proyecto

## Resumen

Catálogo público e-commerce de **SAI Préstamos** (microfinanciera mexicana). El cliente
elige producto, llena un form, el sistema asigna ejecutivo automáticamente y abre
WhatsApp con un mensaje pre-armado. **No hay checkout en el sitio** — el ejecutivo
cierra la venta por WhatsApp.

- **URL pública**: https://tienda-sai.vercel.app
- **Repo**: https://github.com/franlopezh/sai-tienda (público, owner GitHub `franlopezh`)
- **Vercel**: `hebermacias-projects/tienda-sai` (cuenta separada del owner GitHub)
- **Supabase**: proyecto `omuwosfxegdarjhbwtov` — compartido con el repo SAI Angular interno

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19
- **Tailwind CSS v4** (CSS variables para tema-aware vía Shadcn)
- **Shadcn UI** (sobre @base-ui/react, NO Radix)
- **Supabase** (REST + JS client, anon key)
- **next-themes** dark mode toggle
- **lucide-react** iconos
- **Tipografía**: Marcellus en logo (serif afilada), DM Sans en sitio

## Estructura de carpetas

```
app/
  page.tsx                      Home: hero + ¿Por qué SAI? + categorías + destacados + testimonios
  categoria/[slug]/             Listado por categoría con filtros sticky sidebar
  producto/[slug]/              Detalle: galería + ficha + modal lead + relacionados + sticky CTA mobile
  producto/[slug]/opengraph-image.tsx   OG image dinámico por producto (next/og)
  productos/                    Vista global todos los productos
  buscar/                       Resultados de búsqueda
  solicitud/[id]/               Confirmación post-lead + redirect WhatsApp
  (legal)/                      Privacidad, Términos, FAQ, Contacto (route group)
  not-found.tsx                 404 personalizado con logo
  icon.tsx                      Favicon dinámico SVG (pulso azul)
  layout.tsx                    ThemeProvider + WhatsAppFab + ScrollToTop + fonts
  globals.css                   CSS vars + paleta blue-700

components/
  pulse-logo.tsx                Logo "SAI Tienda" pill azul (Marcellus)
  site-header.tsx               Header sticky con search + theme toggle + nav
  site-footer.tsx               Footer con sucursales + enlaces + redes
  product-card.tsx              Card uniforme: h-44 mobile / h-52 desktop, max-h/w object-contain
  lead-modal.tsx                Modal financiamiento: form + INSERT solicitudes_compra + round-robin + WhatsApp
  categoria-filtros.tsx         Sidebar sticky filtros (orden, marca, pago semanal min/max)
  todos-productos-filtros.tsx   Variante con filtro de categoría
  search-input.tsx              Input header → /buscar
  scroll-to-top.tsx             Cliente que fuerza scroll al top en cada navegación
  whatsapp-fab.tsx              Botón flotante WhatsApp esquina inferior derecha
  testimonios.tsx               3 cards placeholder Unsplash
  theme-toggle.tsx              Sun/Moon switch en header
  product-card-skeleton.tsx     Skeleton para loading states
  ui/                           Shadcn components (button, card, dialog, input, select, etc.)

lib/
  supabase.ts                   Cliente Supabase con env vars NEXT_PUBLIC_*
  queries.ts                    Todas las queries: getCategorias, getProductosPorCategoria, buscarProductos, etc.
  types.ts                      Producto, Categoria
  format.ts                     formatMXN, buildWhatsAppLink
  utils.ts                      cn (Tailwind class merger)
```

## BD Supabase (compartida con SAI Angular)

- **productos** — slug, nombre, marca, modelo, descripcion, precio_contado, precio_credito, pago_semanal, pago_diario, enganche, imagen_url, categoria_id, activo
- **categorias_productos** — slug, nombre, orden, activo, icono
- **solicitudes_compra** — leads del catálogo. RLS: anon solo INSERT (con WITH CHECK), authenticated SELECT/UPDATE
- **ejecutivos_publicos** — números WhatsApp para asignación. Round-robin random pick

> ⚠️ La anon key del catálogo NO puede leer `solicitudes_compra` ni `ejecutivos_publicos`. SAI Angular admin (otro repo) lee/actualiza vía edge function `admin-leads` con `service_role` y header `x-sai-admin-secret`.

## Decisiones de arquitectura

- **Sin checkout en el sitio** — el ejecutivo cierra la venta por WhatsApp. El lead solo es lead.
- **Round-robin random** — `lead-modal.tsx` filtra ejecutivos activos por ciudad, fallback a globales (ciudad NULL), random pick. Sin estado en BD.
- **Cada lead ya guarda `ejecutivo_asignado` y `gerencia_asignada`** en `solicitudes_compra` para tracking.
- **Tema-aware vía Shadcn vars** — `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`. NO usar `bg-white`/`text-zinc-X` hardcoded — rompen dark mode.
- **Imágenes hot-link**: Winmex CDN (zyrosite), Apple newsroom (lineup iPhone 13), Xiaomi mi.com (POCO M7), GadgetPH blogger (nubia V80 Pro back+front), Wikimedia, Unsplash (placeholders categorías sin productos).
- **Logo pulso** — pill azul `bg-blue-700` con SVG inline tipo electrocardiograma. Texto "SAI Tienda" en Marcellus serif.
- **OG image dinámico** por producto vía `next/og` `ImageResponse`.

## Comandos

```bash
npm run dev      # Dev server (puerto 3000 o 3001 si ocupado)
npm run build    # SIEMPRE validar antes de push
npm run lint     # ESLint

git push         # Trigger Vercel deploy automático (si conectado al repo)
vercel --prod    # Deploy manual a producción
vercel ls --prod # Ver últimos deployments
vercel alias set <deployment> tienda-sai.vercel.app   # Re-asignar alias
```

## Variables de entorno

`.env.local` (no commiteado, ignorado por `.gitignore`):

```
NEXT_PUBLIC_SUPABASE_URL=https://omuwosfxegdarjhbwtov.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key Supabase>
```

`.env.local.example` sí está commiteado con placeholders. Vercel ya tiene ambas vars en production/preview/development.

## Convenciones

- **Server components por default** (App Router). Cliente solo cuando hay interactividad: lead-modal, search, filtros, theme toggle, scroll-to-top, confirmación-redirect.
- **Imágenes**: `<img>` raw con `loading="lazy"`. NO se usa `next/image` para mantener compatibilidad con URLs externas sin configurar `remotePatterns`.
- **Fechas**: ISO strings desde Supabase. Formatear cuando se renderice.
- **WhatsApp links**: usar `buildWhatsAppLink(numero, mensaje)` de `lib/format.ts`.

## Para arreglos típicos

- **Cambio de fuente del sitio**: editar `app/layout.tsx` cambiando el import de `next/font/google`. Reiniciar dev server (HMR no actualiza fonts).
- **Cambio de paleta**: `app/globals.css` `--primary` (oklch). Default azul `oklch(0.488 0.243 264.376)` (~blue-700).
- **Nueva categoría sin productos**: agregar URL placeholder en `PREVIEW_FALLBACK` en `app/page.tsx`.
- **Nuevo producto**: insertar en BD con `slug`, `imagen_url`, `categoria_id`, `activo=true`. El catálogo lo levanta automático.

## Pendientes conocidos

- **Páginas legales** (`/privacidad`, `/terminos`, `/faq`, `/contacto`) tienen texto base placeholder. Falta domicilio fiscal SAI, RFC, info legal real.
- **Footer**: redes sociales (Instagram/Facebook/WhatsApp general) con URLs placeholder.
- **Más ejecutivos** en `ejecutivos_publicos` — solo hay 1 seed (id `3608398a-c433-4074-ada9-f30e1e6f8c96`, número del owner). El round-robin se activa al agregar más con `ciudad` específica.
- **Deployment Protection en Vercel** — el owner debe desactivarlo en https://vercel.com/hebermacias-projects/tienda-sai/settings/deployment-protection para que la URL pública NO pida login.
- **`SAI_ADMIN_SECRET`** en Supabase Edge Functions Dashboard pendiente para que el admin SAI Angular pueda gestionar leads.

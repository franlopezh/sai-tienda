import Link from "next/link";
import { MessageCircle, MapPin } from "lucide-react";
import { PulseLogo } from "@/components/pulse-logo";
import { WhatsAppLink } from "@/components/whatsapp-link";

// Lucide-react 1.x no exporta Instagram/Facebook. SVGs inline para evitar
// cambiar la dependencia.
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const SUCURSALES = [
  "Tlaxcala",
  "Puebla",
  "Pachuca",
  "Texcoco",
  "Teotihuacán",
  "Tulancingo",
  "Otumba",
  "Calpulalpan",
  "Sahagún",
  "Texmelucan",
];

export function SiteFooter() {
  return (
    <footer>
      {/* CTA superior — banda azul SAI invitando a contactar */}
      <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 sm:flex-row sm:justify-between sm:py-10">
          <div className="text-center sm:text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200">
              ¿Listo para llevarte tu producto?
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">
              Habla con un ejecutivo y aprueba en 24 horas.
            </h3>
          </div>
          <WhatsAppLink
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-blue-800 shadow-lg shadow-blue-900/20 transition-all duration-200 hover:scale-105 hover:bg-blue-50 active:scale-95 active:duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            mensaje="Hola, me interesa información sobre SAI Préstamos. ¿Pueden ayudarme?"
          >
            <MessageCircle className="h-4 w-4" />
            Escríbenos por WhatsApp
          </WhatsAppLink>
        </div>
      </div>

      {/* 4 columnas principales */}
      <div className="border-t border-border/40 bg-card/40">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 text-sm text-muted-foreground md:grid-cols-12">
          {/* Marca + tagline (col más ancha) */}
          <div className="md:col-span-4">
            <PulseLogo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Financiamos lo que necesitas, paga cómodo en semanas.
              Aprobación en 24h, entrega a domicilio.
            </p>
            {/* Redes sociales con iconos */}
            <div className="mt-5 flex items-center gap-2">
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-blue-300/80 hover:bg-blue-50 hover:text-blue-700 dark:hover:border-blue-700/60 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-blue-300/80 hover:bg-blue-50 hover:text-blue-700 dark:hover:border-blue-700/60 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <WhatsAppLink
                ariaLabel="WhatsApp general"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-emerald-300/80 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:border-emerald-700/60 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
              >
                <MessageCircle className="h-4 w-4" />
              </WhatsAppLink>
            </div>
          </div>

          {/* Sucursales */}
          <div className="md:col-span-4">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground">
              <MapPin className="h-3.5 w-3.5 text-blue-700 dark:text-blue-400" />
              Sucursales
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
              {SUCURSALES.map((s) => (
                <li key={s} className="text-xs">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Información */}
          <div className="md:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground">
              Información
            </p>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link
                  href="/privacidad"
                  className="hover:text-foreground transition-colors"
                >
                  Aviso de privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/terminos"
                  className="hover:text-foreground transition-colors"
                >
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-foreground transition-colors"
                >
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="hover:text-foreground transition-colors"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorías rápidas (en lugar de 'Síguenos' duplicado) */}
          <div className="md:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground">
              Catálogo
            </p>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link
                  href="/categoria/motocicletas"
                  className="hover:text-foreground transition-colors"
                >
                  Motocicletas
                </Link>
              </li>
              <li>
                <Link
                  href="/categoria/celulares"
                  className="hover:text-foreground transition-colors"
                >
                  Celulares
                </Link>
              </li>
              <li>
                <Link
                  href="/categoria/televisores"
                  className="hover:text-foreground transition-colors"
                >
                  Televisores
                </Link>
              </li>
              <li>
                <Link
                  href="/productos"
                  className="font-medium text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Ver todos →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bottom */}
      <div className="border-t border-border/40 bg-card/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-[11px] text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} SAI Préstamos. Todos los derechos
            reservados.
          </p>
          <p>
            Hecho con <span className="text-blue-700 dark:text-blue-400">●</span>{" "}
            en México
          </p>
        </div>
      </div>
    </footer>
  );
}

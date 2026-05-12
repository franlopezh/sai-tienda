import Link from "next/link";
import { PulseLogo } from "@/components/pulse-logo";
import { WhatsAppLink } from "@/components/whatsapp-link";

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
    <footer className="border-t bg-muted/50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-sm text-muted-foreground md:grid-cols-4">
        <div>
          <PulseLogo />
          <p className="mt-3 text-muted-foreground">
            Financiamos lo que necesitas, paga cómodo en semanas.
          </p>
        </div>

        <div>
          <p className="font-medium text-foreground">Sucursales</p>
          <ul className="mt-2 space-y-1">
            {SUCURSALES.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-medium text-foreground">Información</p>
          <ul className="mt-2 space-y-1">
            <li>
              <Link href="/privacidad" className="hover:text-foreground">
                Aviso de privacidad
              </Link>
            </li>
            <li>
              <Link href="/terminos" className="hover:text-foreground">
                Términos y condiciones
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-foreground">
                Preguntas frecuentes
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-foreground">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="font-medium text-foreground">Síguenos</p>
          <ul className="mt-2 space-y-1">
            <li>
              <a
                href="#"
                className="hover:text-foreground"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-foreground"
                target="_blank"
                rel="noreferrer"
              >
                Facebook
              </a>
            </li>
            <li>
              <WhatsAppLink className="hover:text-foreground">
                WhatsApp general
              </WhatsAppLink>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t bg-muted">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} SAI Préstamos. Todos los derechos
          reservados.
        </div>
      </div>
    </footer>
  );
}

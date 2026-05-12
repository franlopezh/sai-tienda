import { WhatsAppLink } from "@/components/whatsapp-link";

export const metadata = {
  title: "Contacto — SAI Tienda",
};

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

export default function ContactoPage() {
  return (
    <article>
      <h1 className="text-3xl font-semibold tracking-tight">Contacto</h1>
      <p className="mt-2 text-muted-foreground">
        La forma más rápida de hablar con un ejecutivo es desde la ficha de
        cualquier producto: el botón “Quiero financiarlo” te conecta directo
        por WhatsApp.
      </p>

      <h2 className="mt-10 text-xl font-semibold">Sucursales</h2>
      <p className="mt-2 text-muted-foreground">
        Atendemos a personas en estas zonas:
      </p>
      <ul className="mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
        {SUCURSALES.map((s) => (
          <li
            key={s}
            className="rounded border bg-card px-3 py-2 text-foreground/80"
          >
            {s}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-xl font-semibold">Otras vías</h2>
      <ul className="mt-3 list-disc pl-6 text-sm">
        <li>
          <WhatsAppLink className="text-foreground underline-offset-4 hover:underline">
            Escríbenos por WhatsApp
          </WhatsAppLink>
        </li>
        <li>Instagram — pendiente</li>
        <li>Facebook — pendiente</li>
      </ul>

      <p className="mt-12 text-sm text-muted-foreground italic">
        SAI debe completar esta página con direcciones físicas y URLs de redes
        sociales antes de publicar a producción.
      </p>
    </article>
  );
}

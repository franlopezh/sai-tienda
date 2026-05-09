import { Quote } from "lucide-react";

const TESTIMONIOS = [
  {
    nombre: "María Hernández",
    ciudad: "Tlaxcala",
    foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    texto:
      "Saqué mi moto sin pasar por buró. En menos de 24 horas ya tenía la aprobación y al día siguiente la moto en mi casa.",
  },
  {
    nombre: "Carlos Mendoza",
    ciudad: "Pachuca",
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    texto:
      "Pago diario me ayuda a llevarlo al ritmo de mis ingresos como repartidor. El ejecutivo siempre disponible por WhatsApp.",
  },
  {
    nombre: "Lucía Ortega",
    ciudad: "Texcoco",
    foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    texto:
      "Cambié mi celular con SAICell y la verdad el trato fue excelente. Recomiendo SAI Préstamos a todas mis amigas.",
  },
];

export function Testimonios() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="mb-2 text-2xl font-semibold">Lo que dicen nuestros clientes</h2>
      <p className="mb-8 text-sm text-muted-foreground">
        Más de 14,000 personas han confiado en SAI Préstamos.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {TESTIMONIOS.map((t) => (
          <article
            key={t.nombre}
            className="flex h-full flex-col rounded-lg border bg-card p-6"
          >
            <Quote className="h-6 w-6 text-blue-200" strokeWidth={2} />
            <p className="mt-3 flex-1 text-sm text-foreground/80">“{t.texto}”</p>
            <div className="mt-6 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.foto}
                alt={t.nombre}
                className="h-10 w-10 rounded-full object-cover"
                loading="lazy"
              />
              <div>
                <p className="text-sm font-medium">{t.nombre}</p>
                <p className="text-xs text-muted-foreground">{t.ciudad}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

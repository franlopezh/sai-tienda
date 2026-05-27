export const metadata = {
  title: "Preguntas frecuentes — Market SAI",
};

const FAQS = [
  {
    q: "¿Necesito buró de crédito para que me aprueben?",
    a: "No. SAI Préstamos no checa buró. Solo necesitas INE actualizada y comprobante de domicilio.",
  },
  {
    q: "¿Cuánto tarda la aprobación?",
    a: "Tu ejecutivo te confirma la aprobación en menos de 24 horas hábiles después de recibir tu solicitud y documentos.",
  },
  {
    q: "¿Cuáles son los plazos de pago?",
    a: "Depende del producto. Las motos suelen ser semanales hasta 78 semanas; los celulares pueden ser pago diario por 72 días. Tu ejecutivo te muestra las opciones.",
  },
  {
    q: "¿Hay enganche?",
    a: "Algunos productos sí, otros no. Lo verás marcado en cada producto. Cuando aplica, el enganche se paga al recibir el producto.",
  },
  {
    q: "¿Entregan a domicilio?",
    a: "Sí, en las ciudades con sucursal SAI. Tu ejecutivo coordina la entrega contigo.",
  },
  {
    q: "¿Qué pasa si no puedo pagar una semana?",
    a: "Comunícate con tu ejecutivo SAI lo antes posible. Tienen opciones de reestructuración para casos excepcionales.",
  },
];

export default function FaqPage() {
  return (
    <article>
      <h1 className="text-3xl font-semibold tracking-tight">
        Preguntas frecuentes
      </h1>
      <p className="mt-2 text-muted-foreground">
        Respuestas rápidas a las dudas más comunes.
      </p>

      <div className="mt-8 space-y-6">
        {FAQS.map((item) => (
          <details
            key={item.q}
            className="group rounded-lg border bg-card p-4 [&_summary]:cursor-pointer"
          >
            <summary className="font-medium list-none flex items-center justify-between gap-3">
              <span>{item.q}</span>
              <span className="text-muted-foreground/70 transition group-open:rotate-180">
                ▾
              </span>
            </summary>
            <p className="mt-3 text-sm text-foreground/80">{item.a}</p>
          </details>
        ))}
      </div>

      <p className="mt-12 text-sm text-muted-foreground italic">
        ¿Tu pregunta no está aquí? Contáctanos y un ejecutivo te responde.
      </p>
    </article>
  );
}

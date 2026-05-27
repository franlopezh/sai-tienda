export const metadata = {
  title: "Términos y condiciones — Market SAI",
};

export default function TerminosPage() {
  return (
    <article>
      <h1 className="text-3xl font-semibold tracking-tight">
        Términos y condiciones
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Última actualización: pendiente de personalización por SAI.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Aceptación</h2>
      <p>
        Al usar este sitio aceptas los términos descritos en este documento.
        Si no estás de acuerdo, te pedimos no continuar con la solicitud.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Catálogo y precios</h2>
      <p>
        El precio de cada producto, plazo y pago semanal/diario se muestra de
        manera referencial. La aprobación final del crédito y el monto exacto
        se determinan después del análisis del ejecutivo SAI.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Solicitud de crédito</h2>
      <p>
        El botón &quot;Quiero financiarlo&quot; genera una solicitud que se
        envía a un ejecutivo. No constituye una autorización automática del
        crédito ni una venta confirmada.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Disponibilidad</h2>
      <p>
        Los productos están sujetos a existencias. SAI se reserva el derecho
        de modificar precios y condiciones sin aviso previo.
      </p>

      <p className="mt-12 text-sm text-muted-foreground italic">
        Este documento es un texto base. SAI debe revisarlo y completarlo con
        las condiciones legales y comerciales definitivas antes de publicarlo
        en producción.
      </p>
    </article>
  );
}

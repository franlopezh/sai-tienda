export const metadata = {
  title: "Aviso de privacidad — Market SAI",
};

export default function PrivacidadPage() {
  return (
    <article>
      <h1 className="text-3xl font-semibold tracking-tight">
        Aviso de privacidad
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Última actualización: pendiente de personalización por SAI.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Responsable</h2>
      <p>
        SAI Préstamos, con domicilio en sus sucursales habituales, es el
        responsable del tratamiento de tus datos personales recopilados a
        través de este sitio.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Datos que recabamos</h2>
      <ul className="list-disc pl-6">
        <li>Nombre completo</li>
        <li>Teléfono (WhatsApp)</li>
        <li>Ciudad</li>
        <li>Comentarios opcionales</li>
        <li>Información técnica del navegador (IP, user agent)</li>
      </ul>

      <h2 className="mt-8 text-xl font-semibold">Finalidades</h2>
      <p>
        Tus datos se usan únicamente para que un ejecutivo SAI te contacte por
        WhatsApp con información del producto que solicitaste y, en su caso,
        completar el proceso de financiamiento.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Derechos ARCO</h2>
      <p>
        Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al uso de tus
        datos. Para ejercerlos, comunícate a tu sucursal SAI más cercana.
      </p>

      <p className="mt-12 text-sm text-muted-foreground italic">
        Este documento es un texto base. SAI debe revisarlo y completarlo con
        domicilio fiscal, RFC y la información legal definitiva antes de
        publicarlo en producción.
      </p>
    </article>
  );
}

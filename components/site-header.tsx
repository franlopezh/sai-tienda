import { getCategorias } from "@/lib/queries";
import { SiteHeaderClient } from "@/components/site-header-client";

type Props = {
  /**
   * Si true, el header flota encima del contenido (position fixed,
   * fondo transparente cuando estás arriba, sólido cuando scrolleas).
   * Pensado para la home donde el hero carousel se ve por debajo.
   */
  overlay?: boolean;
};

export async function SiteHeader({ overlay = false }: Props) {
  const categorias = await getCategorias();
  // Pasamos solo los campos necesarios al cliente (evita enviar más data del lado del browser)
  const categoriasMin = categorias.map((c) => ({
    id: c.id,
    slug: c.slug,
    nombre: c.nombre,
  }));
  return <SiteHeaderClient categorias={categoriasMin} overlay={overlay} />;
}

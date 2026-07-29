export type Categoria = {
  id: string;
  nombre: string;
  slug: string;
  icono?: string | null;
  orden?: number | null;
  activa?: boolean;
};

export type Producto = {
  id: string;
  slug: string;
  nombre: string;
  descripcion?: string | null;
  categoria_id: string;
  precio_contado: number;
  precio_credito: number;
  imagen_url?: string | null;
  imagenes?: string[] | null;
  marca?: string | null;
  modelo?: string | null;
  ficha_tecnica_url?: string | null;
  /** Colores disponibles derivados del inventario (unidades en stock).
   * Se mantienen en `productos.colores_disponibles` via trigger en la BD. */
  colores_disponibles?: string[] | null;
  stock?: number | null;
  /** Unidades en stock (inventario). Mantenido por trigger en la BD. */
  disponibles?: number | null;
  /** Agotado calculado en la BD por categoria: celulares/tecnologia se agotan
   * cuando no hay unidades; motos/llantas nunca (se consulta al proveedor).
   * Incluye tambien los productos inactivos. */
  agotado?: boolean | null;
  /** Marcado desde el admin para aparecer en el carrusel del hero (home).
   * Vive en la tabla base `productos` (no en la vista productos_publicos). */
  destacado?: boolean | null;
  activo?: boolean;
  pago_semanal?: number;
  pago_diario?: number;
  enganche?: number;
  created_at?: string;
};

export type EjecutivoPublico = {
  id: string;
  email?: string | null;
  nombre?: string | null;
  telefono_whatsapp: string;
  gerencia?: string | null;
  ciudad?: string | null;
  activo: boolean;
  prioridad?: number | null;
};

export type SolicitudCompra = {
  id?: string;
  producto_id: string;
  nombre_cliente: string;
  telefono: string;
  email?: string | null;
  curp?: string | null;
  ciudad?: string | null;
  comentarios?: string | null;
  fuente?: string;
  estatus?: "nuevo" | "en_contacto" | "cerrado_venta" | "descartado";
  ejecutivo_asignado?: string | null;
  gerencia_asignada?: string | null;
  user_agent?: string | null;
  ip_address?: string | null;
  fecha_creacion?: string;
  fecha_contacto?: string | null;
  fecha_cierre?: string | null;
};

export type PlazoOpcion = {
  semanas: number;
  pago_semanal: number;
};

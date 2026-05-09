import { supabase } from "./supabase";
import type { Categoria, Producto, EjecutivoPublico } from "./types";

export async function getCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from("categorias_productos")
    .select("id, nombre, slug, icono, orden, activo")
    .eq("activo", true)
    .order("orden", { ascending: true })
    .order("nombre", { ascending: true });

  if (error) {
    console.error("getCategorias error:", error);
    return [];
  }
  return (data ?? []) as Categoria[];
}

export type CategoriaConPreview = Categoria & {
  total_productos: number;
  preview_imagen: string | null;
};

export async function getCategoriasConPreview(): Promise<CategoriaConPreview[]> {
  const categorias = await getCategorias();

  const enriched = await Promise.all(
    categorias.map(async (c) => {
      const { count } = await supabase
        .from("productos")
        .select("id", { count: "exact", head: true })
        .eq("categoria_id", c.id)
        .eq("activo", true);

      const { data: preview } = await supabase
        .from("productos")
        .select("imagen_url")
        .eq("categoria_id", c.id)
        .eq("activo", true)
        .not("imagen_url", "is", null)
        .limit(1)
        .maybeSingle();

      return {
        ...c,
        total_productos: count ?? 0,
        preview_imagen: (preview as { imagen_url: string | null } | null)
          ?.imagen_url ?? null,
      };
    })
  );

  return enriched;
}

export async function getCategoriaBySlug(
  slug: string
): Promise<Categoria | null> {
  const { data, error } = await supabase
    .from("categorias_productos")
    .select("id, nombre, slug, icono, orden, activo")
    .eq("slug", slug)
    .eq("activo", true)
    .maybeSingle();

  if (error) {
    console.error("getCategoriaBySlug error:", error);
    return null;
  }
  return data as Categoria | null;
}

export async function getProductosDestacados(
  limit = 4
): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select(
      "id, nombre, slug, descripcion, categoria_id, precio_contado, precio_credito, imagen_url, imagenes, marca, modelo, ficha_tecnica_url, stock, activo, pago_semanal, pago_diario, enganche, created_at"
    )
    .eq("activo", true)
    .limit(limit);

  if (error) {
    console.error("getProductosDestacados error:", error);
    return [];
  }
  return (data ?? []).map(mapProducto);
}

export type OrdenProductos =
  | "nombre"
  | "credito_asc"
  | "credito_desc"
  | "semanal_asc"
  | "semanal_desc";

export type FiltrosCategoria = {
  marca?: string;
  semanalMin?: number;
  semanalMax?: number;
  orden?: OrdenProductos;
};

export async function getProductosPorCategoria(
  categoriaId: string,
  filtros: FiltrosCategoria = {}
): Promise<Producto[]> {
  let query = supabase
    .from("productos")
    .select(
      "id, nombre, slug, descripcion, categoria_id, precio_contado, precio_credito, imagen_url, imagenes, marca, modelo, ficha_tecnica_url, stock, activo, pago_semanal, pago_diario, enganche, created_at"
    )
    .eq("categoria_id", categoriaId)
    .eq("activo", true);

  if (filtros.marca) query = query.eq("marca", filtros.marca);

  switch (filtros.orden) {
    case "credito_asc":
      query = query.order("precio_credito", { ascending: true });
      break;
    case "credito_desc":
      query = query.order("precio_credito", { ascending: false });
      break;
    case "semanal_asc":
      query = query.order("pago_semanal", { ascending: true });
      break;
    case "semanal_desc":
      query = query.order("pago_semanal", { ascending: false });
      break;
    default:
      query = query.order("nombre", { ascending: true });
  }

  const { data, error } = await query;

  if (error) {
    console.error("getProductosPorCategoria error:", error);
    return [];
  }

  let productos = (data ?? []).map(mapProducto);

  if (filtros.semanalMin !== undefined) {
    productos = productos.filter(
      (p) => (p.pago_semanal ?? 0) >= filtros.semanalMin!
    );
  }
  if (filtros.semanalMax !== undefined) {
    productos = productos.filter(
      (p) => (p.pago_semanal ?? 0) <= filtros.semanalMax!
    );
  }

  return productos;
}

export async function getTodosLosProductos(
  filtros: FiltrosCategoria & { categoriaId?: string } = {}
): Promise<Producto[]> {
  let query = supabase
    .from("productos")
    .select(
      "id, nombre, slug, descripcion, categoria_id, precio_contado, precio_credito, imagen_url, imagenes, marca, modelo, ficha_tecnica_url, stock, activo, pago_semanal, pago_diario, enganche, created_at"
    )
    .eq("activo", true);

  if (filtros.categoriaId) query = query.eq("categoria_id", filtros.categoriaId);
  if (filtros.marca) query = query.eq("marca", filtros.marca);

  switch (filtros.orden) {
    case "credito_asc":
      query = query.order("precio_credito", { ascending: true });
      break;
    case "credito_desc":
      query = query.order("precio_credito", { ascending: false });
      break;
    case "semanal_asc":
      query = query.order("pago_semanal", { ascending: true });
      break;
    case "semanal_desc":
      query = query.order("pago_semanal", { ascending: false });
      break;
    default:
      query = query.order("nombre", { ascending: true });
  }

  const { data, error } = await query;
  if (error) {
    console.error("getTodosLosProductos error:", error);
    return [];
  }

  let productos = (data ?? []).map(mapProducto);
  if (filtros.semanalMin !== undefined) {
    productos = productos.filter((p) => (p.pago_semanal ?? 0) >= filtros.semanalMin!);
  }
  if (filtros.semanalMax !== undefined) {
    productos = productos.filter((p) => (p.pago_semanal ?? 0) <= filtros.semanalMax!);
  }
  return productos;
}

export async function getMarcasPorCategoria(
  categoriaId: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from("productos")
    .select("marca")
    .eq("categoria_id", categoriaId)
    .eq("activo", true);
  if (error) return [];
  const set = new Set<string>();
  (data ?? []).forEach((r: { marca: string | null }) => {
    if (r.marca) set.add(r.marca.trim());
  });
  return Array.from(set).sort();
}

export async function getCategoriaById(id: string): Promise<Categoria | null> {
  const { data, error } = await supabase
    .from("categorias_productos")
    .select("id, nombre, slug, icono, orden, activo")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("getCategoriaById error:", error);
    return null;
  }
  return (data as Categoria) ?? null;
}

export async function getProductosRelacionados(
  categoriaId: string,
  excluirId: string,
  limit = 4
): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select(
      "id, nombre, slug, descripcion, categoria_id, precio_contado, precio_credito, imagen_url, imagenes, marca, modelo, ficha_tecnica_url, stock, activo, pago_semanal, pago_diario, enganche, created_at"
    )
    .eq("categoria_id", categoriaId)
    .eq("activo", true)
    .neq("id", excluirId)
    .not("imagen_url", "is", null)
    .limit(limit);

  if (error) {
    console.error("getProductosRelacionados error:", error);
    return [];
  }
  return (data ?? []).map(mapProducto);
}

export async function buscarProductos(termino: string): Promise<Producto[]> {
  const t = termino.trim();
  if (!t) return [];
  const ilike = `%${t}%`;
  const { data, error } = await supabase
    .from("productos")
    .select(
      "id, nombre, slug, descripcion, categoria_id, precio_contado, precio_credito, imagen_url, imagenes, marca, modelo, ficha_tecnica_url, stock, activo, pago_semanal, pago_diario, enganche, created_at"
    )
    .eq("activo", true)
    .or(
      `nombre.ilike.${ilike},marca.ilike.${ilike},modelo.ilike.${ilike}`
    )
    .order("nombre", { ascending: true })
    .limit(60);

  if (error) {
    console.error("buscarProductos error:", error);
    return [];
  }
  return (data ?? []).map(mapProducto);
}

export async function getProductoBySlug(
  slug: string
): Promise<Producto | null> {
  const { data, error } = await supabase
    .from("productos")
    .select(
      "id, nombre, slug, descripcion, categoria_id, precio_contado, precio_credito, imagen_url, imagenes, marca, modelo, ficha_tecnica_url, stock, activo, pago_semanal, pago_diario, enganche, created_at"
    )
    .eq("slug", slug)
    .eq("activo", true)
    .maybeSingle();

  if (error) {
    console.error("getProductoBySlug error:", error);
    return null;
  }
  return data ? mapProducto(data) : null;
}

export async function getEjecutivoParaCiudad(
  ciudad: string | null
): Promise<EjecutivoPublico | null> {
  let query = supabase
    .from("ejecutivos_publicos")
    .select("id, nombre, telefono_whatsapp, gerencia, ciudad, activo, prioridad, email")
    .eq("activo", true);

  if (ciudad) query = query.eq("ciudad", ciudad);

  const { data, error } = await query
    .order("prioridad", { ascending: true })
    .limit(1);

  if (error) {
    console.error("getEjecutivoParaCiudad error:", error);
    return null;
  }

  if (data && data.length > 0) return data[0] as EjecutivoPublico;

  if (ciudad) {
    const { data: fallback } = await supabase
      .from("ejecutivos_publicos")
      .select(
        "id, nombre, telefono_whatsapp, gerencia, ciudad, activo, prioridad, email"
      )
      .eq("activo", true)
      .order("prioridad", { ascending: true })
      .limit(1);
    return (fallback?.[0] as EjecutivoPublico) ?? null;
  }
  return null;
}

function mapProducto(row: Record<string, unknown>): Producto {
  return {
    id: row.id as string,
    nombre: row.nombre as string,
    slug: (row.slug as string) ?? "",
    descripcion: (row.descripcion as string) ?? null,
    categoria_id: row.categoria_id as string,
    precio_contado: parseNum(row.precio_contado),
    precio_credito: parseNum(row.precio_credito),
    imagen_url: (row.imagen_url as string) ?? null,
    imagenes: (row.imagenes as string[]) ?? null,
    marca: (row.marca as string) ?? null,
    modelo: (row.modelo as string) ?? null,
    ficha_tecnica_url: (row.ficha_tecnica_url as string) ?? null,
    stock: typeof row.stock === "number" ? row.stock : null,
    activo: row.activo as boolean,
    pago_semanal: parseNum(row.pago_semanal),
    pago_diario: parseNum(row.pago_diario),
    enganche: parseNum(row.enganche),
    created_at: (row.created_at as string) ?? undefined,
  };
}

function parseNum(v: unknown): number {
  if (v === null || v === undefined || v === "") return 0;
  const n = typeof v === "string" ? parseFloat(v) : (v as number);
  return isNaN(n) ? 0 : n;
}

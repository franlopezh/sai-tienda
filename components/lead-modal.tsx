"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { formatMXN, buildWhatsAppLink } from "@/lib/format";
import type { Producto } from "@/lib/types";

const CIUDADES = [
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
  "Otra",
];

type Props = {
  producto: Producto;
  pagoSemanal: number;
  semanas: number;
  compact?: boolean;
};

export function LeadModal({
  producto,
  pagoSemanal,
  semanas,
  compact = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [acepto, setAcepto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function reset() {
    setNombre("");
    setTelefono("");
    setCiudad("");
    setComentarios("");
    setAcepto(false);
    setError(null);
  }

  async function submit() {
    setError(null);

    if (!nombre.trim()) return setError("Captura tu nombre completo.");
    const tel = telefono.replace(/\D/g, "");
    if (tel.length < 10) return setError("Teléfono inválido (10 dígitos).");
    if (!ciudad) return setError("Selecciona tu ciudad.");
    if (!acepto)
      return setError("Necesitamos tu autorización para contactarte.");

    startTransition(async () => {
      // 1) Pick ejecutivo PRIMERO para registrarlo en el INSERT.
      const { data: ejecutivos } = await supabase
        .from("ejecutivos_publicos")
        .select("id, telefono_whatsapp, nombre, ciudad, gerencia, prioridad")
        .eq("activo", true)
        .order("prioridad", { ascending: true });

      // Round-robin: random pick entre los activos para esa ciudad.
      // Fallback a globales (ciudad NULL) si no hay específicos.
      const candidatos = ejecutivos ?? [];
      const porCiudad = candidatos.filter((e) => e.ciudad === ciudad);
      const globales = candidatos.filter((e) => !e.ciudad);
      const pool =
        porCiudad.length > 0
          ? porCiudad
          : globales.length > 0
            ? globales
            : candidatos;
      const ejecutivoCiudad =
        pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : null;

      // 2) INSERT solicitud incluyendo el ejecutivo asignado.
      const { data: solicitud, error: insertError } = await supabase
        .from("solicitudes_compra")
        .insert({
          producto_id: producto.id,
          nombre_cliente: nombre.trim(),
          telefono: tel,
          ciudad,
          comentarios: comentarios.trim() || null,
          fuente: "catalogo_web",
          estatus: "nuevo",
          ejecutivo_asignado: ejecutivoCiudad?.nombre ?? null,
          gerencia_asignada: ejecutivoCiudad?.gerencia ?? null,
          user_agent:
            typeof navigator !== "undefined" ? navigator.userAgent : null,
        })
        .select("id")
        .single();

      if (insertError || !solicitud) {
        console.error(insertError);
        setError(
          "No pudimos guardar tu solicitud. Intenta de nuevo en un momento."
        );
        return;
      }

      if (!ejecutivoCiudad?.telefono_whatsapp) {
        window.location.href = `/solicitud/${solicitud.id}`;
        return;
      }

      const folio = `SAI-${solicitud.id.slice(0, 8).toUpperCase()}`;
      const mensaje = [
        `Hola, soy ${nombre.trim()}.`,
        `Estoy interesado en financiar:`,
        `• Producto: ${producto.nombre}${producto.marca ? ` (${producto.marca})` : ""}`,
        `• Pago: ${formatMXN(pagoSemanal)} a ${semanas} semanas`,
        `• Mi ciudad: ${ciudad}`,
        comentarios.trim() ? `• Comentarios: ${comentarios.trim()}` : null,
        `• Folio: ${folio}`,
      ]
        .filter(Boolean)
        .join("\n");

      const link = buildWhatsAppLink(
        ejecutivoCiudad.telefono_whatsapp,
        mensaje
      );

      window.location.href = `/solicitud/${solicitud.id}?wa=${encodeURIComponent(link)}`;
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger
        render={
          <Button
            size="lg"
            className={compact ? "" : "w-full"}
          />
        }
      >
        {compact ? "💬 Financiar" : "💬 Quiero financiarlo"}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3 dark:bg-zinc-900/40">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-card">
              {producto.imagen_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  className="h-full w-full object-contain p-1"
                />
              ) : (
                <span className="text-2xl">📦</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              {producto.marca && (
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {producto.marca.trim()}
                  {producto.modelo ? ` · ${producto.modelo}` : ""}
                </p>
              )}
              <DialogTitle className="truncate">{producto.nombre}</DialogTitle>
              <p className="text-xs text-muted-foreground">
                {formatMXN(pagoSemanal)} / semana · {semanas} semanas
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Estás solicitando información para este producto. Un ejecutivo te
            contactará por WhatsApp.
          </p>
        </DialogHeader>

        <div className="grid gap-4 pt-2">
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre completo *</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="telefono">Teléfono (WhatsApp) *</Label>
            <Input
              id="telefono"
              type="tel"
              placeholder="55 1234 5678"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              autoComplete="tel"
            />
          </div>

          <div className="grid gap-2">
            <Label>Ciudad *</Label>
            <Select
              value={ciudad}
              onValueChange={(v) => setCiudad(v ?? "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona..." />
              </SelectTrigger>
              <SelectContent>
                {CIUDADES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="comentarios">Comentarios (opcional)</Label>
            <Textarea
              id="comentarios"
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              rows={3}
            />
          </div>

          <label className="flex items-start gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="mt-1"
              checked={acepto}
              onChange={(e) => setAcepto(e.target.checked)}
            />
            <span>Acepto ser contactado por WhatsApp por un ejecutivo SAI.</span>
          </label>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="pt-4">
          <Button onClick={submit} disabled={pending} className="w-full">
            {pending ? "Enviando..." : "💬 Contactar a un ejecutivo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

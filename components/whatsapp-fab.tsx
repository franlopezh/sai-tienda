import { MessageCircle } from "lucide-react";

const WA_GENERAL = "5215584679251";
const MENSAJE = "Hola, me interesa información sobre SAI Préstamos.";

export function WhatsAppFab() {
  const href = `https://wa.me/${WA_GENERAL}?text=${encodeURIComponent(MENSAJE)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition hover:scale-105 hover:bg-emerald-600 md:bottom-8 md:right-8 md:h-16 md:w-16"
    >
      <MessageCircle className="h-7 w-7 md:h-8 md:w-8" strokeWidth={2.2} />
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
      </span>
    </a>
  );
}

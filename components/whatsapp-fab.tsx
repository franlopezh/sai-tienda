"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  WA_NUMEROS_GENERAL,
  WA_MENSAJE_GENERAL,
  buildWhatsAppLink,
} from "@/lib/format";

export function WhatsAppFab() {
  const [numero, setNumero] = useState(WA_NUMEROS_GENERAL[0]);

  // Random pick post-mount para evitar hydration mismatch.
  useEffect(() => {
    setNumero(
      WA_NUMEROS_GENERAL[
        Math.floor(Math.random() * WA_NUMEROS_GENERAL.length)
      ]
    );
  }, []);

  return (
    <a
      href={buildWhatsAppLink(numero, WA_MENSAJE_GENERAL)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-24 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:scale-105 hover:bg-emerald-600 active:scale-95 active:duration-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500 md:bottom-8 md:right-8 md:h-16 md:w-16"
    >
      <MessageCircle className="h-6 w-6 md:h-8 md:w-8" strokeWidth={2.2} />
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
      </span>
    </a>
  );
}

"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  WA_NUMEROS_GENERAL,
  WA_MENSAJE_GENERAL,
  buildWhatsAppLink,
} from "@/lib/format";

type Props = {
  children: ReactNode;
  mensaje?: string;
  className?: string;
  ariaLabel?: string;
};

export function WhatsAppLink({
  children,
  mensaje = WA_MENSAJE_GENERAL,
  className,
  ariaLabel,
}: Props) {
  const [numero, setNumero] = useState(WA_NUMEROS_GENERAL[0]);

  useEffect(() => {
    setNumero(
      WA_NUMEROS_GENERAL[
        Math.floor(Math.random() * WA_NUMEROS_GENERAL.length)
      ]
    );
  }, []);

  return (
    <a
      href={buildWhatsAppLink(numero, mensaje)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}

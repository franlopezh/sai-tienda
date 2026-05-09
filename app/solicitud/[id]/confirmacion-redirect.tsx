"use client";

import { useEffect } from "react";

export function ConfirmacionRedirect({ waUrl }: { waUrl: string }) {
  useEffect(() => {
    const t = setTimeout(() => {
      window.location.href = waUrl;
    }, 1500);
    return () => clearTimeout(t);
  }, [waUrl]);
  return null;
}

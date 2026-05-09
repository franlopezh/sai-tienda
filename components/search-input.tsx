"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";

export function SearchInput() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/buscar?q=${encodeURIComponent(term)}`);
  }

  return (
    <form onSubmit={onSubmit} className="hidden md:flex flex-1 max-w-sm mx-6">
      <Input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar moto, modelo..."
        className="h-9"
      />
    </form>
  );
}

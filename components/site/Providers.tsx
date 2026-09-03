"use client";

import { useEffect, useMemo, useState } from "react";
import type { Currency } from "@/lib/types";
import { CurrencyContext } from "@/lib/currency-context";

export function Providers({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");

  useEffect(() => {
    const saved = localStorage.getItem("sahani.currency");
    if (saved === "KES" || saved === "USD") setCurrencyState(saved);
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("sahani.currency", c);
  };

  const value = useMemo(() => ({ currency, setCurrency }), [currency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

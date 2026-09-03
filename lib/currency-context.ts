"use client";

import { createContext, useContext } from "react";
import type { Currency } from "./types";

export const CurrencyContext = createContext<{
  currency: Currency;
  setCurrency: (c: Currency) => void;
}>({
  currency: "USD",
  setCurrency: () => {},
});

export function useCurrency() {
  return useContext(CurrencyContext);
}

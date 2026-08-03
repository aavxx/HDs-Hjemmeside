// Delt tilstand for demoportalen.
//
// Alt ligger i hukommelsen (+ sessionStorage, så et genindlæs ikke nulstiller
// fremvisningen). Ingen netværkskald, ingen database – se src/demo/data.ts.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Inquiry, Order, OrderStatus } from "./data";
import { seedInquiries, seedOrders } from "./data";

const STORAGE_KEY = "demo-portal-state-v1";

interface DemoState {
  inquiries: Inquiry[];
  orders: Order[];
}

interface DemoStore extends DemoState {
  markRead: (id: string, laest?: boolean) => void;
  setTrashed: (id: string, papirkurv: boolean) => void;
  /** Laver en henvendelse om til en ordre og knytter de to sammen. */
  convertToOrder: (id: string) => Order | null;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  reset: () => void;
}

const DemoContext = createContext<DemoStore | null>(null);

function loadState(): DemoState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as DemoState;
  } catch {
    // Ugyldig eller utilgængelig sessionStorage – start forfra.
  }
  return { inquiries: seedInquiries, orders: seedOrders };
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(loadState);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Privat browsertilstand kan afvise skrivning. Demoen kører videre.
    }
  }, [state]);

  const markRead = useCallback((id: string, laest = true) => {
    setState((s) => ({
      ...s,
      inquiries: s.inquiries.map((i) => (i.id === id ? { ...i, laest } : i)),
    }));
  }, []);

  const setTrashed = useCallback((id: string, papirkurv: boolean) => {
    setState((s) => ({
      ...s,
      inquiries: s.inquiries.map((i) => (i.id === id ? { ...i, papirkurv } : i)),
    }));
  }, []);

  const convertToOrder = useCallback((id: string) => {
    let created: Order | null = null;
    setState((s) => {
      const inquiry = s.inquiries.find((i) => i.id === id);
      if (!inquiry || inquiry.ordreId) return s;

      const order: Order = {
        id: `ord-${Date.now()}`,
        kunde: inquiry.navn,
        email: inquiry.email,
        beskrivelse: inquiry.emne,
        status: "Afventer",
        beloeb: 0,
        oprettet: new Date().toISOString(),
        noter: `Oprettet fra henvendelse modtaget ${new Date(inquiry.modtaget).toLocaleDateString("da-DK")}.`,
      };
      created = order;

      return {
        inquiries: s.inquiries.map((i) => (i.id === id ? { ...i, ordreId: order.id, laest: true } : i)),
        orders: [order, ...s.orders],
      };
    });
    return created;
  }, []);

  const setOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    }));
  }, []);

  const reset = useCallback(() => {
    setState({ inquiries: seedInquiries, orders: seedOrders });
  }, []);

  const value = useMemo(
    () => ({ ...state, markRead, setTrashed, convertToOrder, setOrderStatus, reset }),
    [state, markRead, setTrashed, convertToOrder, setOrderStatus, reset],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoStore {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo skal bruges inde i en DemoProvider");
  return ctx;
}

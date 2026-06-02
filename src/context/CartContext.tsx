import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";

export type CartItem = { product: Product; quantity: number };

export type CartView = "cart" | "checkout" | "success";

export type TimelineStep = {
  agent: string;
  decision_note: string;
  timestamp: string;
  status?: string;
  handoff?: string | null;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  view: CartView;
  count: number;
  total: number;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setView: (v: CartView) => void;
  openCheckout: () => void;
  add: (product: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
  swarmActive: boolean;
  startSwarm: () => Promise<void>;
  stopSwarm: () => void;
  timeline: TimelineStep[] | null;
  swarmError: string | null;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<CartView>("cart");
  const [swarmActive, setSwarmActive] = useState(false);
  const [timeline, setTimeline] = useState<TimelineStep[] | null>(null);
  const [swarmError, setSwarmError] = useState<string | null>(null);

  const add = useCallback((product: Product) => {
    setItems((prev) => {
      const found = prev.find((i) => i.product.id === product.id);
      if (found) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const total = items.reduce((s, i) => s + i.quantity * i.product.price, 0);
    const startSwarm = async () => {
      setSwarmError(null);
      setTimeline(null);
      setSwarmActive(true);
      try {
        const userPreferences = items.length
          ? items
              .map(
                (i) =>
                  `${i.quantity}× ${i.product.name} ($${i.product.price.toLocaleString()})`,
              )
              .join(", ")
          : "Browsing — no cart items yet";
        const res = await fetch(
          "https://n8n19821929.app.n8n.cloud/webhook-test/aether-order",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userPreferences }),
          },
        );
        if (!res.ok) throw new Error(`Webhook ${res.status}`);
        const raw = await res.json();
        const arr: TimelineStep[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.timeline)
            ? raw.timeline
            : Array.isArray(raw?.steps)
              ? raw.steps
              : [];
        setTimeline(arr);
      } catch (e) {
        setSwarmError(e instanceof Error ? e.message : "Agent swarm unreachable");
        setTimeline([]);
      }
    };
    return {
      items,
      isOpen,
      view,
      count,
      total,
      open: () => setIsOpen(true),
      close: () => {
        setIsOpen(false);
        setTimeout(() => setView("cart"), 300);
      },
      toggle: () => setIsOpen((v) => !v),
      setView,
      openCheckout: () => {
        setView("checkout");
        setIsOpen(true);
      },
      add,
      remove,
      clear,
      swarmActive,
      startSwarm,
      stopSwarm: () => setSwarmActive(false),
      timeline,
      swarmError,
    };
  }, [items, isOpen, view, swarmActive, timeline, swarmError, add, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
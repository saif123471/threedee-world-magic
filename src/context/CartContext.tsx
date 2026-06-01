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
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<CartView>("cart");

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
    };
  }, [items, isOpen, view, add, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
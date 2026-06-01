import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartDrawer() {
  const { isOpen, close, items, total, remove } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-background/70 backdrop-blur-md"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md bg-card border-l border-border flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-14 border-b border-border">
              <h3 className="text-xs tracking-[0.3em] uppercase text-foreground font-light">
                Your Bag
              </h3>
              <button onClick={close} aria-label="Close" className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" strokeWidth={1.2} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <p className="text-sm font-light text-muted-foreground text-center mt-20">
                  Your bag is empty.
                </p>
              ) : (
                <ul className="space-y-6">
                  {items.map((it) => (
                    <li key={it.product.id} className="flex gap-4">
                      <img
                        src={it.product.image}
                        alt={it.product.name}
                        className="h-20 w-20 rounded-xl object-cover bg-background"
                      />
                      <div className="flex-1 flex flex-col">
                        <span className="text-sm font-light text-foreground">{it.product.name}</span>
                        <span className="text-xs text-muted-foreground mt-1">Qty {it.quantity}</span>
                        <span className="text-sm font-light text-foreground mt-auto">
                          ${(it.product.price * it.quantity).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => remove(it.product.id)}
                        className="text-muted-foreground hover:text-foreground self-start"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.2} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border-t border-border px-6 py-6 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Total</span>
                <span className="text-xl font-thin text-foreground">${total.toLocaleString()}</span>
              </div>
              <button
                disabled={items.length === 0}
                className="w-full rounded-full bg-foreground text-background py-3 text-xs tracking-[0.2em] uppercase font-medium disabled:opacity-30 transition-opacity"
              >
                Check Out
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
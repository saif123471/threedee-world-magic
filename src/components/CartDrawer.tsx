import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Trash2, ChevronLeft, CreditCard, Bitcoin, Check, Apple } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function CartDrawer() {
  const { isOpen, close, items, total, remove, view, setView, clear, openCheckout } = useCart();

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
              <div className="flex items-center gap-3">
                {view === "checkout" && (
                  <button
                    onClick={() => setView("cart")}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Back"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={1.2} />
                  </button>
                )}
                <h3 className="text-xs tracking-[0.3em] uppercase text-foreground font-light">
                  {view === "cart" ? "Your Bag" : view === "checkout" ? "Checkout" : "Confirmed"}
                </h3>
              </div>
              <button onClick={close} aria-label="Close" className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" strokeWidth={1.2} />
              </button>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {view === "cart" && (
                <motion.div
                  key="cart"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
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
                      onClick={openCheckout}
                      className="w-full rounded-full bg-foreground text-background py-3 text-xs tracking-[0.2em] uppercase font-medium disabled:opacity-30 transition-opacity"
                    >
                      Check Out
                    </button>
                  </div>
                </motion.div>
              )}

              {view === "checkout" && (
                <motion.div
                  key="checkout"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  className="flex-1 flex flex-col overflow-hidden"
                >
                  <CheckoutForm
                    total={total}
                    onSuccess={() => {
                      setView("success");
                      setTimeout(() => {
                        clear();
                      }, 2400);
                    }}
                  />
                </motion.div>
              )}

              {view === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6"
                >
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 240, damping: 18 }}
                    className="h-16 w-16 rounded-full border border-foreground/50 flex items-center justify-center"
                    style={{ boxShadow: "0 0 40px var(--neon-cyan)" }}
                  >
                    <Check className="h-7 w-7" strokeWidth={1.2} />
                  </motion.div>
                  <h4 className="text-2xl font-thin text-foreground">Payment received</h4>
                  <p className="text-sm font-light text-muted-foreground max-w-xs">
                    Your order is confirmed. A receipt is on its way to your inbox.
                  </p>
                  <button
                    onClick={close}
                    className="mt-2 rounded-full border border-border px-6 py-2.5 text-xs tracking-[0.2em] uppercase font-light text-muted-foreground hover:text-foreground"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

type Method = "card" | "crypto" | "apple";

function CheckoutForm({ total, onSuccess }: { total: number; onSuccess: () => void }) {
  const [method, setMethod] = useState<Method>("card");
  const [processing, setProcessing] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(onSuccess, 1400);
  };

  const methods: { id: Method; label: string; icon: typeof CreditCard }[] = [
    { id: "card", label: "Card", icon: CreditCard },
    { id: "apple", label: "Apple Pay", icon: Apple },
    { id: "crypto", label: "Crypto", icon: Bitcoin },
  ];

  return (
    <form onSubmit={submit} className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
            Payment method
          </p>
          <div className="grid grid-cols-3 gap-2">
            {methods.map((m) => {
              const Icon = m.icon;
              const active = method === m.id;
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border py-4 transition-all ${
                    active
                      ? "border-foreground/60 bg-foreground/5 text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.2} />
                  <span className="text-[10px] tracking-[0.2em] uppercase font-light">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={method}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {method === "card" && (
              <>
                <Field label="Cardholder name" placeholder="Jane Appleseed" required />
                <Field label="Card number" placeholder="4242 4242 4242 4242" inputMode="numeric" required />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Expiry" placeholder="MM / YY" required />
                  <Field label="CVC" placeholder="•••" inputMode="numeric" required />
                </div>
                <Field label="ZIP / Postal" placeholder="94016" required />
              </>
            )}

            {method === "apple" && (
              <div className="rounded-2xl border border-border p-6 text-center space-y-3">
                <Apple className="h-6 w-6 mx-auto" strokeWidth={1.2} />
                <p className="text-sm font-light text-foreground">Confirm with Apple Pay</p>
                <p className="text-xs font-light text-muted-foreground">
                  Double-click the side button on your device to complete payment.
                </p>
              </div>
            )}

            {method === "crypto" && (
              <>
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Asset</p>
                  <div className="grid grid-cols-3 gap-2">
                    {["BTC", "ETH", "USDC"].map((c) => (
                      <button
                        type="button"
                        key={c}
                        className="rounded-xl border border-border py-2 text-xs tracking-[0.2em] uppercase font-light text-muted-foreground hover:text-foreground hover:border-foreground/60"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <Field label="Wallet address" placeholder="0x… or bc1…" required />
                <div className="rounded-2xl border border-border p-4 text-xs font-light text-muted-foreground">
                  Network fees calculated at confirmation. Funds settle in ~2 blocks.
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <Field label="Email for receipt" placeholder="you@aether.com" type="email" required />
      </div>

      <div className="border-t border-border px-6 py-6 space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Pay</span>
          <span className="text-xl font-thin text-foreground">${total.toLocaleString()}</span>
        </div>
        <button
          type="submit"
          disabled={processing}
          className="w-full rounded-full bg-foreground text-background py-3 text-xs tracking-[0.2em] uppercase font-medium disabled:opacity-50 transition-opacity"
        >
          {processing ? "Processing…" : `Pay $${total.toLocaleString()}`}
        </button>
        <p className="text-[10px] text-center font-light text-muted-foreground tracking-wide">
          Secured by Aether. Encrypted end-to-end.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
        {label}
      </span>
      <input
        {...props}
        className="w-full bg-transparent border-b border-border focus:border-foreground/60 outline-none py-2 text-sm font-light text-foreground placeholder:text-muted-foreground/50 transition-colors"
      />
    </label>
  );
}
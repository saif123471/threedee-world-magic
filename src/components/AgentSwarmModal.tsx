import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Package, ShieldCheck, Check } from "lucide-react";

type Props = { open: boolean; onClose: () => void; onConfirm: () => void };

const agents = [
  { name: "Personalization", icon: Sparkles, color: "var(--neon-violet)", task: "Tailoring your experience" },
  { name: "Inventory Check", icon: Package, color: "var(--neon-cyan)", task: "Reserving your unit" },
  { name: "Fraud & Security", icon: ShieldCheck, color: "var(--neon-orange)", task: "Verifying transaction" },
];

export function AgentSwarmModal({ open, onClose, onConfirm }: Props) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) {
      setStep(0);
      setDone(false);
      return;
    }
    setStep(0);
    setDone(false);
    const t1 = setTimeout(() => setStep(1), 1300);
    const t2 = setTimeout(() => setStep(2), 2600);
    const t3 = setTimeout(() => setStep(3), 3900);
    const t4 = setTimeout(() => setDone(true), 4500);
    const t5 = setTimeout(() => onConfirm(), 5600);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center px-6 bg-background/80 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-10"
          >
            <div className="text-center mb-10">
              <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-3">
                Agent Swarm
              </p>
              <h3 className="text-2xl font-thin text-foreground">
                {done ? "Order Confirmed" : "Coordinating your purchase"}
              </h3>
            </div>

            <ol className="space-y-5">
              {agents.map((a, i) => {
                const state =
                  done || step > i ? "done" : step === i ? "active" : "idle";
                const Icon = a.icon;
                return (
                  <li key={a.name} className="relative flex items-center gap-4">
                    <div
                      className={`relative h-11 w-11 rounded-full border flex items-center justify-center transition-all ${
                        state === "idle"
                          ? "border-border text-muted-foreground"
                          : "border-foreground/50 text-foreground"
                      }`}
                      style={{
                        boxShadow:
                          state === "active"
                            ? `0 0 30px ${a.color}, inset 0 0 12px ${a.color}40`
                            : state === "done"
                            ? `0 0 14px ${a.color}80`
                            : undefined,
                      }}
                    >
                      {state === "done" ? (
                        <Check className="h-4 w-4" strokeWidth={1.5} />
                      ) : (
                        <Icon
                          className={`h-4 w-4 ${state === "active" ? "pulse-ring" : ""}`}
                          strokeWidth={1.2}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-light text-foreground">
                        Agent {i + 1} — {a.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{a.task}</p>
                    </div>
                    {state === "active" && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] tracking-[0.2em] uppercase"
                        style={{ color: a.color }}
                      >
                        Working
                      </motion.span>
                    )}
                    {state === "done" && (
                      <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                        Done
                      </span>
                    )}
                    {i < agents.length - 1 && (
                      <span
                        className="absolute left-[21px] top-11 h-5 w-px"
                        style={{
                          background:
                            step > i
                              ? `linear-gradient(to bottom, ${a.color}, transparent)`
                              : "var(--color-border)",
                        }}
                      />
                    )}
                  </li>
                );
              })}
            </ol>

            <div className="mt-10 flex justify-end gap-3">
              {done ? (
                <button
                  onClick={onConfirm}
                  className="rounded-full bg-foreground text-background px-6 py-2.5 text-xs tracking-[0.2em] uppercase font-medium"
                >
                  Done
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="rounded-full border border-border text-muted-foreground px-6 py-2.5 text-xs tracking-[0.2em] uppercase font-light hover:text-foreground"
                >
                  Cancel
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
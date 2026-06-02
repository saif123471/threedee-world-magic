import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Package, ShieldCheck, ArrowRight, Check, Loader2, AlertTriangle } from "lucide-react";
import { useCart } from "@/context/CartContext";

type Status = "idle" | "reviewing" | "completed" | "rejected";

type AgentStep = {
  id: string;
  name: string;
  role: string;
  icon: typeof Sparkles;
  color: string;
  note: string;
  handoff: string | null;
};

const AGENTS: AgentStep[] = [
  {
    id: "sales",
    name: "Sales & Personalization Agent",
    role: "Tailoring offer to customer profile",
    icon: Sparkles,
    color: "var(--neon-violet)",
    note: "Validated cart against customer history. Applied loyalty tier pricing and curated bundle suggestions.",
    handoff: "Inventory Manager Agent",
  },
  {
    id: "inventory",
    name: "Inventory Manager Agent",
    role: "Reserving units across global warehouses",
    icon: Package,
    color: "var(--neon-cyan)",
    note: "Locked stock in Zurich DC-04. ETA verified with logistics; reservation valid for 12 minutes.",
    handoff: "Security & Fraud Agent",
  },
  {
    id: "security",
    name: "Security & Fraud Agent",
    role: "Final risk and compliance review",
    icon: ShieldCheck,
    color: "var(--neon-orange)",
    note: "Device fingerprint, geo-velocity, and payment signal cleared. Order approved for checkout.",
    handoff: null,
  },
];

const STEP_MS = 1700;

function formatTime(input?: string | Date) {
  const d = input ? new Date(input) : new Date();
  if (isNaN(d.getTime()) && typeof input === "string") return input;
  return (
    d.toLocaleTimeString([], { hour12: false }) +
    "." +
    String(d.getMilliseconds()).padStart(3, "0").slice(0, 2)
  );
}

const STATUS_STYLE: Record<Exclude<Status, "idle">, { label: string; color: string }> = {
  reviewing: { label: "Reviewing", color: "var(--neon-orange)" },
  completed: { label: "Completed", color: "var(--neon-green)" },
  rejected: { label: "Rejected", color: "var(--neon-red)" },
};

export function AgentTimeline() {
  const { swarmActive, stopSwarm, openCheckout, timeline, swarmError } = useCart();
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [statuses, setStatuses] = useState<Status[]>(AGENTS.map(() => "idle"));
  const [timestamps, setTimestamps] = useState<(string | null)[]>(AGENTS.map(() => null));
  const [notes, setNotes] = useState<(string | null)[]>(AGENTS.map(() => null));

  useEffect(() => {
    if (!swarmActive) return;

    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setStatuses(AGENTS.map(() => "idle"));
    setTimestamps(AGENTS.map(() => null));
    setNotes(AGENTS.map(() => null));
    setActiveIdx(-1);
  }, [swarmActive]);

  useEffect(() => {
    if (!swarmActive || timeline === null) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    AGENTS.forEach((_, i) => {
      const remote = timeline[i];
      timers.push(
        setTimeout(() => {
          setActiveIdx(i);
          setStatuses((s) => {
            const next = [...s];
            next[i] = "reviewing";
            return next;
          });
          setTimestamps((t) => {
            const next = [...t];
            next[i] = formatTime(remote?.timestamp);
            return next;
          });
          setNotes((n) => {
            const next = [...n];
            next[i] = remote?.decision_note ?? AGENTS[i].note;
            return next;
          });
        }, 500 + i * STEP_MS),
      );
      timers.push(
        setTimeout(() => {
          setStatuses((s) => {
            const next = [...s];
            const remoteStatus = remote?.status?.toLowerCase();
            next[i] =
              remoteStatus === "rejected"
                ? "rejected"
                : "completed";
            return next;
          });
        }, 500 + i * STEP_MS + STEP_MS - 250),
      );
    });

    timers.push(
      setTimeout(() => {
        const lastStatus = timeline[AGENTS.length - 1]?.status?.toLowerCase();
        if (lastStatus !== "rejected") openCheckout();
        stopSwarm();
      }, 500 + AGENTS.length * STEP_MS + 600),
    );

    return () => timers.forEach(clearTimeout);
  }, [swarmActive, timeline, openCheckout, stopSwarm]);

  const progress = useMemo(() => {
    const done = statuses.filter((s) => s === "completed").length;
    return done / AGENTS.length;
  }, [statuses]);

  return (
    <section
      ref={sectionRef}
      id="agents"
      className="relative px-6 py-32 md:py-40 scroll-mt-24"
    >
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-14">
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">
            Band Orchestration
          </p>
          <h2 className="text-3xl md:text-5xl font-thin tracking-tight text-foreground">
            Agent Decision Timeline
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-sm md:text-base font-light text-muted-foreground">
            Every order is reviewed by a swarm of specialized agents. Watch the
            handoff in real time — full transparency, signed at every step.
          </p>
        </div>

        <div
          className="relative rounded-3xl border border-border p-8 md:p-12"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--card) 70%, transparent), color-mix(in oklab, var(--background) 90%, transparent))",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow:
              "inset 0 1px 0 oklch(1 0 0 / 6%), 0 30px 80px -40px oklch(0 0 0 / 80%)",
          }}
        >
          {/* vertical neon track */}
          <div className="absolute left-[46px] md:left-[58px] top-12 bottom-12 w-px overflow-hidden rounded-full bg-border">
            <motion.div
              initial={{ height: "0%" }}
              animate={{ height: `${progress * 100}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full"
              style={{
                background:
                  "linear-gradient(180deg, var(--neon-violet), var(--neon-cyan), var(--neon-green))",
                boxShadow: "0 0 14px var(--neon-cyan)",
              }}
            />
          </div>

          <ol className="relative space-y-10">
            {AGENTS.map((a, i) => {
              const status = statuses[i];
              const ts = timestamps[i];
              const isActive = activeIdx === i && status === "reviewing";
              const Icon = a.icon;
              const badge = status !== "idle" ? STATUS_STYLE[status] : null;
              return (
                <li key={a.id} className="relative pl-14 md:pl-20">
                  {/* node */}
                  <div
                    className="absolute left-0 top-0 h-11 w-11 md:h-[52px] md:w-[52px] rounded-full border flex items-center justify-center transition-all"
                    style={{
                      borderColor:
                        status === "idle"
                          ? "var(--color-border)"
                          : "color-mix(in oklab, var(--foreground) 50%, transparent)",
                      background:
                        status === "idle"
                          ? "transparent"
                          : `color-mix(in oklab, ${a.color} 12%, transparent)`,
                      boxShadow:
                        status === "completed"
                          ? `0 0 20px color-mix(in oklab, var(--neon-green) 70%, transparent)`
                          : isActive
                            ? `0 0 26px ${a.color}, inset 0 0 14px color-mix(in oklab, ${a.color} 40%, transparent)`
                            : undefined,
                    }}
                  >
                    {status === "completed" ? (
                      <Check className="h-4 w-4" strokeWidth={1.5} style={{ color: "var(--neon-green)" }} />
                    ) : isActive ? (
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} style={{ color: a.color }} />
                    ) : (
                      <Icon
                        className="h-4 w-4"
                        strokeWidth={1.2}
                        style={{ color: status === "idle" ? "var(--color-muted-foreground)" : a.color }}
                      />
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                        Agent {i + 1}
                      </span>
                      <h3 className="text-base md:text-lg font-light text-foreground">
                        {a.name}
                      </h3>
                      {badge && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] tracking-[0.2em] uppercase font-light"
                          style={{
                            color: badge.color,
                            borderColor: `color-mix(in oklab, ${badge.color} 45%, transparent)`,
                            background: `color-mix(in oklab, ${badge.color} 10%, transparent)`,
                            boxShadow: `0 0 14px color-mix(in oklab, ${badge.color} 35%, transparent)`,
                          }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: badge.color, boxShadow: `0 0 8px ${badge.color}` }}
                          />
                          {badge.label}
                        </motion.span>
                      )}
                      {ts && (
                        <span className="ml-auto text-[10px] tracking-[0.2em] uppercase text-muted-foreground tabular-nums">
                          {ts}
                        </span>
                      )}
                    </div>

                    <p className="text-xs md:text-sm font-light text-muted-foreground italic">
                      {a.role}
                    </p>

                    <AnimatePresence>
                      {status !== "idle" && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.35 }}
                          className="mt-2 rounded-2xl border border-border bg-background/60 px-4 py-3"
                        >
                          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-1.5">
                            Decision Note
                          </p>
                          <p className="text-sm font-light text-foreground leading-relaxed">
                            {notes[i] ?? a.note}
                          </p>
                          {a.handoff && status === "completed" && (
                            <div className="mt-3 flex items-center gap-2 text-[11px] font-light text-muted-foreground">
                              <span className="tracking-[0.2em] uppercase text-[10px]">Handoff</span>
                              <ArrowRight className="h-3 w-3" strokeWidth={1.2} />
                              <span className="text-foreground">{a.handoff}</span>
                            </div>
                          )}
                          {!a.handoff && status === "completed" && (
                            <div className="mt-3 flex items-center gap-2 text-[11px] font-light" style={{ color: "var(--neon-green)" }}>
                              <span className="tracking-[0.2em] uppercase text-[10px]">Handoff</span>
                              <ArrowRight className="h-3 w-3" strokeWidth={1.2} />
                              <span>Checkout</span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </li>
              );
            })}
          </ol>

          {swarmActive && timeline === null && (
            <p className="mt-10 flex items-center justify-center gap-2 text-center text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" strokeWidth={1.2} />
              Contacting agent swarm…
            </p>
          )}
          {swarmError && (
            <p className="mt-6 flex items-center justify-center gap-2 text-center text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--neon-red)" }}>
              <AlertTriangle className="h-3 w-3" strokeWidth={1.2} />
              {swarmError} — running local simulation
            </p>
          )}
          {!swarmActive && activeIdx === -1 && (
            <p className="mt-10 text-center text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
              Awaiting trigger — initiate from any product
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
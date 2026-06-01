import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { AgentSwarmModal } from "./AgentSwarmModal";

type Props = { product: Product; reverse?: boolean; sectionId?: string };

export function ProductCard({ product, reverse, sectionId }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [bursts, setBursts] = useState<number[]>([]);
  const [swarmOpen, setSwarmOpen] = useState(false);
  const { add, clear, close } = useCart();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), {
    stiffness: 150,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), {
    stiffness: 150,
    damping: 18,
  });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const triggerBurst = () => {
    const id = Date.now();
    setBursts((b) => [...b, id]);
    setTimeout(() => setBursts((b) => b.filter((x) => x !== id)), 1000);
  };

  const glowColor =
    product.glow === "orange"
      ? "var(--neon-orange)"
      : "var(--neon-cyan)";

  return (
    <>
      <section
        id={sectionId}
        className={`relative px-6 py-32 md:py-48 ${
          reverse ? "md:[direction:rtl]" : ""
        }`}
      >
        <div
          className={`mx-auto max-w-6xl grid md:grid-cols-2 gap-12 md:gap-20 items-center [direction:ltr]`}
        >
          {/* Image / 3D tilt */}
          <motion.div
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            onClick={triggerBurst}
            style={{
              perspective: 1200,
            }}
            className="relative cursor-pointer select-none"
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative aspect-square rounded-3xl overflow-hidden bg-card"
            >
              {/* glow bursts */}
              <AnimatePresence>
                {bursts.map((id) => (
                  <span
                    key={id}
                    className="glow-burst pointer-events-none absolute inset-0 z-0"
                    style={{
                      background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 60%)`,
                      filter: "blur(40px)",
                    }}
                  />
                ))}
              </AnimatePresence>
              <img
                src={product.image}
                alt={product.name}
                width={1024}
                height={1024}
                loading="lazy"
                className="relative z-10 h-full w-full object-cover"
                style={{ transform: "translateZ(40px)" }}
              />
              {/* subtle ambient ring */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  boxShadow: `inset 0 0 120px ${glowColor}20`,
                }}
              />
            </motion.div>
          </motion.div>

          {/* Copy */}
          <div className="flex flex-col items-start gap-6">
            <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground">
              {product.id.includes("sound") ? "Headphones" : "Smartwatch"}
            </span>
            <h2 className="text-4xl md:text-6xl font-thin tracking-tight text-foreground">
              {product.name}
            </h2>
            <p className="text-lg md:text-xl font-light italic text-muted-foreground">
              {product.tagline}
            </p>
            <p className="max-w-md text-sm md:text-base font-light leading-relaxed text-muted-foreground">
              {product.description}
            </p>
            <div className="mt-2 text-sm font-light text-foreground tracking-wide">
              From <span className="text-base">${product.price.toLocaleString()}</span>
            </div>
            <button
              onClick={() => {
                add(product);
                setTimeout(() => {
                  close();
                  setSwarmOpen(true);
                }, 600);
              }}
              className="group mt-4 relative overflow-hidden rounded-full border border-border bg-foreground text-background px-7 py-3 text-xs tracking-[0.2em] uppercase font-medium transition-all hover:bg-background hover:text-foreground"
            >
              <span className="relative z-10">Consult Agent Swarm &amp; Checkout</span>
            </button>
          </div>
        </div>
      </section>

      <AgentSwarmModal
        open={swarmOpen}
        onClose={() => setSwarmOpen(false)}
        onConfirm={() => {
          clear();
          setSwarmOpen(false);
        }}
      />
    </>
  );
}
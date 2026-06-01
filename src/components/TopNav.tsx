import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

export function TopNav() {
  const { count, toggle } = useCart();
  return (
    <header className="fixed top-0 inset-x-0 z-40 backdrop-blur-xl bg-background/60 border-b border-border">
      <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
        <a href="#top" className="text-sm font-light tracking-[0.3em] text-foreground">
          AETHER
        </a>
        <nav className="hidden md:flex gap-10 text-xs font-light tracking-wider text-muted-foreground">
          <a href="#sound" className="hover:text-foreground transition-colors">Sound</a>
          <a href="#time" className="hover:text-foreground transition-colors">Time</a>
          <a href="#about" className="hover:text-foreground transition-colors">About</a>
        </nav>
        <button
          onClick={toggle}
          aria-label="Open shopping bag"
          className="relative p-2 text-foreground hover:opacity-80 transition-opacity"
        >
          <ShoppingBag className="h-5 w-5" strokeWidth={1.2} />
          {count > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-foreground text-background text-[10px] font-medium flex items-center justify-center"
            >
              {count}
            </motion.span>
          )}
        </button>
      </div>
    </header>
  );
}
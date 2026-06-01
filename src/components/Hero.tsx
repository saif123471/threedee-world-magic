import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-14"
    >
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.1 }}
        className="text-xs tracking-[0.4em] text-muted-foreground uppercase mb-8"
      >
        Aether Labs — Collection 02
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="text-center font-thin tracking-tight text-foreground text-5xl md:text-7xl lg:text-8xl leading-[1.05] max-w-5xl"
      >
        Sound &amp; Time,
        <br />
        <span className="italic font-extralight bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
          reimagined.
        </span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="mt-8 max-w-xl text-center text-base md:text-lg font-light text-muted-foreground"
      >
        Two objects. Engineered to the limit of what's possible.
        Designed to disappear into your life.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-10 flex flex-col items-center text-muted-foreground"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase mb-2">Scroll</span>
        <ChevronDown className="h-4 w-4 animate-bounce" strokeWidth={1} />
      </motion.div>
    </section>
  );
}
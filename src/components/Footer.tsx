export function Footer() {
  return (
    <footer id="about" className="border-t border-border mt-20">
      <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-3 gap-10">
        <div>
          <p className="text-sm font-light tracking-[0.3em] text-foreground">AETHER</p>
          <p className="mt-4 text-xs font-light text-muted-foreground max-w-xs">
            Designed in Zürich. Assembled with intention. A small studio building
            two objects per year.
          </p>
        </div>
        <div className="text-xs font-light text-muted-foreground space-y-2">
          <p className="text-foreground tracking-wider mb-3">Studio</p>
          <p>Philosophy</p>
          <p>Materials</p>
          <p>Press</p>
        </div>
        <div className="text-xs font-light text-muted-foreground space-y-2">
          <p className="text-foreground tracking-wider mb-3">Support</p>
          <p>Care & Warranty</p>
          <p>Shipping</p>
          <p>Contact</p>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-6 flex justify-between text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
          <span>© 2026 Aether Labs</span>
          <span>Made on Earth</span>
        </div>
      </div>
    </footer>
  );
}
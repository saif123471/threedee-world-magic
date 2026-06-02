import { createFileRoute } from "@tanstack/react-router";
import { CartProvider } from "@/context/CartContext";
import { TopNav } from "@/components/TopNav";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { AgentTimeline } from "@/components/AgentTimeline";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { products } from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aether Labs — Sound & Time, Reimagined" },
      {
        name: "description",
        content:
          "Aether Labs designs two objects: the Aether Sound Max headphones and Chronos Orion V2 smartwatch. Engineered to the limit of what's possible.",
      },
      { property: "og:title", content: "Aether Labs — Sound & Time, Reimagined" },
      {
        property: "og:description",
        content: "Two luxury objects. Engineered to disappear into your life.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-background text-foreground">
        <TopNav />
        <main>
          <Hero />
          <ProductCard product={products[0]} sectionId="sound" />
          <ProductCard product={products[1]} sectionId="time" reverse />
          <AgentTimeline />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}

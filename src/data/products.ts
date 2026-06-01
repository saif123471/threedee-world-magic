import headphones from "@/assets/headphones.jpg";
import smartwatch from "@/assets/smartwatch.jpg";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  image: string;
  glow: "orange" | "cyan";
};

export const products: Product[] = [
  {
    id: "aether-sound-max",
    name: "Aether Sound Max",
    tagline: "Sound, redefined.",
    description:
      "Adaptive spatial audio with titanium-grade acoustics. Engineered for the listeners who hear everything.",
    price: 749,
    image: headphones,
    glow: "orange",
  },
  {
    id: "chronos-orion-v2",
    name: "Chronos Orion V2",
    tagline: "Time, reimagined.",
    description:
      "Aerospace titanium, always-on retina display, and a sapphire crown. Built for the next hundred years.",
    price: 1299,
    image: smartwatch,
    glow: "cyan",
  },
];
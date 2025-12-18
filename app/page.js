import { Features } from "@/components/features";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-centeritems-center text-white">
      <Hero />
      <Features />
    </div>
  );
}
import { Features } from "@/components/features";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center text-white">
      <Hero />
      <Features />
    </div>
  );
}
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { FeaturedEvents } from "@/components/FeaturedEvents";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <FeaturedEvents />
      </main>
    </div>
  );
};

export default Index;

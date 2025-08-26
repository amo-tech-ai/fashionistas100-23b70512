import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { FeaturedEvents } from "@/components/FeaturedEvents";
import { TicketTiers } from "@/components/TicketTiers";
import { Newsletter } from "@/components/Newsletter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <FeaturedEvents />
        <TicketTiers />
        <Newsletter />
      </main>
    </div>
  );
};

export default Index;

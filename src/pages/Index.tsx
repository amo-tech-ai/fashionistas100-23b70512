import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { FeaturedEvents } from "@/components/FeaturedEvents";
import { DesignerSpotlight } from "@/components/DesignerSpotlight";
import { TicketTiers } from "@/components/TicketTiers";
import { Newsletter } from "@/components/Newsletter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16 lg:pt-20"> {/* Add padding for fixed nav */}
        <Hero />
        <FeaturedEvents />
        <DesignerSpotlight />
        <TicketTiers />
        <Newsletter />
      </main>
    </div>
  );
};

export default Index;

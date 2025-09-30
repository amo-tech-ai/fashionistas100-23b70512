import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { FeaturedEvents } from "@/components/FeaturedEvents";
import { DesignerSpotlight } from "@/components/DesignerSpotlight";
import { TicketTiers } from "@/components/TicketTiers";
import { Newsletter } from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { SystemCheck } from "@/components/SystemCheck";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <SystemCheck />
      <main className="pt-16 lg:pt-20 flex-1"> {/* Add padding for fixed nav */}
        <Hero />
        <AboutSection />
        <FeaturedEvents />
        <DesignerSpotlight />
        <TicketTiers />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

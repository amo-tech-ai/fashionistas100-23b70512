import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { FeaturedEvents } from "@/components/FeaturedEvents";
import { DesignerSpotlight } from "@/components/DesignerSpotlight";
import { TicketTiers } from "@/components/TicketTiers";
import { Newsletter } from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { SystemCheck } from "@/components/SystemCheck";
import { AuthDebug } from "@/components/AuthDebug";
import { AuthStatusBanner } from "@/components/AuthStatusBanner";
import { SafeSection } from "@/components/SafeSection";

const NAV_HEIGHT = 64; // px; match your fixed Navigation height

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <AuthStatusBanner />
      <SystemCheck />
      <AuthDebug />
      {/* Add padding for fixed nav */}
      <div style={{ height: NAV_HEIGHT }} aria-hidden />
      <SafeSection>
        <main className="flex-1">
          <Hero />
          <AboutSection />
          <FeaturedEvents />
          <DesignerSpotlight />
          <TicketTiers />
          <Newsletter />
        </main>
      </SafeSection>
      <Footer />
    </div>
  );
};

export default Index;

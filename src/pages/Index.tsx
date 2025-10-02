import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { CategoryCards } from "@/components/CategoryCards";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturedEvents } from "@/components/FeaturedEvents";
import { DesignerSpotlight } from "@/components/DesignerSpotlight";
import { Newsletter } from "@/components/Newsletter";
import { TicketTiers } from "@/components/TicketTiers";
import { Testimonials } from "@/components/Testimonials";
import { CTASection } from "@/components/CTASection";
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
          <CategoryCards />
          <HowItWorks />
          <FeaturedEvents />
          <DesignerSpotlight />
          <Newsletter />
          <TicketTiers />
          <Testimonials />
          <CTASection />
        </main>
      </SafeSection>
      <Footer />
    </div>
  );
};

export default Index;

import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Sparkles } from "lucide-react";
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
      
      {/* MVP Quick Start Banner */}
      <div className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-8 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6" />
            AI-Powered Event Management
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Create events, get AI health scores, and find perfect model castings in minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events">
              <Button size="lg" variant="secondary" className="gap-2">
                <Calendar className="h-5 w-5" />
                Browse Events
              </Button>
            </Link>
            <Link to="/events">
              <Button size="lg" variant="outline" className="gap-2 bg-white/10 hover:bg-white/20 border-white/30">
                <Sparkles className="h-5 w-5" />
                Create Your First Event
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
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

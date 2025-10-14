
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { fashionImages } from "@/lib/cloudinary";
import heroImageFallback from "@/assets/hero-runway-new.jpg";

export const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-[hsl(var(--breef-cream))] via-white to-[hsl(var(--breef-orange))]/5 py-20 lg:py-32 -mt-16 lg:-mt-20 pt-32 lg:pt-40 overflow-hidden min-h-[90vh] flex items-center">
      {/* Enhanced decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-72 h-72 bg-[hsl(var(--breef-orange))] rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-[hsl(var(--breef-orange))] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main Heading */}
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-[hsl(var(--breef-orange))]/10 text-[hsl(var(--breef-orange))] border border-[hsl(var(--breef-orange))]/20 font-inter text-sm px-6 py-2.5 rounded-full shadow-sm">
              ✨ Colombia's Premier Fashion Event Platform
            </div>
            
            <h1 className="font-inter text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-[hsl(var(--breef-dark))] leading-[1.1] tracking-tight max-w-5xl mx-auto">
              The easiest way to find a{" "}
              <span className="text-[hsl(var(--breef-orange))] font-normal relative">
                fashion event
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[hsl(var(--breef-orange))]/20" viewBox="0 0 200 12" preserveAspectRatio="none">
                  <path d="M0 6 Q50 0, 100 6 T200 6" fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>
              </span>
            </h1>
            
            <p className="font-inter text-lg md:text-xl lg:text-2xl text-[hsl(var(--breef-gray))] max-w-3xl mx-auto leading-relaxed">
              From runway shows to designer showcases—discover, book, and attend exclusive fashion experiences across Colombia.
            </p>
            
            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Link to="/events" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="font-inter h-14 px-10 text-base bg-[hsl(var(--breef-orange))] text-white hover:bg-[hsl(var(--breef-orange))]/90 rounded-full transition-all duration-300 w-full sm:w-auto shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Browse Events →
                </Button>
              </Link>
              <Link to="/events" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="font-inter h-14 px-10 text-base border-2 border-[hsl(var(--breef-dark))]/20 bg-white text-[hsl(var(--breef-dark))] hover:bg-[hsl(var(--surface-2))] rounded-full transition-all duration-300 w-full sm:w-auto hover:border-[hsl(var(--breef-orange))]/30"
                >
                  Create Event
                </Button>
              </Link>
            </div>

            {/* Enhanced Social Proof Strip */}
            <div className="pt-12">
              <p className="font-inter text-xs text-[hsl(var(--breef-gray))] uppercase tracking-widest mb-6">
                Featured In
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                {['Vogue', 'Elle', "Harper's Bazaar", 'Marie Claire', 'GQ'].map((brand) => (
                  <span key={brand} className="font-inter text-lg md:text-xl font-light text-[hsl(var(--breef-gray))]/50 hover:text-[hsl(var(--breef-gray))] transition-colors cursor-default">
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { fashionImages } from "@/lib/cloudinary";
import heroImageFallback from "@/assets/hero-runway-new.jpg";

export const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-[hsl(var(--breef-cream))] to-white py-20 lg:py-32 -mt-16 lg:-mt-20 pt-32 lg:pt-40 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-72 h-72 bg-[hsl(var(--breef-orange))] rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main Heading */}
          <div className="text-center space-y-8 mb-16">
            <Badge className="bg-[hsl(var(--breef-orange))]/10 text-[hsl(var(--breef-orange))] border-[hsl(var(--breef-orange))]/20 font-inter text-sm px-4 py-1.5">
              Colombia's Premier Fashion Event Platform
            </Badge>
            
            <h1 className="font-inter text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-[hsl(var(--breef-dark))] leading-tight tracking-tight">
              The easiest way to find a{" "}
              <span className="text-[hsl(var(--breef-orange))] font-normal">fashion event</span>
            </h1>
            
            <p className="font-inter text-lg md:text-xl text-[hsl(var(--breef-gray))] max-w-2xl mx-auto leading-relaxed">
              From runway shows to designer showcases—discover, book, and attend exclusive fashion experiences.
            </p>
            
            {/* Primary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link to="/events" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="font-inter h-14 px-10 text-base bg-[hsl(var(--breef-orange))] text-white hover:bg-[hsl(var(--breef-orange))]/90 rounded-full transition-all duration-300 w-full sm:w-auto shadow-lg hover:shadow-xl"
                >
                  Browse Events
                </Button>
              </Link>
              <Link to="/sponsors" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="font-inter h-14 px-10 text-base border-2 border-[hsl(var(--breef-dark))]/20 bg-white text-[hsl(var(--breef-dark))] hover:bg-[hsl(var(--surface-2))] rounded-full transition-all duration-300 w-full sm:w-auto"
                >
                  Become a Sponsor
                </Button>
              </Link>
            </div>

            {/* Social Proof Strip */}
            <div className="pt-8">
              <p className="font-inter text-xs text-[hsl(var(--breef-gray))] uppercase tracking-wider mb-4">
                Featured In
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 text-[hsl(var(--breef-gray))]/40">
                <span className="font-inter text-lg font-light">Vogue</span>
                <span className="font-inter text-lg font-light">Elle</span>
                <span className="font-inter text-lg font-light">Harper's Bazaar</span>
                <span className="font-inter text-lg font-light">Marie Claire</span>
                <span className="font-inter text-lg font-light">GQ</span>
              </div>
            </div>
          </div>


          {/* Animated Stats - Breef style large numbers only */}
          <div className="bg-white rounded-2xl shadow-card p-8 md:p-12">
            <p className="font-inter text-sm text-[hsl(var(--breef-gray))] uppercase tracking-wider text-center mb-12">
              Trusted by the Fashion Community
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              <div className="text-center space-y-2">
                <div className="font-inter text-5xl md:text-6xl font-light text-[hsl(var(--breef-dark))]">
                  500+
                </div>
                <div className="font-inter text-sm text-[hsl(var(--breef-gray))]">
                  Fashion Events
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="font-inter text-5xl md:text-6xl font-light text-[hsl(var(--breef-dark))]">
                  200+
                </div>
                <div className="font-inter text-sm text-[hsl(var(--breef-gray))]">
                  Designers
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="font-inter text-5xl md:text-6xl font-light text-[hsl(var(--breef-dark))]">
                  50+
                </div>
                <div className="font-inter text-sm text-[hsl(var(--breef-gray))]">
                  Cities
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="font-inter text-5xl md:text-6xl font-light text-[hsl(var(--breef-dark))]">
                  10k+
                </div>
                <div className="font-inter text-sm text-[hsl(var(--breef-gray))]">
                  Attendees
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

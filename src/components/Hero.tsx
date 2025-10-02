
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { fashionImages } from "@/lib/cloudinary";
// Fallback to local image if Cloudinary fails
import heroImageFallback from "@/assets/hero-runway-new.jpg";

export const Hero = () => {
  return (
    <section className="relative bg-[hsl(var(--breef-cream))] py-20 lg:py-32 -mt-16 lg:-mt-20 pt-32 lg:pt-40">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Main Heading - Breef Style: Clean, centered, large */}
          <div className="text-center space-y-8 mb-16">
            <h1 className="font-inter text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-[hsl(var(--breef-dark))] leading-tight tracking-tight">
              The easiest way to find a{" "}
              <span className="text-[hsl(var(--breef-orange))] font-normal">fashion event</span>
            </h1>
            <p className="font-inter text-lg md:text-xl text-[hsl(var(--breef-gray))] max-w-2xl mx-auto leading-relaxed">
              Access exclusive fashion experiences from world-class designers. Curated for style enthusiasts.
            </p>
            
            {/* CTA Buttons - Breef pill style */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link to="/create-event" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="font-inter h-12 px-8 text-base bg-[hsl(var(--breef-orange))] text-white hover:bg-[hsl(var(--breef-orange))]/90 rounded-full transition-all duration-300 w-full sm:w-auto shadow-md"
                >
                  Create Event
                </Button>
              </Link>
              <Link to="/events" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="font-inter h-12 px-8 text-base border-2 border-[hsl(var(--breef-dark))]/20 bg-white text-[hsl(var(--breef-dark))] hover:bg-[hsl(var(--surface-2))] rounded-full transition-all duration-300 w-full sm:w-auto"
                >
                  Browse Events
                </Button>
              </Link>
            </div>
          </div>

          {/* Category Pills - Breef style */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {["Runway", "Pop-Ups", "Exhibitions", "Fashion Week", "Designer"].map((cat) => (
              <Badge 
                key={cat}
                variant="outline" 
                className="px-4 py-2 text-sm font-inter border-[hsl(var(--border))] bg-white hover:border-[hsl(var(--breef-orange))] transition-colors cursor-pointer rounded-full"
              >
                {cat}
              </Badge>
            ))}
          </div>

          {/* Image Grid - Breef style horizontal scroll */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin mb-16">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex-shrink-0 w-64 h-40 rounded-xl overflow-hidden shadow-card">
                <img 
                  src={fashionImages.hero.main || heroImageFallback}
                  alt={`Fashion event ${i}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = heroImageFallback;
                  }}
                />
              </div>
            ))}
          </div>

          {/* Stats - Breef style centered blocks */}
          <div className="text-center space-y-6 py-12">
            <p className="font-inter text-sm text-[hsl(var(--breef-gray))] uppercase tracking-wider">
              We're here to help your fashion event shine
            </p>
            <div className="flex flex-wrap justify-center gap-12">
              <div className="space-y-1">
                <div className="font-inter text-4xl md:text-5xl font-light text-[hsl(var(--breef-dark))]">
                  500+
                </div>
                <div className="font-inter text-sm text-[hsl(var(--breef-gray))]">
                  Fashion Events
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-inter text-4xl md:text-5xl font-light text-[hsl(var(--breef-dark))]">
                  200+
                </div>
                <div className="font-inter text-sm text-[hsl(var(--breef-gray))]">
                  Designers
                </div>
              </div>
              <div className="space-y-1">
                <div className="font-inter text-4xl md:text-5xl font-light text-[hsl(var(--breef-dark))]">
                  50+
                </div>
                <div className="font-inter text-sm text-[hsl(var(--breef-gray))]">
                  Cities
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

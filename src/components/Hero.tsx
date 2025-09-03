
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { fashionImages } from "@/lib/cloudinary";
// Fallback to local image if Cloudinary fails
import heroImageFallback from "@/assets/hero-runway-new.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero -mt-16 lg:-mt-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={fashionImages.hero.main || heroImageFallback} 
          alt="Fashion runway show"
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = heroImageFallback;
          }}
        />
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-left">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="flex justify-start">
            <Badge variant="hero" className="text-sm font-inter px-4 py-2 bg-white/20 backdrop-blur-sm text-white border-white/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Experience Fashion Live
            </Badge>
          </div>

          {/* Main Heading - Thin and elegant styling */}
          <div className="space-y-6">
            <h1 className="font-inter text-3xl md:text-4xl lg:text-5xl font-thin text-white leading-tight drop-shadow-lg text-left">
              Where Style
              <span className="block text-white drop-shadow-lg">Meets Excellence</span>
            </h1>
            <p className="font-inter text-xl md:text-2xl text-white/90 max-w-2xl drop-shadow-md text-left">
              Discover exclusive fashion events, connect with world-class designers, 
              and experience the future of haute couture.
            </p>
          </div>

          {/* CTA Buttons - Minimalist styling */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full pt-4">
            <Link to="/events" className="w-full sm:w-auto flex justify-center">
              <Button 
                size="lg" 
                className="font-inter h-12 px-8 text-base bg-white text-black hover:bg-gray-100 transition-all duration-300 w-full sm:w-auto"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Explore Events
              </Button>
            </Link>
            <Link to="/designers" className="w-full sm:w-auto flex justify-center">
              <Button 
                variant="outline" 
                size="lg" 
                className="font-inter h-12 px-8 text-base border-2 border-black bg-black text-white hover:bg-gray-900 hover:border-gray-800 transition-all duration-300 w-full sm:w-auto"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Find Designers
              </Button>
            </Link>
          </div>

          {/* Stats - Improved spacing and contrast */}
          <div className="grid grid-cols-3 gap-8 pt-12 mt-12 border-t border-white/20">
            <div className="text-center lg:text-left space-y-2">
              <div className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
                500+
              </div>
              <div className="font-inter text-base md:text-lg text-white/80 drop-shadow-md">
                Fashion Events
              </div>
            </div>
            <div className="text-center lg:text-left space-y-2">
              <div className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
                200+
              </div>
              <div className="font-inter text-base md:text-lg text-white/80 drop-shadow-md">
                World-Class Designers
              </div>
            </div>
            <div className="text-center lg:text-left space-y-2">
              <div className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
                50+
              </div>
              <div className="font-inter text-base md:text-lg text-white/80 drop-shadow-md">
                Global Cities
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

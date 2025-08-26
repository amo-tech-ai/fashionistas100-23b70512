import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-runway-new.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Fashion runway show"
          className="w-full h-full object-cover"
        />
        
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center lg:text-left">
        <div className="max-w-4xl mx-auto lg:mx-0 space-y-8">
          {/* Badge */}
          <div className="flex justify-center lg:justify-start">
            <Badge variant="hero" className="text-sm font-inter px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Experience Fashion Live
            </Badge>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              Where Style
              <span className="block text-accent">Meets Excellence</span>
            </h1>
            <p className="font-inter text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Discover exclusive fashion events, connect with world-class designers, 
              and experience the future of haute couture.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button variant="hero" size="xl" className="font-inter">
              <Calendar className="w-5 h-5 mr-2" />
              Explore Events
            </Button>
            <Button variant="outline" size="xl" className="font-inter">
              <MapPin className="w-5 h-5 mr-2" />
              Find Designers
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/20">
            <div className="text-center lg:text-left">
              <div className="font-playfair text-2xl md:text-3xl font-bold text-accent">
                500+
              </div>
              <div className="font-inter text-sm text-muted-foreground">
                Fashion Events
              </div>
            </div>
            <div className="text-center lg:text-left">
              <div className="font-playfair text-2xl md:text-3xl font-bold text-accent">
                200+
              </div>
              <div className="font-inter text-sm text-muted-foreground">
                World-Class Designers
              </div>
            </div>
            <div className="text-center lg:text-left">
              <div className="font-playfair text-2xl md:text-3xl font-bold text-accent">
                50+
              </div>
              <div className="font-inter text-sm text-muted-foreground">
                Global Cities
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
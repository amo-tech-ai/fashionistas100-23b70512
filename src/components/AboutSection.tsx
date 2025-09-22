import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";

export const AboutSection = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Image */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <img
                src="/src/assets/hero-runway.jpg"
                alt="Fashion runway show with models and designers"
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-lg"
              />
              <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <div className="space-y-4">
              <Badge variant="outline" className="font-inter">
                <Award className="w-4 h-4 mr-2" />
                About Fashionistas
              </Badge>
              
              <h2 className="font-playfair text-4xl lg:text-5xl font-bold text-foreground">
                The Premier Hub for
                <span className="block text-foreground">Fashion Events</span>
              </h2>
              
              <p className="font-inter text-lg text-muted-foreground leading-relaxed">
                Fashionistas is Colombia's leading platform connecting fashion professionals, 
                designers, and enthusiasts through exclusive events, runway shows, and 
                industry experiences.
              </p>
              
              <p className="font-inter text-muted-foreground">
                From emerging designer showcases to haute couture presentations, 
                we curate the most prestigious fashion events while providing 
                seamless booking experiences for attendees and comprehensive 
                management tools for organizers.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 py-6">
              <div className="text-center">
                <div className="font-playfair text-2xl font-bold text-foreground">500+</div>
                <div className="font-inter text-sm text-muted-foreground">Events Created</div>
              </div>
              <div className="text-center">
                <div className="font-playfair text-2xl font-bold text-foreground">50K+</div>
                <div className="font-inter text-sm text-muted-foreground">Attendees</div>
              </div>
              <div className="text-center">
                <div className="font-playfair text-2xl font-bold text-foreground">200+</div>
                <div className="font-inter text-sm text-muted-foreground">Designers</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="font-inter">
                <Link to="/events">
                  <Calendar className="w-4 h-4 mr-2" />
                  Browse Events
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-inter">
                <Link to="/designers">
                  <Users className="w-4 h-4 mr-2" />
                  Meet Our Designers
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
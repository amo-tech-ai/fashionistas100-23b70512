import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from '@/assets/hero-runway-new.jpg';
export const AboutSection = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        {/* Breef-style section header */}
        <div className="text-center mb-16">
          <h2 className="font-inter text-3xl md:text-5xl font-light text-[hsl(var(--breef-dark))] mb-6">
            The new event standard
          </h2>
          <p className="font-inter text-lg text-[hsl(var(--breef-gray))] max-w-2xl mx-auto leading-relaxed">
            Streamlined event creation, seamless model casting, and effortless ticket management—all in one platform.
          </p>
        </div>

        {/* Features List - Breef style */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-inter text-xl font-medium text-[hsl(var(--breef-dark))]">
                Streamlined Agency Search
              </h3>
              <p className="font-inter text-[hsl(var(--breef-gray))] leading-relaxed">
                Access 500+ verified fashion events and connect with world-class designers in minutes.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-inter text-xl font-medium text-[hsl(var(--breef-dark))]">
                Vetted Agency Credentials
              </h3>
              <p className="font-inter text-[hsl(var(--breef-gray))] leading-relaxed">
                Every designer and venue is verified for quality and professionalism.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-inter text-xl font-medium text-[hsl(var(--breef-dark))]">
                Guided Project Pricing
              </h3>
              <p className="font-inter text-[hsl(var(--breef-gray))] leading-relaxed">
                Transparent pricing with no hidden fees. Book tickets and services with confidence.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src={heroImage}
              alt="Fashion event management"
              className="w-full h-full min-h-[400px] object-cover rounded-2xl shadow-card"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/create-event">
            <Button 
              size="lg" 
              className="font-inter h-12 px-8 bg-[hsl(var(--breef-orange))] hover:bg-[hsl(var(--breef-orange))]/90 text-white rounded-full shadow-md"
            >
              Get Started
            </Button>
          </Link>
          <p className="font-inter text-sm text-[hsl(var(--breef-gray))] mt-4">
            Create your first event in minutes
          </p>
        </div>
      </div>
    </section>
  );
};
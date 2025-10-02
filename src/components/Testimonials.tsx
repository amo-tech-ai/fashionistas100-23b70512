import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Sofia Ramirez",
    role: "Fashion Designer",
    company: "Studio SR",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop",
    quote: "Fashionistas transformed how I showcase my collections. The platform made it effortless to reach the right audience.",
    rating: 5
  },
  {
    name: "Carlos Mendez",
    role: "Event Organizer",
    company: "Medellin Fashion Week",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop",
    quote: "Best platform for managing fashion events in Colombia. Ticket sales increased by 300% using their system.",
    rating: 5
  },
  {
    name: "Isabella Torres",
    role: "Model & Influencer",
    company: "@bellatorres",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop",
    quote: "I discovered incredible opportunities through Fashionistas. The casting process is seamless and professional.",
    rating: 5
  },
  {
    name: "Diego Vargas",
    role: "Brand Sponsor",
    company: "Luxe Colombia",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop",
    quote: "Partnering with events through Fashionistas has been phenomenal for brand visibility and engagement.",
    rating: 5
  }
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const current = testimonials[currentIndex];

  return (
    <section className="py-20 px-4 bg-[hsl(var(--breef-dark))]">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="font-inter text-3xl md:text-5xl font-light text-white mb-4">
            Loved by the community
          </h2>
          <p className="font-inter text-lg text-white/70">
            Hear from designers, models, and event organizers
          </p>
        </div>

        <Card className="bg-white rounded-2xl shadow-card border-0">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col items-center text-center space-y-6">
              <Quote className="w-12 h-12 text-[hsl(var(--breef-orange))]/20" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[hsl(var(--breef-orange))] text-[hsl(var(--breef-orange))]" />
                ))}
              </div>

              <blockquote className="font-inter text-xl md:text-2xl font-light text-[hsl(var(--breef-dark))] leading-relaxed">
                "{current.quote}"
              </blockquote>

              <div className="flex flex-col items-center space-y-4 pt-4">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-inter font-medium text-[hsl(var(--breef-dark))]">
                    {current.name}
                  </p>
                  <p className="font-inter text-sm text-[hsl(var(--breef-gray))]">
                    {current.role} • {current.company}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-[hsl(var(--breef-orange))] w-8' 
                  : 'bg-[hsl(var(--border))]'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const CTASection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[hsl(var(--breef-cream))] to-white">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="space-y-8">
          <h2 className="font-inter text-3xl md:text-5xl font-light text-[hsl(var(--breef-dark))]">
            Ready to Elevate Your Fashion Experience?
          </h2>
          
          <p className="font-inter text-lg text-[hsl(var(--breef-gray))] max-w-2xl mx-auto">
            Join Fashionistas to discover events, book tickets, and connect with world-class designers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link to="/events" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="font-inter h-14 px-10 text-base bg-[hsl(var(--breef-orange))] text-white hover:bg-[hsl(var(--breef-orange))]/90 rounded-full w-full sm:w-auto"
              >
                Explore Events
              </Button>
            </Link>
            <Link to="/sponsors" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                size="lg" 
                className="font-inter h-14 px-10 text-base border-2 border-[hsl(var(--breef-dark))]/20 bg-white text-[hsl(var(--breef-dark))] hover:bg-[hsl(var(--surface-2))] rounded-full w-full sm:w-auto"
              >
                Become a Sponsor
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";
import { useEventData } from "@/hooks/useEventData";

export const FeaturedEvents = () => {
  const { data, error, isLoading } = useEventData({ kind: "list", featured: true, limit: 6 });
  const events = Array.isArray(data) ? data : [];

  return (
    <section className="py-20 px-4 bg-[hsl(var(--breef-cream))]">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header - Breef Style */}
        <div className="text-center space-y-6 mb-12">
          <h2 className="font-inter text-3xl md:text-5xl font-light text-[hsl(var(--breef-dark))]">
            Upcoming fashion events
          </h2>
          <p className="font-inter text-lg text-[hsl(var(--breef-gray))] max-w-2xl mx-auto">
            Discover exclusive runway shows, designer showcases, and fashion week experiences.
          </p>
        </div>

        {/* Filter Pills - Breef Style */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button 
            size="sm" 
            className="font-inter px-4 py-2 bg-[hsl(var(--breef-orange))] hover:bg-[hsl(var(--breef-orange))]/90 text-white rounded-full"
          >
            All Events
          </Button>
          {["Runway", "Couture", "Streetwear", "Pop-ups"].map((filter) => (
            <Button 
              key={filter}
              variant="outline" 
              size="sm" 
              className="font-inter px-4 py-2 border-[hsl(var(--border))] bg-white hover:border-[hsl(var(--breef-orange))] rounded-full"
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Events Grid - Breef card style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {isLoading ? (
            <div className="col-span-full text-center py-12">
              <p className="font-inter text-muted-foreground">Loading events...</p>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="font-inter text-destructive">Error: {error}</p>
            </div>
          ) : !events?.length ? (
            <div className="col-span-full text-center py-12">
              <p className="font-inter text-muted-foreground">No upcoming events found.</p>
            </div>
          ) : (
            events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </div>

        {/* View All Button - Breef Style */}
        <div className="text-center">
          <Button 
            variant="outline" 
            size="lg" 
            className="font-inter h-12 px-8 border-2 border-[hsl(var(--breef-dark))]/20 bg-white hover:bg-[hsl(var(--surface-2))] rounded-full"
          >
            View All Events
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};
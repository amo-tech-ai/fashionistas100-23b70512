import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";
import { useEventData } from "@/hooks/useEventData";

export const FeaturedEvents = () => {
  const { data, error, isLoading } = useEventData({ kind: "list", featured: true, limit: 6 });
  const events = Array.isArray(data) ? data : [];

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <Badge variant="accent" className="font-inter">
            <Calendar className="w-4 h-4 mr-2" />
            Featured Events
          </Badge>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
            Upcoming Fashion
            <span className="block text-foreground">Experiences</span>
          </h2>
          <p className="font-inter text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the most exclusive fashion events happening around the world. 
            From haute couture showcases to emerging designer spotlights.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button variant="primary" size="sm" className="font-inter">
            All Events
          </Button>
          <Button variant="outline" size="sm" className="font-inter">
            Runway Shows
          </Button>
          <Button variant="outline" size="sm" className="font-inter">
            VIP Experiences
          </Button>
          <Button variant="outline" size="sm" className="font-inter">
            Emerging Designers
          </Button>
          <Button variant="outline" size="sm" className="font-inter">
            Haute Couture
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12">
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

        {/* View All Button */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="font-inter">
            View All Events
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};
import { useState, useEffect } from "react";
import { EventCard } from "@/components/EventCard";
import { EventSummary, listPublishedEvents } from "@/services/eventService";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

interface RelatedEventsProps {
  currentEventId: string;
  currentEventCity?: string;
}

export const RelatedEvents = ({ currentEventId, currentEventCity }: RelatedEventsProps) => {
  const [relatedEvents, setRelatedEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedEvents = async () => {
      try {
        setLoading(true);
        
        // First try to get events in the same city
        let { data: events } = await listPublishedEvents({ 
          limit: 8,
          city: currentEventCity 
        });

        // Filter out current event
        events = events.filter(event => event.id !== currentEventId);

        // If we don't have enough events from the same city, get more general events
        if (events.length < 3) {
          const { data: moreEvents } = await listPublishedEvents({ 
            limit: 6 
          });
          
          const additionalEvents = moreEvents
            .filter(event => 
              event.id !== currentEventId && 
              !events.some(existing => existing.id === event.id)
            )
            .slice(0, 3 - events.length);
          
          events = [...events, ...additionalEvents];
        }

        // Limit to 3 events
        setRelatedEvents(events.slice(0, 3));
      } catch (error) {
        console.error('Error fetching related events:', error);
        setRelatedEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedEvents();
  }, [currentEventId, currentEventCity]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-playfair font-bold mb-8">You Might Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (relatedEvents.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-playfair font-bold mb-8">You Might Also Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};
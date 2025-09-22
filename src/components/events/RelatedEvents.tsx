import { EventCard } from "@/components/EventCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { useEventData } from "@/hooks/useEventData";

interface RelatedEventsProps {
  currentEventId: string;
  currentEventCity?: string;
}

export const RelatedEvents = ({ currentEventId, currentEventCity }: RelatedEventsProps) => {
  const { data, isLoading: loading } = useEventData({ 
    kind: "list", 
    relatedToId: currentEventId, 
    city: currentEventCity,
    limit: 3 
  });
  const relatedEvents = Array.isArray(data) ? data : [];

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

  if (!relatedEvents?.length) {
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
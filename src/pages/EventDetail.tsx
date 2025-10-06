import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AIModelCastingPanel } from '@/components/events/AIModelCastingPanel';
import { AIRunwayTimingPanel } from '@/components/events/AIRunwayTimingPanel';
import { AIVendorCoordinatorPanel } from '@/components/events/AIVendorCoordinatorPanel';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Event not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Assistant Sidebar */}
        <aside className="lg:col-span-1">
          <Tabs defaultValue="casting" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="casting">Modelos</TabsTrigger>
              <TabsTrigger value="timing">Timing</TabsTrigger>
              <TabsTrigger value="vendors">Proveedores</TabsTrigger>
            </TabsList>
            <TabsContent value="casting" className="mt-4">
              <AIModelCastingPanel eventId={event.id} />
            </TabsContent>
            <TabsContent value="timing" className="mt-4">
              <AIRunwayTimingPanel eventId={event.id} />
            </TabsContent>
            <TabsContent value="vendors" className="mt-4">
              <AIVendorCoordinatorPanel eventId={event.id} />
            </TabsContent>
          </Tabs>
        </aside>
        
        {/* Main Event Details */}
        <main className="lg:col-span-2">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {event.title}
              </h1>
              <p className="text-muted-foreground">
                {new Date(event.start_datetime).toLocaleDateString('es-CO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {event.description && (
              <div className="prose max-w-none">
                <p className="text-foreground">{event.description}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CreateEventFormMVP } from '@/components/events/CreateEventFormMVP';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Users, MapPin, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function EventsMVP() {
  const [events, setEvents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      console.error('Error loading events:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los eventos',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEventCreated = (id: string) => {
    setShowForm(false);
    loadEvents();
    window.location.href = `/events/${id}`;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
    };
    
    const labels = {
      published: 'Publicado',
      draft: 'Borrador',
      cancelled: 'Cancelado'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status as keyof typeof styles] || styles.draft}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Mis Eventos</h1>
        <Button onClick={() => setShowForm(!showForm)} size="sm" className="md:size-default">
          {showForm ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Crear Evento
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <CreateEventFormMVP onSuccess={handleEventCreated} />
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Cargando eventos...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="space-y-4">
          {events.map(event => (
            <Link key={event.id} to={`/events/${event.id}`}>
              <Card className="p-4 hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg md:text-xl font-semibold">{event.title}</h3>
                  {getStatusBadge(event.status)}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                      {new Date(event.start_datetime).toLocaleDateString('es-CO', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 flex-shrink-0" />
                    <span>{event.capacity} personas</span>
                  </div>
                  {event.metadata?.venue_name && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{event.metadata.venue_name}</span>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">
            {showForm ? 'Completa el formulario arriba para crear tu primer evento' : 'No tienes eventos todavía'}
          </p>
          {!showForm && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear tu Primer Evento
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}

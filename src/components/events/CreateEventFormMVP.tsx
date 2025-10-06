import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const eventSchema = z.object({
  title: z.string()
    .trim()
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  start_datetime: z.string()
    .min(1, 'Fecha requerida'),
  capacity: z.number()
    .min(10, 'Mínimo 10 personas')
    .max(10000, 'Máximo 10,000 personas'),
  venue_name: z.string()
    .trim()
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres')
});

type EventFormData = z.infer<typeof eventSchema>;

interface CreateEventFormMVPProps {
  onSuccess?: (id: string) => void;
}

export function CreateEventFormMVP({ onSuccess }: CreateEventFormMVPProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema)
  });

  const onSubmit = async (data: EventFormData) => {
    setLoading(true);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, organization_id')
        .single();

      if (profileError || !profile) {
        throw new Error('Debes estar autenticado para crear eventos');
      }

      const endDatetime = new Date(data.start_datetime);
      endDatetime.setHours(endDatetime.getHours() + 4);

      const slug = data.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        + '-' + Date.now();

      const { data: event, error } = await supabase
        .from('events')
        .insert({
          title: data.title.trim(),
          start_datetime: data.start_datetime,
          end_datetime: endDatetime.toISOString(),
          capacity: data.capacity,
          status: 'draft',
          organizer_id: profile.id,
          organization_id: profile.organization_id,
          slug,
          metadata: { venue_name: data.venue_name.trim() }
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Evento Creado',
        description: 'Ahora puedes generar recomendaciones con IA'
      });

      onSuccess?.(event.id);
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo crear el evento',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Crear Nuevo Evento</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="title">Nombre del Evento *</Label>
          <Input 
            id="title" 
            {...register('title')} 
            placeholder="Ej: Desfile Primavera 2025"
            maxLength={100}
          />
          {errors.title && (
            <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="start_datetime">Fecha y Hora *</Label>
          <Input 
            id="start_datetime" 
            type="datetime-local" 
            {...register('start_datetime')} 
          />
          {errors.start_datetime && (
            <p className="text-sm text-destructive mt-1">{errors.start_datetime.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="capacity">Capacidad *</Label>
          <Input 
            id="capacity" 
            type="number" 
            {...register('capacity', { valueAsNumber: true })} 
            placeholder="100"
            min="10"
            max="10000"
          />
          {errors.capacity && (
            <p className="text-sm text-destructive mt-1">{errors.capacity.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="venue_name">Lugar *</Label>
          <Input 
            id="venue_name" 
            {...register('venue_name')} 
            placeholder="Ej: Centro de Eventos Andino"
            maxLength={100}
          />
          {errors.venue_name && (
            <p className="text-sm text-destructive mt-1">{errors.venue_name.message}</p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creando...' : 'Crear Evento'}
        </Button>
      </form>
    </Card>
  );
}

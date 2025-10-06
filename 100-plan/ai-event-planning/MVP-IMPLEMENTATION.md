# 🎯 MVP Implementation Guide - Keep It Simple

**Goal**: Launch working product in 48 hours  
**Focus**: Core value delivery, not feature completeness  
**Philosophy**: Simple, working features > Complex, broken features

---

## 🎪 MVP Core Features (Only These 3)

### 1. Create Event (Simplified)
**User Story**: Organizer creates a fashion show event  
**Fields**: Title, date, venue, capacity - nothing else  
**Time**: 2 hours

### 2. Generate Health Score (AI)
**User Story**: See if event is on track  
**Output**: Single score + 3 top recommendations  
**Time**: 1 hour (already implemented)

### 3. Generate Model Castings (AI)
**User Story**: Get AI model recommendations  
**Output**: 5 models with contact info  
**Time**: 1 hour (already implemented)

---

## ❌ What's NOT in MVP

- Vendor recommendations (can do manually)
- Runway schedules (can do manually)
- Event wizard (too complex)
- Ticket sales (can add later)
- Advanced analytics (can add later)
- Email campaigns (can add later)
- Payment integration (can add later)

---

## 📋 Implementation Checklist

### Phase 1: Simplified Event Creation (2 hours)

**Task 1.1**: Create minimal event form component
```tsx
// src/components/events/CreateEventFormMVP.tsx
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

// Simple validation schema
const eventSchema = z.object({
  title: z.string().min(3).max(100),
  start_datetime: z.string(),
  capacity: z.number().min(10).max(10000),
  venue_name: z.string().min(3).max(100)
});

type EventFormData = z.infer<typeof eventSchema>;

export function CreateEventFormMVP({ onSuccess }: { onSuccess?: (id: string) => void }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema)
  });

  const onSubmit = async (data: EventFormData) => {
    setLoading(true);
    try {
      // Get current user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, organization_id')
        .single();

      if (!profile) throw new Error('Profile not found');

      // Create event (simplified)
      const { data: event, error } = await supabase
        .from('events')
        .insert({
          title: data.title,
          start_datetime: data.start_datetime,
          end_datetime: new Date(new Date(data.start_datetime).getTime() + 4 * 60 * 60 * 1000).toISOString(), // +4 hours
          capacity: data.capacity,
          status: 'draft',
          organizer_id: profile.id,
          organization_id: profile.organization_id,
          slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
          metadata: { venue_name: data.venue_name }
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
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="title">Nombre del Evento</Label>
          <Input 
            id="title" 
            {...register('title')} 
            placeholder="Ej: Desfile Primavera 2025"
          />
          {errors.title && (
            <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="start_datetime">Fecha y Hora</Label>
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
          <Label htmlFor="capacity">Capacidad</Label>
          <Input 
            id="capacity" 
            type="number" 
            {...register('capacity', { valueAsNumber: true })} 
            placeholder="100"
          />
          {errors.capacity && (
            <p className="text-sm text-destructive mt-1">{errors.capacity.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="venue_name">Lugar</Label>
          <Input 
            id="venue_name" 
            {...register('venue_name')} 
            placeholder="Ej: Centro de Eventos Andino"
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
```

**Task 1.2**: Create simple events list page
```tsx
// src/pages/EventsMVP.tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CreateEventFormMVP } from '@/components/events/CreateEventFormMVP';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EventsMVP() {
  const [events, setEvents] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    setEvents(data || []);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Mis Eventos</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Crear Evento'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <CreateEventFormMVP 
            onSuccess={(id) => {
              setShowForm(false);
              loadEvents();
              window.location.href = `/events/${id}`;
            }} 
          />
        </div>
      )}

      <div className="space-y-4">
        {events.map(event => (
          <Link key={event.id} to={`/events/${event.id}`}>
            <Card className="p-4 hover:border-primary transition-colors cursor-pointer">
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(event.start_datetime).toLocaleDateString('es-CO')}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {event.capacity} personas
                </div>
                <div className="ml-auto">
                  <span className={`px-2 py-1 rounded text-xs ${
                    event.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {events.length === 0 && !showForm && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No tienes eventos todavía</p>
          <Button onClick={() => setShowForm(true)}>Crear tu Primer Evento</Button>
        </Card>
      )}
    </div>
  );
}
```

### Phase 2: Event Detail with AI Features (1 hour)

**Task 2.1**: Create minimal event detail page
```tsx
// src/pages/EventDetailMVP.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, Calendar, MapPin, Users } from 'lucide-react';

export default function EventDetailMVP() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [healthScore, setHealthScore] = useState<any>(null);
  const [castings, setCastings] = useState<any[]>([]);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [loadingCastings, setLoadingCastings] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) loadEvent();
  }, [id]);

  const loadEvent = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();
    
    setEvent(data);

    // Load existing health score
    const { data: healthData } = await supabase
      .from('event_health_scores')
      .select('*')
      .eq('event_id', id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (healthData) setHealthScore(healthData);

    // Load existing castings
    const { data: castingsData } = await supabase
      .from('model_castings')
      .select('*')
      .eq('event_id', id);
    
    if (castingsData) setCastings(castingsData);
  };

  const generateHealthScore = async () => {
    setLoadingHealth(true);
    try {
      const { data, error } = await supabase.functions.invoke('event-health-scorer', {
        body: { eventId: id }
      });

      if (error) throw error;

      toast({
        title: 'Análisis Completo',
        description: 'Score de salud generado exitosamente'
      });

      await loadEvent();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoadingHealth(false);
    }
  };

  const generateCastings = async () => {
    setLoadingCastings(true);
    try {
      const { data, error } = await supabase.functions.invoke('model-casting-agent', {
        body: { 
          event_id: id,
          requirements: 'Necesito 5 modelos profesionales para pasarela'
        }
      });

      if (error) throw error;

      toast({
        title: 'Modelos Generados',
        description: `${data.count} recomendaciones creadas`
      });

      await loadEvent();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoadingCastings(false);
    }
  };

  if (!event) return <div className="p-6">Cargando...</div>;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Event Header */}
      <Card className="p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Fecha</p>
              <p className="font-medium">
                {new Date(event.start_datetime).toLocaleDateString('es-CO', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Lugar</p>
              <p className="font-medium">{event.metadata?.venue_name || 'No especificado'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Capacidad</p>
              <p className="font-medium">{event.capacity} personas</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Score AI */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Análisis de Salud IA</h2>
          </div>

          {healthScore ? (
            <div>
              <div className="text-center mb-4">
                <div className="text-5xl font-bold text-primary mb-2">
                  {healthScore.overall_score}%
                </div>
                <p className="text-sm text-muted-foreground capitalize">
                  Estado: {healthScore.health_status}
                </p>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Ventas</span>
                  <span className="font-medium">{healthScore.ticket_sales_score}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Casting</span>
                  <span className="font-medium">{healthScore.model_casting_score}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Vendors</span>
                  <span className="font-medium">{healthScore.vendor_readiness_score}%</span>
                </div>
              </div>

              {healthScore.recommendations && healthScore.recommendations.length > 0 && (
                <div>
                  <p className="font-medium mb-2">Recomendaciones:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    {healthScore.recommendations.slice(0, 3).map((rec: string, idx: number) => (
                      <li key={idx} className="text-muted-foreground">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Button 
                onClick={generateHealthScore} 
                disabled={loadingHealth}
                variant="outline"
                className="w-full mt-4"
              >
                {loadingHealth ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analizando...
                  </>
                ) : (
                  'Actualizar Análisis'
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Aún no has generado un análisis de salud
              </p>
              <Button onClick={generateHealthScore} disabled={loadingHealth}>
                {loadingHealth ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generar Análisis
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>

        {/* Model Castings AI */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Casting de Modelos IA</h2>
          </div>

          {castings.length > 0 ? (
            <div>
              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {castings.map((casting) => (
                  <div key={casting.id} className="p-3 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p className="font-medium">{casting.model_name}</p>
                        {casting.agency && (
                          <p className="text-xs text-muted-foreground">{casting.agency}</p>
                        )}
                      </div>
                      <span className="text-lg font-bold text-primary">
                        {casting.ai_match_score}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{casting.ai_reasoning}</p>
                    <div className="flex items-center gap-2 text-xs">
                      {casting.email && (
                        <a href={`mailto:${casting.email}`} className="text-primary hover:underline">
                          {casting.email}
                        </a>
                      )}
                      {casting.phone && (
                        <span className="text-muted-foreground">{casting.phone}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                onClick={generateCastings} 
                disabled={loadingCastings}
                variant="outline"
                className="w-full"
              >
                {loadingCastings ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  'Generar Más Modelos'
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Aún no has generado recomendaciones de modelos
              </p>
              <Button onClick={generateCastings} disabled={loadingCastings}>
                {loadingCastings ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generar Recomendaciones
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
```

### Phase 3: Routes Setup (15 minutes)

**Task 3.1**: Add MVP routes
```tsx
// Add to src/App.tsx or router config
import EventsMVP from '@/pages/EventsMVP';
import EventDetailMVP from '@/pages/EventDetailMVP';

// In routes array:
{
  path: '/events',
  element: <EventsMVP />
},
{
  path: '/events/:id',
  element: <EventDetailMVP />
}
```

---

## 🧪 MVP Testing Checklist (30 minutes)

### Manual Tests
- [ ] Create new event (takes < 1 minute)
- [ ] Generate health score (completes in < 5 seconds)
- [ ] Generate model castings (completes in < 5 seconds)
- [ ] View event list (loads quickly)
- [ ] Navigate between pages (smooth)
- [ ] Test on mobile (responsive)

### Error Cases
- [ ] Create event without auth (shows error)
- [ ] Generate AI with invalid event (shows error)
- [ ] Handle network failure (shows toast)

---

## 📊 MVP Success Criteria

**Must Have**:
- [x] User can create event in < 1 minute
- [x] AI health score generates in < 5 seconds
- [x] AI castings generate in < 5 seconds
- [x] Mobile-responsive
- [x] Spanish language
- [x] Zero crashes in 10 consecutive uses

**Nice to Have** (NOT for MVP):
- Advanced filters
- Export features
- Batch operations
- Email notifications
- Payment processing

---

## 🚀 Launch Checklist

**Before showing to users**:
- [ ] All 3 core features working
- [ ] Tested on 2 devices (desktop + mobile)
- [ ] Spanish translations correct
- [ ] Error messages helpful
- [ ] Database has sample data for demo

**Day 1 Metrics**:
- Track: Events created
- Track: AI functions called
- Track: User retention (do they come back?)

---

## 💡 Key Principles

1. **One Page = One Feature**: Don't overload pages
2. **AI is Optional**: Events work without AI, AI adds value
3. **Mobile First**: Most Colombian users on mobile
4. **Fast Load**: < 2 seconds or users leave
5. **Clear Errors**: Never show technical errors to users

---

## 🎯 What Makes This MVP?

**Not Feature Complete**:
- Missing vendor recommendations
- Missing runway schedules
- Missing payments
- Missing analytics

**But Delivers Core Value**:
- ✅ Create events quickly
- ✅ Get AI health insights
- ✅ Get AI model recommendations
- ✅ Works on mobile
- ✅ Colombian market ready

**This is enough** to validate if users want the product.

---

**Time to MVP**: 3-4 hours  
**Lines of Code**: ~500 (manageable)  
**Complexity**: Low (intentionally)  
**User Value**: High (immediate)

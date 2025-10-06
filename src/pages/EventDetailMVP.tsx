import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, Calendar, MapPin, Users, ArrowLeft } from 'lucide-react';

export default function EventDetailMVP() {
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [healthScore, setHealthScore] = useState<any>(null);
  const [castings, setCastings] = useState<any[]>([]);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [loadingCastings, setLoadingCastings] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
      
      if (eventError) throw eventError;
      setEvent(eventData);

      const { data: healthData } = await supabase
        .from('event_health_scores')
        .select('*')
        .eq('event_id', id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (healthData) setHealthScore(healthData);

      const { data: castingsData } = await supabase
        .from('model_castings')
        .select('*')
        .eq('event_id', id)
        .order('ai_match_score', { ascending: false });
      
      if (castingsData) setCastings(castingsData);
    } catch (error: any) {
      console.error('Error loading event:', error);
      toast({
        title: 'Error',
        description: 'No se pudo cargar el evento',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateHealthScore = async () => {
    setLoadingHealth(true);
    try {
      const { data, error } = await supabase.functions.invoke('event-health-scorer', {
        body: { eventId: id }
      });

      if (error) {
        if (error.message?.includes('Rate limit')) {
          throw new Error('Límite de uso alcanzado. Espera un minuto e intenta nuevamente.');
        }
        if (error.message?.includes('credits')) {
          throw new Error('Créditos de IA agotados. Contacta soporte.');
        }
        throw error;
      }

      toast({
        title: 'Análisis Completo',
        description: 'Score de salud generado exitosamente'
      });

      await loadEvent();
    } catch (error: any) {
      console.error('Error generating health score:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo generar el análisis',
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
          requirements: 'Necesito 5 modelos profesionales para pasarela de moda'
        }
      });

      if (error) {
        if (error.message?.includes('Rate limit')) {
          throw new Error('Límite de uso alcanzado. Espera un minuto e intenta nuevamente.');
        }
        if (error.message?.includes('credits')) {
          throw new Error('Créditos de IA agotados. Contacta soporte.');
        }
        throw error;
      }

      toast({
        title: 'Modelos Generados',
        description: `${data.count || data.recommendations?.length || 0} recomendaciones creadas`
      });

      await loadEvent();
    } catch (error: any) {
      console.error('Error generating castings:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo generar recomendaciones',
        variant: 'destructive'
      });
    } finally {
      setLoadingCastings(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-muted-foreground">Evento no encontrado</p>
        <Link to="/events">
          <Button className="mt-4">Volver a Eventos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-6xl">
      <Link to="/events">
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </Link>

      <Card className="p-4 md:p-6 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{event.title}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
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
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Lugar</p>
              <p className="font-medium">{event.metadata?.venue_name || 'No especificado'}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Users className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Capacidad</p>
              <p className="font-medium">{event.capacity} personas</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Score AI */}
        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg md:text-xl font-semibold">Análisis de Salud IA</h2>
          </div>

          {healthScore ? (
            <div>
              <div className="text-center mb-4">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
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
                <div className="mb-4">
                  <p className="font-medium mb-2 text-sm">Recomendaciones:</p>
                  <ul className="text-sm space-y-1">
                    {healthScore.recommendations.slice(0, 3).map((rec: string, idx: number) => (
                      <li key={idx} className="text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button 
                onClick={generateHealthScore} 
                disabled={loadingHealth}
                variant="outline"
                className="w-full"
                size="sm"
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
              <p className="text-sm text-muted-foreground mb-4">
                Genera un análisis de salud del evento usando IA
              </p>
              <Button onClick={generateHealthScore} disabled={loadingHealth} size="sm">
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
        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg md:text-xl font-semibold">Casting de Modelos IA</h2>
          </div>

          {castings.length > 0 ? (
            <div>
              <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {castings.map((casting) => (
                  <div key={casting.id} className="p-3 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{casting.model_name}</p>
                        {casting.agency && (
                          <p className="text-xs text-muted-foreground">{casting.agency}</p>
                        )}
                      </div>
                      <span className="text-lg font-bold text-primary ml-2">
                        {casting.ai_match_score}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{casting.ai_reasoning}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs">
                      {casting.email && (
                        <a href={`mailto:${casting.email}`} className="text-primary hover:underline truncate">
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
                size="sm"
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
              <p className="text-sm text-muted-foreground mb-4">
                Genera recomendaciones de modelos usando IA
              </p>
              <Button onClick={generateCastings} disabled={loadingCastings} size="sm">
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

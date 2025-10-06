import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2, Mail, Phone, Building2 } from 'lucide-react';

interface ModelRecommendation {
  model_name: string;
  agency?: string;
  email: string;
  phone?: string;
  match_score: number;
  reasoning: string;
  contact_priority: 'high' | 'medium' | 'low';
}

interface AIModelCastingPanelProps {
  eventId: string;
}

export function AIModelCastingPanel({ eventId }: AIModelCastingPanelProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ModelRecommendation[]>([]);
  const { toast } = useToast();

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('model-casting-agent', {
        body: {
          event_id: eventId,
          requirements: 'Professional runway models for Colombian fashion show, 175cm+, experienced'
        }
      });

      if (error) {
        if (error.message?.includes('Rate limit')) {
          toast({
            title: 'Límite de Uso Alcanzado',
            description: 'Por favor espera un minuto e intenta nuevamente.',
            variant: 'destructive'
          });
          return;
        }
        if (error.message?.includes('credits')) {
          toast({
            title: 'Créditos de IA Agotados',
            description: 'Por favor agrega créditos para continuar.',
            variant: 'destructive'
          });
          return;
        }
        throw error;
      }

      setResults(data.recommendations);
      toast({
        title: 'Recomendaciones Generadas',
        description: `${data.recommendations.length} modelos sugeridas`
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo generar recomendaciones',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-amber-600 dark:text-amber-400';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta Prioridad';
      case 'medium': return 'Media Prioridad';
      default: return 'Baja Prioridad';
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Asistente IA - Casting de Modelos
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Button 
          onClick={generateRecommendations}
          disabled={loading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {loading ? (
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

        {results.length > 0 && (
          <div className="space-y-3 mt-6">
            <h4 className="text-sm font-medium text-foreground">
              Modelos Recomendadas ({results.length})
            </h4>
            {results.map((model, idx) => (
              <Card 
                key={idx}
                className="border-border bg-card hover:bg-accent transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="font-semibold text-foreground">
                        {model.model_name}
                      </h5>
                      {model.agency && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Building2 className="h-3 w-3" />
                          {model.agency}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {model.match_score}%
                      </div>
                      <div className={`text-xs font-medium ${getPriorityColor(model.contact_priority)}`}>
                        {getPriorityLabel(model.contact_priority)}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {model.reasoning}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Mail className="h-3 w-3 mr-1" />
                      {model.email}
                    </Badge>
                    {model.phone && (
                      <Badge variant="outline" className="text-xs">
                        <Phone className="h-3 w-3 mr-1" />
                        {model.phone}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2, Mail, Phone } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

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
  const [requirements, setRequirements] = useState('Need 5-8 runway models, 175cm+, professional experience preferred');
  const [results, setResults] = useState<ModelRecommendation[]>([]);
  const { toast } = useToast();

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('model-casting-agent', {
        body: {
          event_id: eventId,
          requirements
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
      case 'high': return 'bg-primary text-primary-foreground';
      case 'medium': return 'bg-secondary text-secondary-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta Prioridad';
      case 'medium': return 'Media Prioridad';
      case 'low': return 'Baja Prioridad';
      default: return priority;
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Sparkles className="h-5 w-5 text-primary" />
          Asistente IA - Casting
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Requisitos del Casting
          </label>
          <Textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="Describe los requisitos para los modelos..."
            className="min-h-[100px] bg-background border-border"
            disabled={loading}
          />
        </div>

        <Button 
          onClick={generateRecommendations}
          disabled={loading || !requirements.trim()}
          className="w-full"
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
            <h3 className="text-sm font-medium text-foreground">
              Modelos Recomendadas ({results.length})
            </h3>
            {results.map((model, idx) => (
              <Card 
                key={idx}
                className="p-4 border-border bg-background"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium text-foreground">{model.model_name}</h4>
                      {model.agency && (
                        <p className="text-sm text-muted-foreground">{model.agency}</p>
                      )}
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-2xl font-bold text-primary">
                        {model.match_score}%
                      </div>
                      <Badge className={getPriorityColor(model.contact_priority)}>
                        {getPriorityLabel(model.contact_priority)}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-foreground">{model.reasoning}</p>

                  <div className="flex gap-2 pt-2 border-t border-border">
                    <a 
                      href={`mailto:${model.email}`}
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <Mail className="h-3 w-3" />
                      {model.email}
                    </a>
                    {model.phone && (
                      <a 
                        href={`https://wa.me/${model.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Phone className="h-3 w-3" />
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

# FashionOS AI - UI Integration Guide

How to add AI panels to dashboards and integrate with existing components.

---

## Design Principles

1. **Breef-inspired:** Clean, minimal, luxury aesthetic
2. **Mobile-first:** Touch-friendly, stacks vertically
3. **Spanish default:** Colombian Spanish (es-CO) as primary language
4. **Loading states:** Always show spinners during AI operations
5. **Error handling:** User-friendly Spanish error messages
6. **Accessibility:** WCAG 2.1 AA compliant

---

## Component Pattern

### Base AI Panel Structure

```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, Loader2 } from 'lucide-react';

interface AIResult {
  // Define based on agent output schema
}

export function AIPanel({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AIResult[]>([]);
  const { toast } = useToast();

  const generateResults = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('agent-name', {
        body: { event_id: eventId }
      });

      if (error) {
        handleError(error);
        return;
      }

      setResults(data.results);
      toast({
        title: 'Éxito',
        description: `${data.results.length} resultados generados`
      });
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

  const handleError = (error: any) => {
    if (error.message?.includes('Rate limit')) {
      toast({
        title: 'Límite Alcanzado',
        description: 'Espera un minuto e intenta nuevamente.',
        variant: 'destructive'
      });
      return;
    }
    if (error.message?.includes('credits')) {
      toast({
        title: 'Créditos Agotados',
        description: 'Agrega créditos para continuar.',
        variant: 'destructive'
      });
      return;
    }
    throw error;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Título del Panel</h3>
      </div>
      
      <Button 
        onClick={generateResults}
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generando...
          </>
        ) : (
          'Generar Resultados'
        )}
      </Button>

      {results.length > 0 && (
        <div className="mt-6 space-y-4">
          {results.map((result, idx) => (
            <ResultCard key={idx} result={result} />
          ))}
        </div>
      )}
    </Card>
  );
}
```

---

## Dashboard Layout Patterns

### Sidebar + Main Content

```tsx
// src/pages/EventDetail.tsx
<div className="container mx-auto px-4 py-8">
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* AI Sidebar */}
    <aside className="lg:col-span-1 space-y-6">
      <AIModelCastingPanel eventId={eventId} />
      <AIVendorCoordinatorPanel eventId={eventId} />
      <AIEventHealthPanel eventId={eventId} />
    </aside>
    
    {/* Main Content */}
    <main className="lg:col-span-2">
      <EventDetails event={event} />
    </main>
  </div>
</div>
```

### Tabs + AI Actions

```tsx
// src/pages/Dashboard.tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Resumen</TabsTrigger>
    <TabsTrigger value="ai-tools">Herramientas IA</TabsTrigger>
    <TabsTrigger value="analytics">Analítica</TabsTrigger>
  </TabsList>
  
  <TabsContent value="ai-tools">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <AIModelCastingPanel eventId={eventId} />
      <AIRunwayTimingPanel eventId={eventId} />
      <AIVendorCoordinatorPanel eventId={eventId} />
      <AIEventHealthPanel eventId={eventId} />
    </div>
  </TabsContent>
</Tabs>
```

---

## Result Card Patterns

### Match Score Card

```tsx
function ModelRecommendationCard({ model }: { model: ModelRecommendation }) {
  return (
    <div className="p-4 rounded-lg border border-border bg-card">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-medium">{model.model_name}</h4>
          {model.agency && (
            <p className="text-sm text-muted-foreground">{model.agency}</p>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            {model.match_score}%
          </div>
          <Badge variant={getPriorityVariant(model.contact_priority)}>
            {model.contact_priority === 'high' ? 'Alta' : 
             model.contact_priority === 'medium' ? 'Media' : 'Baja'}
          </Badge>
        </div>
      </div>
      <p className="text-sm text-foreground">{model.reasoning}</p>
      <div className="mt-4 flex gap-2">
        <Button size="sm" variant="outline">
          <Mail className="h-4 w-4 mr-2" />
          Contactar
        </Button>
        <Button size="sm" variant="ghost">
          <MessageSquare className="h-4 w-4 mr-2" />
          WhatsApp
        </Button>
      </div>
    </div>
  );
}
```

### Health Score Card

```tsx
function EventHealthCard({ health }: { health: EventHealth }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="p-6">
      <div className="text-center mb-4">
        <div className={`text-5xl font-bold ${getScoreColor(health.overall_score)}`}>
          {health.overall_score}
        </div>
        <p className="text-sm text-muted-foreground">Salud del Evento</p>
      </div>
      
      <div className="space-y-3">
        <ScoreBar label="Tickets" score={health.ticket_score} />
        <ScoreBar label="Timeline" score={health.timeline_score} />
        <ScoreBar label="Vendors" score={health.vendor_score} />
        <ScoreBar label="Models" score={health.model_score} />
      </div>
      
      {health.risk_factors.length > 0 && (
        <Alert variant="warning" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Riesgos Detectados</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside">
              {health.risk_factors.map((risk, idx) => (
                <li key={idx}>{risk}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </Card>
  );
}
```

---

## Loading States

### Skeleton Loader

```tsx
function AISkeletonLoader() {
  return (
    <Card className="p-6">
      <Skeleton className="h-6 w-48 mb-4" />
      <Skeleton className="h-10 w-full mb-6" />
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </Card>
  );
}
```

### Inline Spinner

```tsx
{loading && (
  <div className="flex items-center justify-center py-8">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2 text-muted-foreground">Generando resultados...</span>
  </div>
)}
```

---

## Empty States

### No Results Yet

```tsx
function EmptyState() {
  return (
    <div className="text-center py-12">
      <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">No hay resultados aún</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Genera recomendaciones con IA para comenzar
      </p>
      <Button>Generar Ahora</Button>
    </div>
  );
}
```

---

## Responsive Design

### Mobile Breakpoints

```tsx
// Stack vertically on mobile
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards auto-stack on mobile */}
</div>

// Sidebar becomes full-width on mobile
<aside className="lg:col-span-1">
  {/* 100% width on mobile, 1/3 on desktop */}
</aside>

// Hide secondary actions on mobile
<div className="hidden md:flex gap-2">
  <Button>Secondary Action</Button>
</div>
```

---

## Accessibility

### Keyboard Navigation

```tsx
<Button 
  onClick={handleGenerate}
  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
  aria-label="Generar recomendaciones de modelos con IA"
>
  Generar
</Button>
```

### Screen Reader Support

```tsx
<div role="status" aria-live="polite">
  {loading && <span className="sr-only">Generando resultados...</span>}
  {results.length > 0 && (
    <span className="sr-only">
      {results.length} resultados generados
    </span>
  )}
</div>
```

---

## Best Practices

1. **Always show loading states** - Users should never wonder if something is happening
2. **Graceful error handling** - Explain what went wrong and how to fix it
3. **Mobile-first design** - 70%+ of Colombian users are on mobile
4. **Spanish-first content** - Colombian Spanish is the default
5. **Debounce AI calls** - Prevent accidental duplicate calls (1 call per minute)
6. **Log everything** - Use ai_agent_logs for debugging
7. **Test on real devices** - Desktop, tablet, and mobile
8. **Use semantic HTML** - Proper heading hierarchy, ARIA labels

---

**Version:** 1.0  
**Last Updated:** January 2025

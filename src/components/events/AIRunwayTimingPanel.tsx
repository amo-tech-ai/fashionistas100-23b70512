import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Clock, Users, Sparkles, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Designer {
  name: string;
  looks_count: number;
}

interface DesignerSlot {
  designer_name: string;
  slot_start: string;
  slot_end: string;
  looks_count: number;
  backstage_time: string;
}

interface Schedule {
  id: string;
  schedule_name: string;
  total_duration_minutes: number;
  designers: DesignerSlot[];
  transitions: any[];
  backstage_calls: any[];
  ai_optimization_score: number;
  ai_reasoning: string;
  status: string;
}

export function AIRunwayTimingPanel({ eventId }: { eventId: string }) {
  const [designers, setDesigners] = useState<Designer[]>([{ name: "", looks_count: 8 }]);
  const [bufferTime, setBufferTime] = useState(5);
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const { toast } = useToast();

  const addDesigner = () => {
    setDesigners([...designers, { name: "", looks_count: 8 }]);
  };

  const removeDesigner = (index: number) => {
    setDesigners(designers.filter((_, i) => i !== index));
  };

  const updateDesigner = (index: number, field: keyof Designer, value: string | number) => {
    const updated = [...designers];
    updated[index] = { ...updated[index], [field]: value };
    setDesigners(updated);
  };

  const generateSchedule = async () => {
    const validDesigners = designers.filter(d => d.name.trim() !== "" && d.looks_count > 0);
    
    if (validDesigners.length === 0) {
      toast({
        title: "Error",
        description: "Agrega al menos un diseñador con nombre y cantidad de looks",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setSchedule(null);

    try {
      const { data, error } = await supabase.functions.invoke("runway-timing-agent", {
        body: {
          event_id: eventId,
          designers: validDesigners,
          buffer_time: bufferTime
        }
      });

      if (error) throw error;

      if (data?.error === "rate_limit") {
        toast({
          title: "Límite alcanzado",
          description: data.message,
          variant: "destructive"
        });
        return;
      }

      if (data?.error === "credits_exhausted") {
        toast({
          title: "Créditos agotados",
          description: data.message,
          variant: "destructive"
        });
        return;
      }

      if (data?.success && data?.schedule) {
        setSchedule(data.schedule);
        toast({
          title: "Horario generado",
          description: `Schedule optimizado con score de ${data.schedule.ai_optimization_score}/100`
        });
      }
    } catch (error) {
      console.error("Error generating schedule:", error);
      toast({
        title: "Error",
        description: "No se pudo generar el horario. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-background border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Runway Timing</h3>
            <p className="text-sm text-muted-foreground">Genera horarios optimizados automáticamente</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-foreground mb-2">Diseñadores</Label>
            {designers.map((designer, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  placeholder="Nombre del diseñador"
                  value={designer.name}
                  onChange={(e) => updateDesigner(index, "name", e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="number"
                  placeholder="Looks"
                  value={designer.looks_count}
                  onChange={(e) => updateDesigner(index, "looks_count", parseInt(e.target.value) || 0)}
                  className="w-24"
                  min={1}
                />
                {designers.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDesigner(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addDesigner}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar diseñador
            </Button>
          </div>

          <div>
            <Label htmlFor="buffer-time" className="text-foreground">
              Tiempo de transición (minutos)
            </Label>
            <Input
              id="buffer-time"
              type="number"
              value={bufferTime}
              onChange={(e) => setBufferTime(parseInt(e.target.value) || 5)}
              min={1}
              max={15}
              className="mt-1"
            />
          </div>

          <Button
            onClick={generateSchedule}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando horario...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generar Horario AI
              </>
            )}
          </Button>
        </div>
      </Card>

      {schedule && (
        <Card className="p-6 bg-background border-border">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-foreground">{schedule.schedule_name}</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Score:</span>
                <span className="text-lg font-bold text-primary">{schedule.ai_optimization_score}/100</span>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-foreground">
                <strong>Duración total:</strong> {schedule.total_duration_minutes} minutos
              </p>
              <p className="text-sm text-muted-foreground mt-2">{schedule.ai_reasoning}</p>
            </div>

            <div className="space-y-3">
              <h5 className="font-medium text-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Horarios por diseñador
              </h5>
              {schedule.designers.map((slot, idx) => (
                <div key={idx} className="p-4 bg-card border border-border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{slot.designer_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {slot.looks_count} looks
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        {slot.slot_start} - {slot.slot_end}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Backstage: {slot.backstage_time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {schedule.backstage_calls && schedule.backstage_calls.length > 0 && (
              <div className="space-y-3">
                <h5 className="font-medium text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Llamadas backstage
                </h5>
                {schedule.backstage_calls.map((call: any, idx: number) => (
                  <div key={idx} className="p-3 bg-muted/30 rounded border-l-4 border-primary">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm text-foreground">{call.designer}</p>
                      <p className="text-sm text-muted-foreground">{call.call_time}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{call.notes}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

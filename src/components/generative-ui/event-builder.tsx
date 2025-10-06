import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EventBuilderProps {
  status?: string;
  initialData?: Partial<EventData>;
  onComplete: (data: EventData) => void;
  onValidate?: (data: Partial<EventData>) => { valid: boolean; errors?: string[] };
  onChange?: (data: Partial<EventData>) => void;
}

interface EventData {
  title: string;
  type: string;
  date: string;
  startTime: string;
  endTime?: string;
  timezone?: string;
  description?: string;
}

export function EventBuilder({ 
  status, 
  initialData = {}, 
  onComplete, 
  onValidate,
  onChange 
}: EventBuilderProps) {
  const [formData, setFormData] = useState<Partial<EventData>>(initialData);
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (field: keyof EventData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange?.(updated);
    
    const validation = onValidate?.(updated);
    if (validation) {
      setErrors(validation.errors || []);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = onValidate?.(formData);
    
    if (validation?.valid && formData.title && formData.type && formData.date && formData.startTime) {
      onComplete(formData as EventData);
    } else {
      setErrors(validation?.errors || ["Please fill required fields"]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-foreground mb-2">Event Details</h2>
        <p className="text-sm text-muted-foreground">Configure your fashion event</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Event Title *</Label>
          <Input
            id="title"
            value={formData.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Spring Collection 2025"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date || ""}
              onChange={(e) => handleChange("date", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time *</Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime || ""}
              onChange={(e) => handleChange("startTime", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              type="time"
              value={formData.endTime || ""}
              onChange={(e) => handleChange("endTime", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Input
              id="timezone"
              value={formData.timezone || "America/Bogota"}
              onChange={(e) => handleChange("timezone", e.target.value)}
              placeholder="America/Bogota"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Tell us about your event..."
            rows={4}
          />
        </div>

        {errors.length > 0 && (
          <div className="text-sm text-destructive space-y-1">
            {errors.map((error, i) => <p key={i}>{error}</p>)}
          </div>
        )}

        <Button type="submit" className="w-full">
          Continue to Tickets
        </Button>
      </form>

      {status && (
        <p className="text-xs text-muted-foreground text-center">Status: {status}</p>
      )}
    </div>
  );
}

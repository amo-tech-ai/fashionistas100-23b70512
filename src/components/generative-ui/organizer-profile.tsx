import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface OrganizerProfileProps {
  status?: string;
  onSubmit?: (data: OrganizerData) => void;
  onSkip?: () => void;
  onValidate?: (data: Partial<OrganizerData>) => { valid: boolean; errors?: string[] };
  onChange?: (data: Partial<OrganizerData>) => void;
}

interface OrganizerData {
  name: string;
  email: string;
  organization?: string;
  role: "organizer" | "designer" | "brand" | "agency";
  experience?: "first_time" | "occasional" | "professional";
}

export function OrganizerProfile({ 
  status, 
  onSubmit, 
  onSkip, 
  onValidate,
  onChange 
}: OrganizerProfileProps) {
  const [formData, setFormData] = useState<Partial<OrganizerData>>({});
  const [errors, setErrors] = useState<string[]>([]);

  const handleChange = (field: keyof OrganizerData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    onChange?.(updated);
    
    // Validate on change
    const validation = onValidate?.(updated);
    if (validation) {
      setErrors(validation.errors || []);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = onValidate?.(formData);
    
    if (validation?.valid && formData.name && formData.email && formData.role) {
      onSubmit?.(formData as OrganizerData);
    } else {
      setErrors(validation?.errors || ["Please fill required fields"]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-foreground mb-2">Organizer Profile</h2>
        <p className="text-sm text-muted-foreground">Tell us about yourself to get started</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="organization">Organization (Optional)</Label>
          <Input
            id="organization"
            value={formData.organization || ""}
            onChange={(e) => handleChange("organization", e.target.value)}
            placeholder="Your company or brand"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="organizer">Event Organizer</SelectItem>
              <SelectItem value="designer">Fashion Designer</SelectItem>
              <SelectItem value="brand">Brand Representative</SelectItem>
              <SelectItem value="agency">Agency</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Experience Level</Label>
          <Select value={formData.experience} onValueChange={(value) => handleChange("experience", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="first_time">First Time Organizer</SelectItem>
              <SelectItem value="occasional">Occasional Events</SelectItem>
              <SelectItem value="professional">Professional Organizer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {errors.length > 0 && (
          <div className="text-sm text-destructive space-y-1">
            {errors.map((error, i) => <p key={i}>{error}</p>)}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            Continue
          </Button>
          {onSkip && (
            <Button type="button" variant="outline" onClick={onSkip}>
              Skip
            </Button>
          )}
        </div>
      </form>

      {status && (
        <p className="text-xs text-muted-foreground text-center">Status: {status}</p>
      )}
    </div>
  );
}

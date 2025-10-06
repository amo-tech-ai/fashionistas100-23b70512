import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface VenueSelectorProps {
  status?: string;
  modes: Array<"physical" | "virtual" | "hybrid">;
  onSubmit: (venue: VenueData) => void;
}

interface VenueData {
  type: "physical" | "virtual" | "hybrid";
  name?: string;
  address?: string;
  capacity?: number;
}

export function VenueSelector({ status, modes, onSubmit }: VenueSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<"physical" | "virtual" | "hybrid">();
  const [formData, setFormData] = useState<Partial<VenueData>>({});

  const handleModeSelect = (mode: "physical" | "virtual" | "hybrid") => {
    setSelectedMode(mode);
    setFormData({ type: mode });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMode) {
      onSubmit({ type: selectedMode, ...formData });
    }
  };

  const modeLabels = {
    physical: { label: "Physical", description: "In-person venue" },
    virtual: { label: "Virtual", description: "Online event" },
    hybrid: { label: "Hybrid", description: "Both in-person & online" }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-foreground mb-2">Venue Setup</h2>
        <p className="text-sm text-muted-foreground">Select how attendees will experience your event</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => handleModeSelect(mode)}
            className={cn(
              "p-6 rounded-lg border-2 transition-all text-left",
              selectedMode === mode 
                ? "border-primary bg-accent" 
                : "border-border bg-card hover:border-primary hover:bg-accent"
            )}
          >
            <h3 className="text-lg font-medium text-foreground mb-2">
              {modeLabels[mode].label}
            </h3>
            <p className="text-sm text-muted-foreground">
              {modeLabels[mode].description}
            </p>
          </button>
        ))}
      </div>

      {selectedMode && selectedMode !== "virtual" && (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Venue Name</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Conference Center"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main St, Bogotá"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity || ""}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              placeholder="200"
            />
          </div>

          <Button type="submit" className="w-full">
            Continue
          </Button>
        </form>
      )}

      {selectedMode === "virtual" && (
        <Button onClick={() => onSubmit({ type: "virtual" })} className="w-full">
          Continue
        </Button>
      )}

      {status && (
        <p className="text-xs text-muted-foreground text-center">Status: {status}</p>
      )}
    </div>
  );
}

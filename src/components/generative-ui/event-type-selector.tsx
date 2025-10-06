import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EventType {
  id: string;
  label: string;
  description: string;
  icon?: string;
}

interface EventTypeSelectorProps {
  status?: string;
  types: EventType[];
  onSelect: (typeId: string) => void;
}

export function EventTypeSelector({ status, types, onSelect }: EventTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-foreground mb-2">Select Event Type</h2>
        <p className="text-sm text-muted-foreground">Choose the type of fashion event you're planning</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={cn(
              "p-6 rounded-lg border-2 transition-all text-left hover:border-primary hover:bg-accent",
              "border-border bg-card"
            )}
          >
            <h3 className="text-lg font-medium text-foreground mb-2">{type.label}</h3>
            <p className="text-sm text-muted-foreground">{type.description}</p>
          </button>
        ))}
      </div>

      {status && (
        <p className="text-xs text-muted-foreground text-center">Status: {status}</p>
      )}
    </div>
  );
}

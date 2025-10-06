import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TicketTemplate {
  id: string;
  label: string;
  description: string;
  price: string;
}

interface TicketConfigurationProps {
  status?: string;
  templates: TicketTemplate[];
  onComplete: (ticketData: any) => void;
}

export function TicketConfiguration({ status, templates, onComplete }: TicketConfigurationProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-light text-foreground mb-2">Ticket Configuration</h2>
        <p className="text-sm text-muted-foreground">Choose your ticketing strategy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onComplete({ type: template.id, template })}
            className={cn(
              "p-6 rounded-lg border-2 transition-all text-left hover:border-primary hover:bg-accent",
              "border-border bg-card"
            )}
          >
            <h3 className="text-lg font-medium text-foreground mb-2">{template.label}</h3>
            <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
            <p className="text-xl font-semibold text-primary">{template.price}</p>
          </button>
        ))}
      </div>

      {status && (
        <p className="text-xs text-muted-foreground text-center">Status: {status}</p>
      )}
    </div>
  );
}

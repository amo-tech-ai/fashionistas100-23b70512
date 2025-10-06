import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TicketTemplate {
  id: string;
  label: string;
  description: string;
  price: string;
}

interface TicketTier {
  name: string;
  price: number;
  quantity: number;
}

interface TicketConfigurationProps {
  status?: string;
  templates: TicketTemplate[];
  onComplete: (data: { type: string; tiers: TicketTier[] }) => void;
}

export function TicketConfiguration({ status, templates, onComplete }: TicketConfigurationProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [tiers, setTiers] = useState<TicketTier[]>([]);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedType(templateId);
    
    if (templateId === 'simple') {
      setTiers([{ name: 'General Admission', price: 75000, quantity: 100 }]);
    } else if (templateId === 'tiered') {
      setTiers([
        { name: 'VIP', price: 200000, quantity: 30 },
        { name: 'General', price: 75000, quantity: 100 }
      ]);
    } else if (templateId === 'free') {
      setTiers([{ name: 'RSVP', price: 0, quantity: 150 }]);
    }
  };

  const handleComplete = () => {
    if (selectedType && tiers.length > 0) {
      onComplete({ type: selectedType, tiers });
    }
  };

  const updateTier = (index: number, field: keyof TicketTier, value: any) => {
    const updated = [...tiers];
    updated[index] = { ...updated[index], [field]: value };
    setTiers(updated);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-light text-foreground mb-2">Configure Tickets</h2>
        <p className="text-sm text-muted-foreground">Set up pricing and availability</p>
      </div>

      {!selectedType ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={cn(
                "p-6 cursor-pointer transition-all hover:shadow-md border-2 hover:border-primary"
              )}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">{template.label}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
                <p className="text-xl font-bold text-primary">{template.price}</p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Ticket Tiers</h3>
            <Button variant="ghost" size="sm" onClick={() => setSelectedType(null)}>
              Change Type
            </Button>
          </div>

          {tiers.map((tier, index) => (
            <Card key={index} className="p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Tier Name</Label>
                  <Input
                    value={tier.name}
                    onChange={(e) => updateTier(index, 'name', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Price (COP)</Label>
                  <Input
                    type="number"
                    value={tier.price}
                    onChange={(e) => updateTier(index, 'price', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={tier.quantity}
                    onChange={(e) => updateTier(index, 'quantity', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </Card>
          ))}

          <Button 
            onClick={handleComplete}
            className="w-full"
            disabled={status === "complete"}
          >
            Continue to Venue Setup
          </Button>
        </div>
      )}
    </div>
  );
}

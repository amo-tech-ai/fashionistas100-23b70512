import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { WizardSelectionCard } from "./WizardSelectionCard";
import { Plus, Trash2 } from "lucide-react";

interface TicketSetupProps {
  data: any;
  onUpdate: (data: any) => void;
}

const TICKET_TEMPLATES = [
  {
    id: "simple",
    icon: "🎫",
    label: "Simple",
    description: "$X for all tickets",
  },
  {
    id: "tiered",
    icon: "⭐",
    label: "Tiered",
    description: "VIP + General admission",
  },
  {
    id: "vip-only",
    icon: "👑",
    label: "VIP Only",
    description: "Exclusive access",
  },
  {
    id: "free",
    icon: "✨",
    label: "Free (RSVP)",
    description: "Free entry, track RSVPs",
  },
];

export function TicketSetup({ data, onUpdate }: TicketSetupProps) {
  const [tiers, setTiers] = useState(data.tiers || [
    { id: 1, name: "General Admission", price: "", quantity: "", earlyBird: false, benefits: [] }
  ]);

  const handleTemplateSelect = (templateId: string) => {
    let newTiers = [];
    switch (templateId) {
      case "simple":
        newTiers = [{ id: 1, name: "General Admission", price: "", quantity: "", earlyBird: false, benefits: [] }];
        break;
      case "tiered":
        newTiers = [
          { id: 1, name: "VIP", price: "", quantity: "", earlyBird: false, benefits: [] },
          { id: 2, name: "General Admission", price: "", quantity: "", earlyBird: false, benefits: [] }
        ];
        break;
      case "vip-only":
        newTiers = [{ id: 1, name: "VIP Exclusive", price: "", quantity: "", earlyBird: false, benefits: [] }];
        break;
      case "free":
        newTiers = [{ id: 1, name: "Free Entry", price: "0", quantity: "", earlyBird: false, benefits: [] }];
        break;
    }
    setTiers(newTiers);
    onUpdate({ ...data, template: templateId, tiers: newTiers });
  };

  const updateTier = (index: number, field: string, value: any) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setTiers(newTiers);
    onUpdate({ ...data, tiers: newTiers });
  };

  const addTier = () => {
    const newTier = {
      id: Date.now(),
      name: "",
      price: "",
      quantity: "",
      earlyBird: false,
      benefits: []
    };
    const newTiers = [...tiers, newTier];
    setTiers(newTiers);
    onUpdate({ ...data, tiers: newTiers });
  };

  const removeTier = (index: number) => {
    const newTiers = tiers.filter((_, i) => i !== index);
    setTiers(newTiers);
    onUpdate({ ...data, tiers: newTiers });
  };

  return (
    <div className="space-y-8">
      {/* Template Selection */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-[#1A1A1A]">Choose a Template</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TICKET_TEMPLATES.map((template) => (
            <WizardSelectionCard
              key={template.id}
              icon={template.icon}
              label={template.label}
              description={template.description}
              selected={data.template === template.id}
              onClick={() => handleTemplateSelect(template.id)}
            />
          ))}
        </div>
      </div>

      {/* Ticket Tiers */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-[#1A1A1A]">Ticket Tiers</Label>
          <Button
            type="button"
            onClick={addTier}
            variant="outline"
            size="sm"
            className="border-[#E85C2B] text-[#E85C2B] hover:bg-[#E85C2B]/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Tier
          </Button>
        </div>

        {tiers.map((tier, index) => (
          <div key={tier.id} className="p-6 bg-[#FAF8F5] rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-medium text-[#1A1A1A]">
                Tier {index + 1}
              </h4>
              {tiers.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeTier(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#1A1A1A]">Tier Name</Label>
                <Input
                  placeholder="VIP, General Admission..."
                  value={tier.name}
                  onChange={(e) => updateTier(index, "name", e.target.value)}
                  className="border-[#E5E5E5] focus:border-[#E85C2B] h-12 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#1A1A1A]">Price (COP)</Label>
                <Input
                  type="number"
                  placeholder="150000"
                  value={tier.price}
                  onChange={(e) => updateTier(index, "price", e.target.value)}
                  className="border-[#E5E5E5] focus:border-[#E85C2B] h-12 bg-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#1A1A1A]">Quantity Available</Label>
              <Input
                type="number"
                placeholder="100"
                value={tier.quantity}
                onChange={(e) => updateTier(index, "quantity", e.target.value)}
                className="border-[#E5E5E5] focus:border-[#E85C2B] h-12 bg-white"
              />
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                id={`earlyBird-${tier.id}`}
                checked={tier.earlyBird}
                onCheckedChange={(checked) => updateTier(index, "earlyBird", checked)}
              />
              <Label htmlFor={`earlyBird-${tier.id}`} className="text-sm text-[#1A1A1A] cursor-pointer">
                Enable Early Bird Pricing
              </Label>
            </div>

            {tier.earlyBird && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#1A1A1A]">Early Bird Price</Label>
                  <Input
                    type="number"
                    placeholder="120000"
                    value={tier.earlyBirdPrice || ""}
                    onChange={(e) => updateTier(index, "earlyBirdPrice", e.target.value)}
                    className="border-[#E5E5E5] focus:border-[#E85C2B] h-12 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#1A1A1A]">Ends On</Label>
                  <Input
                    type="date"
                    value={tier.earlyBirdDate || ""}
                    onChange={(e) => updateTier(index, "earlyBirdDate", e.target.value)}
                    className="border-[#E5E5E5] focus:border-[#E85C2B] h-12 bg-white"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

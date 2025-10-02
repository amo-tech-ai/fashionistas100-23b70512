import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { WizardSelectionCard } from "./WizardSelectionCard";
import { Sparkles } from "lucide-react";

interface EventDetailsProps {
  data: any;
  onUpdate: (data: any) => void;
}

const EVENT_TYPES = [
  {
    id: "fashion-show",
    icon: "👗",
    label: "Fashion Show",
    description: "Runway presentations",
  },
  {
    id: "popup-shop",
    icon: "🛍️",
    label: "Pop-up Shop",
    description: "Retail experiences",
  },
  {
    id: "exhibition",
    icon: "🎨",
    label: "Exhibition",
    description: "Art & design displays",
  },
  {
    id: "launch-party",
    icon: "🥂",
    label: "Launch Party",
    description: "Product launches",
  },
];

export function EventDetails({ data, onUpdate }: EventDetailsProps) {
  const handleTypeSelect = (typeId: string) => {
    onUpdate({ ...data, type: typeId });
  };

  const handleAIAssist = () => {
    // TODO: Implement AI description generation
    const aiDescription = "Experience the latest in haute couture at our exclusive fashion showcase. Join us for an evening of elegance, innovation, and style as we unveil our Spring/Summer 2025 collection.";
    onUpdate({ ...data, description: aiDescription });
  };

  return (
    <div className="space-y-8">
      {/* Event Type Selection */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-[#1A1A1A]">Event Type</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EVENT_TYPES.map((type) => (
            <WizardSelectionCard
              key={type.id}
              icon={type.icon}
              label={type.label}
              description={type.description}
              selected={data.type === type.id}
              onClick={() => handleTypeSelect(type.id)}
            />
          ))}
        </div>
      </div>

      {/* Event Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium text-[#1A1A1A]">
          Event Title
        </Label>
        <Input
          id="title"
          placeholder="Milano Fashion Week SS25"
          value={data.title || ""}
          onChange={(e) => onUpdate({ ...data, title: e.target.value })}
          className="border-[#E5E5E5] focus:border-[#E85C2B] h-12"
        />
        <p className="text-xs text-[#1A1A1A]/60">3-50 characters</p>
      </div>

      {/* Event Description */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="description" className="text-sm font-medium text-[#1A1A1A]">
            Description
          </Label>
          <Button
            type="button"
            onClick={handleAIAssist}
            variant="outline"
            size="sm"
            className="border-[#E85C2B] text-[#E85C2B] hover:bg-[#E85C2B]/10"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Assist
          </Button>
        </div>
        <Textarea
          id="description"
          placeholder="Describe your event, what makes it special, and what attendees can expect..."
          value={data.description || ""}
          onChange={(e) => onUpdate({ ...data, description: e.target.value })}
          className="border-[#E5E5E5] focus:border-[#E85C2B] min-h-[120px]"
        />
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="date" className="text-sm font-medium text-[#1A1A1A]">
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={data.date || ""}
            onChange={(e) => onUpdate({ ...data, date: e.target.value })}
            className="border-[#E5E5E5] focus:border-[#E85C2B] h-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timezone" className="text-sm font-medium text-[#1A1A1A]">
            Timezone
          </Label>
          <Input
            id="timezone"
            placeholder="Colombia Time (COT)"
            value={data.timezone || ""}
            onChange={(e) => onUpdate({ ...data, timezone: e.target.value })}
            className="border-[#E5E5E5] focus:border-[#E85C2B] h-12"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="startTime" className="text-sm font-medium text-[#1A1A1A]">
            Start Time
          </Label>
          <Input
            id="startTime"
            type="time"
            value={data.startTime || ""}
            onChange={(e) => onUpdate({ ...data, startTime: e.target.value })}
            className="border-[#E5E5E5] focus:border-[#E85C2B] h-12"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime" className="text-sm font-medium text-[#1A1A1A]">
            End Time
          </Label>
          <Input
            id="endTime"
            type="time"
            value={data.endTime || ""}
            onChange={(e) => onUpdate({ ...data, endTime: e.target.value })}
            className="border-[#E5E5E5] focus:border-[#E85C2B] h-12"
          />
        </div>
      </div>
    </div>
  );
}

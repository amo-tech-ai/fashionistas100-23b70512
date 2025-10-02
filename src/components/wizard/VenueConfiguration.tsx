import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { WizardSelectionCard } from "./WizardSelectionCard";

interface VenueConfigurationProps {
  data: any;
  onUpdate: (data: any) => void;
}

const VENUE_MODES = [
  {
    id: "physical",
    icon: "🏛️",
    label: "Physical",
    description: "In-person venue",
  },
  {
    id: "virtual",
    icon: "💻",
    label: "Virtual",
    description: "Online streaming",
  },
  {
    id: "hybrid",
    icon: "🌐",
    label: "Hybrid",
    description: "Both physical & virtual",
  },
];

const AMENITIES = [
  { id: "parking", label: "Parking" },
  { id: "catering", label: "Catering Available" },
  { id: "av-equipment", label: "A/V Equipment" },
  { id: "wheelchair", label: "Wheelchair Access" },
  { id: "wifi", label: "WiFi" },
  { id: "backstage", label: "Backstage Area" },
];

export function VenueConfiguration({ data, onUpdate }: VenueConfigurationProps) {
  const handleModeSelect = (modeId: string) => {
    onUpdate({ ...data, mode: modeId });
  };

  const handleAmenityToggle = (amenityId: string) => {
    const amenities = data.amenities || [];
    const newAmenities = amenities.includes(amenityId)
      ? amenities.filter((id: string) => id !== amenityId)
      : [...amenities, amenityId];
    onUpdate({ ...data, amenities: newAmenities });
  };

  return (
    <div className="space-y-8">
      {/* Venue Mode Selection */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-[#1A1A1A]">Venue Mode</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {VENUE_MODES.map((mode) => (
            <WizardSelectionCard
              key={mode.id}
              icon={mode.icon}
              label={mode.label}
              description={mode.description}
              selected={data.mode === mode.id}
              onClick={() => handleModeSelect(mode.id)}
            />
          ))}
        </div>
      </div>

      {/* Physical Venue Fields */}
      {(data.mode === "physical" || data.mode === "hybrid") && (
        <div className="space-y-6 p-6 bg-[#FAF8F5] rounded-lg">
          <h3 className="text-lg font-medium text-[#1A1A1A]">Physical Venue Details</h3>
          
          <div className="space-y-2">
            <Label htmlFor="venueName" className="text-sm font-medium text-[#1A1A1A]">
              Venue Name
            </Label>
            <Input
              id="venueName"
              placeholder="The Glass Pavilion"
              value={data.venueName || ""}
              onChange={(e) => onUpdate({ ...data, venueName: e.target.value })}
              className="border-[#E5E5E5] focus:border-[#E85C2B] h-12 bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-[#1A1A1A]">
              Address
            </Label>
            <Input
              id="address"
              placeholder="Start typing to search..."
              value={data.address || ""}
              onChange={(e) => onUpdate({ ...data, address: e.target.value })}
              className="border-[#E5E5E5] focus:border-[#E85C2B] h-12 bg-white"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-sm font-medium text-[#1A1A1A]">
              Capacity: {data.capacity || 100} people
            </Label>
            <Slider
              value={[data.capacity || 100]}
              onValueChange={([value]) => onUpdate({ ...data, capacity: value })}
              max={1000}
              step={10}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-[#1A1A1A]">Amenities</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AMENITIES.map((amenity) => (
                <div key={amenity.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity.id}
                    checked={data.amenities?.includes(amenity.id) || false}
                    onCheckedChange={() => handleAmenityToggle(amenity.id)}
                  />
                  <label
                    htmlFor={amenity.id}
                    className="text-sm text-[#1A1A1A] cursor-pointer"
                  >
                    {amenity.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Virtual Venue Fields */}
      {(data.mode === "virtual" || data.mode === "hybrid") && (
        <div className="space-y-6 p-6 bg-[#FAF8F5] rounded-lg">
          <h3 className="text-lg font-medium text-[#1A1A1A]">Virtual Event Details</h3>
          
          <div className="space-y-2">
            <Label htmlFor="platform" className="text-sm font-medium text-[#1A1A1A]">
              Platform
            </Label>
            <Input
              id="platform"
              placeholder="Zoom, YouTube Live, Custom Stream..."
              value={data.platform || ""}
              onChange={(e) => onUpdate({ ...data, platform: e.target.value })}
              className="border-[#E5E5E5] focus:border-[#E85C2B] h-12 bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="streamUrl" className="text-sm font-medium text-[#1A1A1A]">
              Stream URL
            </Label>
            <Input
              id="streamUrl"
              type="url"
              placeholder="https://..."
              value={data.streamUrl || ""}
              onChange={(e) => onUpdate({ ...data, streamUrl: e.target.value })}
              className="border-[#E5E5E5] focus:border-[#E85C2B] h-12 bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxAttendees" className="text-sm font-medium text-[#1A1A1A]">
              Max Virtual Attendees
            </Label>
            <Input
              id="maxAttendees"
              type="number"
              placeholder="500"
              value={data.maxAttendees || ""}
              onChange={(e) => onUpdate({ ...data, maxAttendees: e.target.value })}
              className="border-[#E5E5E5] focus:border-[#E85C2B] h-12 bg-white"
            />
          </div>
        </div>
      )}
    </div>
  );
}

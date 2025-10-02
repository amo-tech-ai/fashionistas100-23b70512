import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { WizardSelectionCard } from "./WizardSelectionCard";
import { Upload, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface SponsorsMediaProps {
  data: any;
  onUpdate: (data: any) => void;
}

const SPONSOR_PACKAGES = [
  {
    id: "bronze",
    icon: "🥉",
    label: "Bronze",
    description: "Logo on materials",
    selected: false,
  },
  {
    id: "silver",
    icon: "🥈",
    label: "Silver",
    description: "Logo + social mentions",
    selected: false,
  },
  {
    id: "gold",
    icon: "🥇",
    label: "Gold",
    description: "Premium placement",
    selected: false,
  },
];

export function SponsorsMedia({ data, onUpdate }: SponsorsMediaProps) {
  const [sponsors, setSponsors] = useState(data.sponsors || []);
  const [socialLinks, setSocialLinks] = useState(data.socialLinks || [
    { platform: "Instagram", url: "" },
    { platform: "Facebook", url: "" },
    { platform: "Twitter", url: "" },
    { platform: "LinkedIn", url: "" },
  ]);

  const handlePackageToggle = (packageId: string) => {
    const packages = data.packages || [];
    const newPackages = packages.includes(packageId)
      ? packages.filter((id: string) => id !== packageId)
      : [...packages, packageId];
    onUpdate({ ...data, packages: newPackages });
  };

  const addSponsor = () => {
    const newSponsor = { id: Date.now(), name: "", logo: null };
    const newSponsors = [...sponsors, newSponsor];
    setSponsors(newSponsors);
    onUpdate({ ...data, sponsors: newSponsors });
  };

  const updateSponsor = (index: number, field: string, value: any) => {
    const newSponsors = [...sponsors];
    newSponsors[index] = { ...newSponsors[index], [field]: value };
    setSponsors(newSponsors);
    onUpdate({ ...data, sponsors: newSponsors });
  };

  const removeSponsor = (index: number) => {
    const newSponsors = sponsors.filter((_: any, i: number) => i !== index);
    setSponsors(newSponsors);
    onUpdate({ ...data, sponsors: newSponsors });
  };

  const updateSocialLink = (index: number, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], url: value };
    setSocialLinks(newLinks);
    onUpdate({ ...data, socialLinks: newLinks });
  };

  return (
    <div className="space-y-8">
      {/* Sponsor Packages */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-[#1A1A1A]">
          Sponsor Packages <span className="text-[#1A1A1A]/40">(Optional)</span>
        </Label>
        <p className="text-sm text-[#1A1A1A]/60">
          Select which sponsorship tiers you want to offer
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SPONSOR_PACKAGES.map((pkg) => (
            <WizardSelectionCard
              key={pkg.id}
              icon={pkg.icon}
              label={pkg.label}
              description={pkg.description}
              selected={data.packages?.includes(pkg.id) || false}
              onClick={() => handlePackageToggle(pkg.id)}
            />
          ))}
        </div>
      </div>

      {/* Sponsor Logos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-[#1A1A1A]">
            Sponsor Logos <span className="text-[#1A1A1A]/40">(Optional)</span>
          </Label>
          <Button
            type="button"
            onClick={addSponsor}
            variant="outline"
            size="sm"
            className="border-[#E85C2B] text-[#E85C2B] hover:bg-[#E85C2B]/10"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Sponsor
          </Button>
        </div>

        {sponsors.length > 0 && (
          <div className="space-y-4">
            {sponsors.map((sponsor: any, index: number) => (
              <div key={sponsor.id} className="p-6 bg-[#FAF8F5] rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-[#1A1A1A]">Sponsor Name</Label>
                      <Input
                        placeholder="Vogue, Chanel, BMW..."
                        value={sponsor.name}
                        onChange={(e) => updateSponsor(index, "name", e.target.value)}
                        className="border-[#E5E5E5] focus:border-[#E85C2B] h-12 bg-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-[#1A1A1A]">Logo</Label>
                      <div className="border-2 border-dashed border-[#E5E5E5] rounded-lg p-8 text-center hover:border-[#E85C2B] transition-colors cursor-pointer bg-white">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-[#1A1A1A]/40" />
                        <p className="text-sm text-[#1A1A1A]/60">
                          Drag & drop or click to upload
                        </p>
                        <p className="text-xs text-[#1A1A1A]/40 mt-1">
                          PNG, JPG, SVG (max 2MB)
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => removeSponsor(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Press Kit */}
      <div className="space-y-2">
        <Label htmlFor="pressKit" className="text-sm font-medium text-[#1A1A1A]">
          Press Kit URL <span className="text-[#1A1A1A]/40">(Optional)</span>
        </Label>
        <Input
          id="pressKit"
          type="url"
          placeholder="https://..."
          value={data.pressKitUrl || ""}
          onChange={(e) => onUpdate({ ...data, pressKitUrl: e.target.value })}
          className="border-[#E5E5E5] focus:border-[#E85C2B] h-12"
        />
        <p className="text-xs text-[#1A1A1A]/60">
          Link to downloadable media assets
        </p>
      </div>

      {/* Social Media Links */}
      <div className="space-y-4">
        <Label className="text-sm font-medium text-[#1A1A1A]">
          Social Media Links <span className="text-[#1A1A1A]/40">(Optional)</span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialLinks.map((link: any, index: number) => (
            <div key={index} className="space-y-2">
              <Label className="text-sm font-medium text-[#1A1A1A]">
                {link.platform}
              </Label>
              <Input
                type="url"
                placeholder={`https://${link.platform.toLowerCase()}.com/...`}
                value={link.url}
                onChange={(e) => updateSocialLink(index, e.target.value)}
                className="border-[#E5E5E5] focus:border-[#E85C2B] h-12"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

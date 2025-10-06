import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Sparkles, Mail, Phone, Globe, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VendorRecommendation {
  id: string;
  vendor_name: string;
  vendor_type: string;
  contact_name: string;
  email: string;
  phone: string;
  website?: string;
  ai_match_score: number;
  ai_reasoning: string;
  estimated_cost_min: number;
  estimated_cost_max: number;
  services_offered: string[];
  status: string;
}

const vendorTypeOptions = [
  { value: "catering", label: "Catering" },
  { value: "photography", label: "Fotografía" },
  { value: "videography", label: "Video" },
  { value: "sound", label: "Sonido" },
  { value: "lighting", label: "Iluminación" },
  { value: "security", label: "Seguridad" },
  { value: "decoration", label: "Decoración" },
  { value: "makeup", label: "Maquillaje" },
  { value: "hair", label: "Peluquería" },
];

export function AIVendorCoordinatorPanel({ eventId }: { eventId: string }) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["catering", "photography", "sound"]);
  const [budget, setBudget] = useState("5000000");
  const [guestCount, setGuestCount] = useState("100");
  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState<VendorRecommendation[]>([]);
  const { toast } = useToast();

  const toggleVendorType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const generateRecommendations = async () => {
    if (selectedTypes.length === 0) {
      toast({
        title: "Error",
        description: "Selecciona al menos un tipo de proveedor",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setVendors([]);

    try {
      const { data, error } = await supabase.functions.invoke("vendor-coordinator-agent", {
        body: {
          event_id: eventId,
          vendor_types: selectedTypes,
          budget_cop: parseInt(budget) || 5000000,
          guest_count: parseInt(guestCount) || 100
        }
      });

      if (error) throw error;

      if (data?.error === "rate_limit") {
        toast({
          title: "Límite alcanzado",
          description: data.message,
          variant: "destructive"
        });
        return;
      }

      if (data?.error === "credits_exhausted") {
        toast({
          title: "Créditos agotados",
          description: data.message,
          variant: "destructive"
        });
        return;
      }

      if (data?.success && data?.vendors) {
        setVendors(data.vendors);
        toast({
          title: "Recomendaciones generadas",
          description: `${data.vendors.length} proveedores sugeridos`
        });
      }
    } catch (error) {
      console.error("Error generating vendor recommendations:", error);
      toast({
        title: "Error",
        description: "No se pudieron generar recomendaciones. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toLocaleString('es-CO')} COP`;
  };

  const getTypeLabel = (type: string) => {
    return vendorTypeOptions.find(opt => opt.value === type)?.label || type;
  };

  const openWhatsApp = (phone: string, vendorName: string) => {
    const message = encodeURIComponent(`Hola! Estoy interesado en contratar sus servicios para mi evento. Mi nombre es [Tu nombre] y me gustaría obtener más información.`);
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-background border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">AI Coordinación de Proveedores</h3>
            <p className="text-sm text-muted-foreground">Encuentra proveedores verificados</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-foreground mb-3 block">Tipos de proveedores</Label>
            <div className="grid grid-cols-2 gap-2">
              {vendorTypeOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={selectedTypes.includes(option.value)}
                    onCheckedChange={() => toggleVendorType(option.value)}
                  />
                  <label
                    htmlFor={option.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget" className="text-foreground">
                Presupuesto (COP)
              </Label>
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="guests" className="text-foreground">
                Invitados
              </Label>
              <Input
                id="guests"
                type="number"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <Button
            onClick={generateRecommendations}
            disabled={loading || selectedTypes.length === 0}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando recomendaciones...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generar Recomendaciones AI
              </>
            )}
          </Button>
        </div>
      </Card>

      {vendors.length > 0 && (
        <div className="space-y-4">
          {vendors.map((vendor) => (
            <Card key={vendor.id} className="p-6 bg-background border-border">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-semibold text-foreground">{vendor.vendor_name}</h4>
                      <Badge variant="outline">{getTypeLabel(vendor.vendor_type)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{vendor.contact_name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{vendor.ai_match_score}%</div>
                    <div className="text-xs text-muted-foreground">Match</div>
                  </div>
                </div>

                <p className="text-sm text-foreground">{vendor.ai_reasoning}</p>

                <div className="flex flex-wrap gap-2">
                  {vendor.services_offered.map((service, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>

                <div className="p-3 bg-muted/30 rounded">
                  <p className="text-sm font-medium text-foreground">
                    Costo estimado: {formatCurrency(vendor.estimated_cost_min)} - {formatCurrency(vendor.estimated_cost_max)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.location.href = `mailto:${vendor.email}`}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openWhatsApp(vendor.phone, vendor.vendor_name)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  {vendor.website && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(vendor.website, '_blank')}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Sitio web
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

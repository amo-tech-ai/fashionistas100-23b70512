import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Globe, Instagram } from "lucide-react";
import { Designer } from "@/data/sampleDesigners";

interface DesignerCardProps {
  designer: Designer;
}

export const DesignerCard = ({ designer }: DesignerCardProps) => {
  const getExperienceVariant = (experience: string) => {
    switch (experience) {
      case 'Luxury':
        return 'hero';
      case 'Established':
        return 'accent';
      case 'Emerging':
        return 'olive';
      default:
        return 'sand';
    }
  };

  return (
    <Card className="group overflow-hidden bg-gradient-card hover:shadow-hover transition-smooth">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={designer.image} 
          alt={designer.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
        <div className="absolute top-4 right-4">
          <Badge variant={getExperienceVariant(designer.experience) as any} className="font-inter">
            {designer.experience}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-playfair text-xl font-bold text-foreground group-hover:text-accent transition-smooth">
            {designer.name}
          </h3>
          <p className="font-playfair text-lg text-accent font-medium">
            {designer.brand}
          </p>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="font-inter text-sm">{designer.city}</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground font-inter">
            {designer.specialty}
          </p>
          <p className="text-sm text-muted-foreground font-inter line-clamp-3">
            {designer.bio}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button variant="ghost" size="icon" className="hover:bg-accent/20">
            <Mail className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-accent/20">
            <Globe className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-accent/20">
            <Instagram className="w-4 h-4" />
          </Button>
        </div>

        <Button variant="outline" className="w-full font-inter">
          View Portfolio
        </Button>
      </CardContent>
    </Card>
  );
};
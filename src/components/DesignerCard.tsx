import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Mail, Globe, Instagram } from "lucide-react";
import { Designer } from "@/services/designerService";

interface DesignerCardProps {
  designer: Designer;
}

export const DesignerCard = ({ designer }: DesignerCardProps) => {
  return (
    <Card className="group overflow-hidden bg-gradient-card hover:shadow-hover transition-smooth">
      {/* Portfolio Image Preview */}
      <div className="relative h-48 overflow-hidden">
        {designer.portfolioUrls.length > 0 ? (
          <img 
            src={designer.portfolioUrls[0]} 
            alt={`${designer.brandName} portfolio`}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No Portfolio</span>
          </div>
        )}
        {designer.isVerified && (
          <div className="absolute top-4 right-4">
            <Badge variant="default" className="font-inter">
              Verified
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-playfair text-xl font-bold text-foreground group-hover:text-accent transition-smooth">
            {designer.brandName}
          </h3>
          {designer.bio && (
            <p className="text-sm text-muted-foreground font-inter line-clamp-3">
              {designer.bio}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2">
          {designer.websiteUrl && (
            <Button variant="ghost" size="icon" className="hover:bg-accent/20" asChild>
              <a href={designer.websiteUrl} target="_blank" rel="noopener noreferrer">
                <Globe className="w-4 h-4" />
              </a>
            </Button>
          )}
          {designer.socialLinks.instagram && (
            <Button variant="ghost" size="icon" className="hover:bg-accent/20" asChild>
              <a href={designer.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>

        <Button variant="outline" className="w-full font-inter" asChild>
          <a href={`/designers/${designer.brandSlug}`}>
            View Portfolio
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface FallbackContentProps {
  type: 'events' | 'designers' | 'general';
  title?: string;
  description?: string;
}

export const FallbackContent = ({ 
  type, 
  title = "Coming Soon", 
  description = "Exciting content is on the way!" 
}: FallbackContentProps) => {
  const getIcon = () => {
    switch (type) {
      case 'events':
        return <Calendar className="w-8 h-8 text-primary" />;
      case 'designers':
        return <Users className="w-8 h-8 text-primary" />;
      default:
        return <Star className="w-8 h-8 text-primary" />;
    }
  };

  const getActionButton = () => {
    switch (type) {
      case 'events':
        return (
          <Button asChild>
            <Link to="/events">Browse All Events</Link>
          </Button>
        );
      case 'designers':
        return (
          <Button asChild>
            <Link to="/designers">Discover Designers</Link>
          </Button>
        );
      default:
        return (
          <Button asChild>
            <Link to="/">Explore Platform</Link>
          </Button>
        );
    }
  };

  return (
    <Card className="text-center p-8 bg-gradient-to-br from-background to-muted/20">
      <CardHeader>
        <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
          {getIcon()}
        </div>
        <CardTitle className="text-2xl font-playfair">{title}</CardTitle>
        <CardDescription className="text-lg">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm">Premium fashion experiences await</span>
          <Sparkles className="w-4 h-4" />
        </div>
        {getActionButton()}
      </CardContent>
    </Card>
  );
};
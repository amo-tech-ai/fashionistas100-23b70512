import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Crown, Ticket } from "lucide-react";

const tiers = [
  {
    name: "General",
    price: "$99",
    description: "Essential access to fashion events",
    features: [
      "Access to all general sessions",
      "Fashion show seating",
      "Welcome reception",
      "Event networking",
      "Digital program guide"
    ],
    icon: Ticket,
    popular: false
  },
  {
    name: "VIP",
    price: "$249",
    description: "Premium experience with exclusive perks",
    features: [
      "Priority seating at fashion shows",
      "Backstage access",
      "Meet & greet with designers",
      "VIP lounge access",
      "Complimentary drinks",
      "Exclusive gift bag",
      "Professional photography"
    ],
    icon: Star,
    popular: true
  },
  {
    name: "Sponsor",
    price: "$499",
    description: "Ultimate luxury experience",
    features: [
      "Front row fashion show seating",
      "Private designer consultations",
      "Exclusive after-party access",
      "Personal concierge service",
      "Premium gift collection",
      "Professional portrait session",
      "Brand partnership opportunities",
      "Lifetime membership perks"
    ],
    icon: Crown,
    popular: false
  }
];

export const TicketTiers = () => {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <Badge variant="secondary" className="font-inter">
            <Ticket className="w-4 h-4 mr-2" />
            Ticket Tiers
          </Badge>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
            Choose Your
            <span className="block text-accent">Fashion Experience</span>
          </h2>
          <p className="font-inter text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the perfect tier for your fashion journey. From essential access to ultimate luxury experiences.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => {
            const IconComponent = tier.icon;
            return (
              <Card 
                key={tier.name} 
                className={`relative ${tier.popular ? 'ring-2 ring-accent shadow-hover' : 'shadow-card'} hover:shadow-hover transition-smooth`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge variant="default" className="bg-accent text-accent-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-accent rounded-full flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="font-playfair text-2xl font-bold text-foreground">
                      {tier.name}
                    </CardTitle>
                    <div className="mt-2">
                      <span className="font-playfair text-4xl font-bold text-accent">
                        {tier.price}
                      </span>
                      <span className="text-muted-foreground ml-1">/event</span>
                    </div>
                    <p className="font-inter text-sm text-muted-foreground mt-2">
                      {tier.description}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="font-inter text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={tier.popular ? "hero" : "outline"} 
                    className="w-full font-inter"
                    size="lg"
                  >
                    Select {tier.name}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12 space-y-4">
          <p className="font-inter text-sm text-muted-foreground">
            All tiers include access to the main fashion shows and networking events
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span>• Secure payment processing</span>
            <span>• Mobile tickets</span>
            <span>• 24/7 customer support</span>
            <span>• Refund protection</span>
          </div>
        </div>
      </div>
    </section>
  );
};
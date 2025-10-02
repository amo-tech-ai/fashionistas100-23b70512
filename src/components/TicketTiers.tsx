import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    popular: false,
    bookings: "150+ booked this month"
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
    popular: true,
    bookings: "250+ booked this month"
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
    popular: false,
    bookings: "75+ booked this month"
  }
];

export const TicketTiers = () => {
  return (
    <section className="py-20 px-4 bg-[hsl(var(--breef-cream))]">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header - Breef Style */}
        <div className="text-center space-y-6 mb-16">
          <h2 className="font-inter text-3xl md:text-5xl font-light text-[hsl(var(--breef-dark))]">
            Choose your experience
          </h2>
          <p className="font-inter text-lg text-[hsl(var(--breef-gray))] max-w-2xl mx-auto">
            From essential access to VIP experiences—find the perfect ticket tier for your fashion journey.
          </p>
        </div>

        {/* Pricing Cards - Breef Style: Clean 3-column */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <Card 
              key={tier.name} 
              className={`relative bg-white rounded-2xl shadow-card hover:shadow-hover transition-all ${tier.popular ? 'ring-2 ring-[hsl(var(--breef-orange))]' : ''}`}
            >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[hsl(var(--breef-orange))] text-white border-0 px-4">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center space-y-4 p-8">
                  <div>
                    <CardTitle className="font-inter text-2xl font-medium text-[hsl(var(--breef-dark))] mb-4">
                      {tier.name}
                    </CardTitle>
                    <div className="mb-2">
                      <span className="font-inter text-5xl font-light text-[hsl(var(--breef-dark))]">
                        {tier.price}
                      </span>
                      <span className="text-[hsl(var(--breef-gray))] text-sm">/event</span>
                    </div>
                    <p className="font-inter text-sm text-[hsl(var(--breef-gray))] mt-3">
                      {tier.description}
                    </p>
                    <p className="font-inter text-xs text-[hsl(var(--breef-orange))] mt-2">
                      {tier.bookings}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 p-8 pt-0">
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="text-[hsl(var(--breef-orange))] text-lg leading-none mt-0.5">•</span>
                        <span className="font-inter text-sm text-[hsl(var(--breef-dark))]">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full font-inter h-12 rounded-full ${
                      tier.popular 
                        ? 'bg-[hsl(var(--breef-orange))] hover:bg-[hsl(var(--breef-orange))]/90 text-white' 
                        : 'bg-white border-2 border-[hsl(var(--border))] text-[hsl(var(--breef-dark))] hover:bg-[hsl(var(--surface-2))]'
                    }`}
                    size="lg"
                  >
                    Select {tier.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
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
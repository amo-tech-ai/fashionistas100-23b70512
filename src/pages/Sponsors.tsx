import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Star, Award, Users } from "lucide-react";

const Sponsors = () => {
  const sponsorTiers = [
    {
      tier: "Platinum",
      price: "$50,000",
      benefits: ["Logo on main stage", "VIP backstage access", "Premium booth space", "Social media features"],
      color: "bg-gradient-to-r from-gray-400 to-gray-600"
    },
    {
      tier: "Gold", 
      price: "$25,000",
      benefits: ["Program advertisement", "Booth space", "Event photography", "Newsletter mentions"],
      color: "bg-gradient-to-r from-yellow-400 to-yellow-600"
    },
    {
      tier: "Silver",
      price: "$10,000", 
      benefits: ["Website listing", "Event tickets", "Networking access", "Brand visibility"],
      color: "bg-gradient-to-r from-gray-300 to-gray-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-playfair font-bold text-foreground mb-4">
            Sponsorship Opportunities
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Partner with us to showcase your brand at the most prestigious fashion events. 
            Reach influential audiences and connect with industry leaders.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {sponsorTiers.map((sponsor, index) => (
            <Card key={sponsor.tier} className="relative overflow-hidden">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 rounded-full ${sponsor.color} mx-auto mb-4 flex items-center justify-center`}>
                  {index === 0 ? <Award className="w-8 h-8 text-white" /> :
                   index === 1 ? <Star className="w-8 h-8 text-white" /> :
                   <Building2 className="w-8 h-8 text-white" />}
                </div>
                <CardTitle className="text-2xl font-playfair">{sponsor.tier}</CardTitle>
                <CardDescription className="text-3xl font-bold text-foreground">{sponsor.price}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {sponsor.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center">
                      <Badge variant="outline" className="mr-2 w-2 h-2 p-0 rounded-full" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant={index === 0 ? "default" : "outline"}>
                  Choose {sponsor.tier}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-accent/5">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-2xl font-playfair font-bold mb-4">Custom Sponsorship Packages</h3>
            <p className="text-muted-foreground mb-6">
              Need something different? We create tailored sponsorship packages to meet your specific marketing goals and budget.
            </p>
            <Button size="lg">Contact Our Sponsorship Team</Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Sponsors;
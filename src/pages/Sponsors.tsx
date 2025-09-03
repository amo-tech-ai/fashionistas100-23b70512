import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Star, Award, Users, CheckCircle, Mail, Phone } from "lucide-react";
import sponsorsHeroImage from "@/assets/sponsors-hero.jpg";

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
      <main className="pt-16 lg:pt-20 pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container mt-16 lg:mt-20 mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl lg:text-5xl font-playfair font-bold mb-6">
                  Sponsorship Opportunities
                </h1>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Partner with us to showcase your brand at the most prestigious fashion events. 
                  Reach influential audiences and connect with industry leaders while supporting 
                  emerging talent in the fashion industry.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg">
                    <Mail className="w-5 h-5 mr-2" />
                    Get Sponsorship Package
                  </Button>
                  <Button variant="outline" size="lg">
                    <Phone className="w-5 h-5 mr-2" />
                    Schedule Call
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img
                  src={sponsorsHeroImage}
                  alt="Fashion Sponsorship Opportunities"
                  className="w-full h-[400px] object-cover rounded-lg shadow-2xl"
                />
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg">
                  <span className="font-semibold">Premium Partnership</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container mt-16 lg:mt-20 mx-auto px-4 py-12">

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
                       <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
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

        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-playfair font-bold mb-4">Custom Sponsorship Packages</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Need something different? We create tailored sponsorship packages to meet your specific marketing goals and budget.
              From brand activations to exclusive networking events, we'll design the perfect partnership for your company.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                <Mail className="w-5 h-5 mr-2" />
                Contact Our Sponsorship Team
              </Button>
              <Button variant="outline" size="lg">
                Download Media Kit
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Partner Benefits Section */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold mb-4">Why Partner With Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join leading brands in supporting the fashion industry while gaining valuable exposure and networking opportunities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Exposure</h3>
              <p className="text-muted-foreground">
                Reach thousands of fashion enthusiasts, industry professionals, and potential customers at our exclusive events.
              </p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Networking Opportunities</h3>
              <p className="text-muted-foreground">
                Connect with designers, influencers, media, and other sponsors in exclusive VIP networking sessions.
              </p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Award className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Brand Association</h3>
              <p className="text-muted-foreground">
                Align your brand with fashion excellence and support emerging talent in the creative industry.
              </p>
            </Card>
          </div>
        </section>
        </div>
      </main>
    </div>
  );
};

export default Sponsors;
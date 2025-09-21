import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Star, Award, Users, CheckCircle, Mail, Phone, TrendingUp, Target, Handshake } from "lucide-react";
import sponsorsHeroImage from "@/assets/sponsors-hero.jpg";
import Footer from "@/components/Footer";

const Sponsors = () => {
  const sponsorTiers = [
    {
      tier: "Title Sponsor",
      price: "$100,000+",
      benefits: [
        "Event naming rights",
        "Logo on all materials", 
        "VIP backstage access",
        "Premium booth space",
        "Social media takeover",
        "Exclusive networking"
      ],
      color: "bg-gradient-to-r from-primary to-primary/80",
      featured: true
    },
    {
      tier: "Platinum",
      price: "$50,000",
      benefits: [
        "Logo on main stage", 
        "VIP backstage access", 
        "Premium booth space", 
        "Social media features",
        "Event photography",
        "Press coverage"
      ],
      color: "bg-gradient-to-r from-accent to-accent/80",
      featured: true
    },
    {
      tier: "Silver",
      price: "$25,000",
      benefits: [
        "Program advertisement", 
        "Booth space", 
        "Event photography", 
        "Newsletter mentions",
        "Website listing",
        "Networking access"
      ],
      color: "bg-gradient-to-r from-silver to-silver/80",
      featured: false
    }
  ];

  const currentSponsors = [
    { name: "Luxury Brand Co", logo: "/placeholder-logo.png" },
    { name: "Fashion House", logo: "/placeholder-logo.png" },
    { name: "Style Corp", logo: "/placeholder-logo.png" },
    { name: "Trend Makers", logo: "/placeholder-logo.png" },
    { name: "Couture Plus", logo: "/placeholder-logo.png" },
    { name: "Elite Fashion", logo: "/placeholder-logo.png" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section - Dark Background */}
      <section className="relative py-20 bg-foreground -mt-16 lg:-mt-20">
        <div className="absolute inset-0 opacity-20">
          <img
            src={sponsorsHeroImage}
            alt="Fashion Sponsorship"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[600px]">
            <div className="text-center lg:text-left">
              <Badge variant="outline" className="mb-6 bg-background/20 text-background border-background/30">
                Partnership Opportunities
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-playfair font-bold mb-6 text-background">
                Partner with Fashion
                <span className="block text-background">Excellence</span>
              </h1>
              <p className="text-xl text-background/90 mb-8 leading-relaxed max-w-2xl">
                Connect with influential audiences and industry leaders while supporting 
                emerging talent in the fashion industry. Join leading brands in shaping the future of fashion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
                  <Mail className="w-5 h-5 mr-2" />
                  Get Sponsorship Package
                </Button>
                <Button variant="outline" size="lg" className="border-background/30 text-background hover:bg-background hover:text-foreground">
                  <Phone className="w-5 h-5 mr-2" />
                  Schedule Call
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4 text-center text-background">
                <div>
                  <div className="text-4xl font-bold">500+</div>
                  <div className="text-sm opacity-80">Events Annually</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">50K+</div>
                  <div className="text-sm opacity-80">Attendees</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">25+</div>
                  <div className="text-sm opacity-80">Global Cities</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - White Background */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold mb-4">Why Partner With Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join leading brands in supporting the fashion industry while gaining valuable exposure and networking opportunities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 shadow-lg hover:shadow-hover transition-all duration-300">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Exposure</h3>
              <p className="text-muted-foreground">
                Reach thousands of fashion enthusiasts, industry professionals, and potential customers at our exclusive events.
              </p>
            </Card>
            
            <Card className="text-center p-6 shadow-lg hover:shadow-hover transition-all duration-300">
              <div className="w-16 h-16 bg-accent/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Target className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Targeted Audience</h3>
              <p className="text-muted-foreground">
                Connect with your exact target demographic through our carefully curated fashion events and experiences.
              </p>
            </Card>
            
            <Card className="text-center p-6 shadow-lg hover:shadow-hover transition-all duration-300">
              <div className="w-16 h-16 bg-secondary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Handshake className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Strategic Partnerships</h3>
              <p className="text-muted-foreground">
                Build meaningful relationships with designers, influencers, media, and other sponsors in exclusive networking sessions.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Sponsorship Tiers - Alternating Backgrounds */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold mb-4">Sponsorship Packages</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the partnership level that best fits your marketing goals and budget.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {sponsorTiers.map((sponsor, index) => (
              <Card 
                key={sponsor.tier} 
                className={`relative overflow-hidden shadow-lg hover:shadow-hover transition-all duration-300 ${
                  sponsor.featured ? 'ring-2 ring-primary transform scale-105' : ''
                }`}
              >
                {sponsor.featured && (
                  <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <CardHeader className={`text-center ${sponsor.featured ? 'pt-12' : ''}`}>
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
                  <Button className="w-full" variant={sponsor.featured ? "default" : "outline"}>
                    Choose {sponsor.tier}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Current Sponsors - White Background */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold mb-4">Our Partners</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Proud to work with industry-leading brands and organizations.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {currentSponsors.map((sponsor, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-hover transition-all duration-300 group">
                <div className="w-full h-16 bg-muted rounded-lg flex items-center justify-center mb-3 group-hover:bg-muted/80 transition-colors">
                  <span className="text-muted-foreground text-sm font-semibold">{sponsor.name}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Packages - Dark Background */}
      <section className="py-16 bg-foreground">
        <div className="container mx-auto px-4">
          <Card className="bg-background/10 backdrop-blur-sm border-background/20 text-center">
            <CardContent className="p-12">
              <Users className="w-16 h-16 text-background mx-auto mb-6" />
              <h3 className="text-3xl font-playfair font-bold mb-4 text-background">Custom Sponsorship Packages</h3>
              <p className="text-background/80 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
                Need something different? We create tailored sponsorship packages to meet your specific marketing goals and budget.
                From brand activations to exclusive networking events, we'll design the perfect partnership for your company.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
                  <Mail className="w-5 h-5 mr-2" />
                  Contact Our Sponsorship Team
                </Button>
                <Button variant="outline" size="lg" className="border-background/30 text-background hover:bg-background hover:text-foreground">
                  Download Media Kit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Success Stories - White Background */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold mb-4">Success Stories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how our partnerships have delivered exceptional results for leading brands.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 shadow-lg">
              <div className="text-4xl font-bold text-primary mb-2">85%</div>
              <div className="text-lg font-semibold mb-2">Brand Recognition Increase</div>
              <div className="text-muted-foreground text-sm">Average uplift reported by our Platinum sponsors</div>
            </Card>
            
            <Card className="text-center p-6 shadow-lg">
              <div className="text-4xl font-bold text-accent mb-2">12M+</div>
              <div className="text-lg font-semibold mb-2">Social Media Impressions</div>
              <div className="text-muted-foreground text-sm">Generated across all our sponsored events last year</div>
            </Card>
            
            <Card className="text-center p-6 shadow-lg">
              <div className="text-4xl font-bold text-secondary mb-2">95%</div>
              <div className="text-lg font-semibold mb-2">Sponsor Retention Rate</div>
              <div className="text-muted-foreground text-sm">Sponsors who continue partnerships year after year</div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sponsors;
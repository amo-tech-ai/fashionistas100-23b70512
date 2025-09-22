import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Video, Sparkles, Megaphone, ArrowRight, Clock, DollarSign, Globe } from 'lucide-react';

const Home: React.FC = () => {
  const services = [
    {
      icon: Camera,
      title: 'Photography',
      description: 'Professional fashion photography',
      price: 'From $39/photo',
      turnaround: '48h',
      href: '/services/photography'
    },
    {
      icon: Video,
      title: 'Video Production',
      description: 'Runway shows & campaigns',
      price: 'From $199/video',
      turnaround: '72h',
      href: '/services/video'
    },
    {
      icon: Sparkles,
      title: 'AI Studio',
      description: 'AI-powered content generation',
      price: 'From $9/image',
      turnaround: '1h',
      href: '/services/ai'
    },
    {
      icon: Megaphone,
      title: 'Campaigns',
      description: 'Omnichannel marketing campaigns',
      price: 'From $299/month',
      turnaround: '24h setup',
      href: '/services/campaigns'
    }
  ];

  const events = [
    {
      title: 'Colombia Fashion Week 2024',
      date: 'March 15-20, 2024',
      location: 'Bogotá, Colombia',
      image: '/api/placeholder/400/300',
      category: 'Fashion Week'
    },
    {
      title: 'Emerging Designers Showcase',
      date: 'April 5, 2024',
      location: 'Medellín, Colombia',
      image: '/api/placeholder/400/300',
      category: 'Showcase'
    },
    {
      title: 'Sustainable Fashion Summit',
      date: 'April 18, 2024',
      location: 'Cartagena, Colombia',
      image: '/api/placeholder/400/300',
      category: 'Summit'
    }
  ];

  const designers = [
    {
      name: 'María González',
      specialty: 'Contemporary Womenswear',
      location: 'Bogotá',
      image: '/api/placeholder/200/200'
    },
    {
      name: 'Carlos Mendoza',
      specialty: 'Luxury Menswear',
      location: 'Medellín',
      image: '/api/placeholder/200/200'
    },
    {
      name: 'Ana Rodríguez',
      specialty: 'Sustainable Fashion',
      location: 'Cali',
      image: '/api/placeholder/200/200'
    }
  ];

  const valuePillars = [
    {
      icon: Clock,
      title: 'Faster',
      description: 'Convert 3-day workflows into 3-minute automated flows'
    },
    {
      icon: DollarSign,
      title: 'Cheaper',
      description: 'AI-powered efficiency reduces costs by up to 80%'
    },
    {
      icon: Globe,
      title: 'Omnichannel',
      description: 'Instagram, TikTok, WhatsApp, Shopify, Amazon integration'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted text-foreground">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-10" />
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <Badge variant="secondary" className="mb-6 text-sm">
            AI-Powered Fashion Commerce Platform
          </Badge>
          <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight">
            Launch fashion-grade content in
            <span className="text-accent"> 48 hours</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto">
            Convert 3-day manual workflows into 3-minute automated flows. Photography, video, AI content, and omnichannel campaigns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/services">
                Explore Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/events">Browse Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trending Services */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trending Services</h2>
            <p className="text-xl text-muted-foreground">Professional fashion content creation made simple</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <Link to={service.href}>
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                      <service.icon className="w-8 h-8 text-accent" />
                    </div>
                    <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                    <CardDescription className="text-sm">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-2">
                    <div className="text-lg font-semibold text-accent">{service.price}</div>
                    <div className="text-sm text-muted-foreground">{service.turnaround}</div>
                    <Button variant="outline" size="sm" className="w-full mt-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      Learn More
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose FashionOS</h2>
            <p className="text-xl text-muted-foreground">The future of fashion content creation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {valuePillars.map((pillar, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-6">
                  <pillar.icon className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{pillar.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{pillar.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
              <p className="text-xl text-muted-foreground">Discover the latest fashion events in Colombia</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/events">View All Events</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="aspect-video bg-muted">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-3">{event.category}</Badge>
                  <h3 className="font-bold text-xl mb-2 group-hover:text-accent transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">{event.date}</p>
                  <p className="text-sm text-muted-foreground mb-4">{event.location}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Designer Spotlights */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Designer Spotlights</h2>
              <p className="text-xl text-muted-foreground">Meet Colombia's rising fashion talents</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/designers">View All Designers</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {designers.map((designer, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-24 h-24 mx-auto rounded-full bg-muted mb-6 overflow-hidden">
                    <img 
                      src={designer.image} 
                      alt={designer.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-xl mb-2 group-hover:text-accent transition-colors">
                    {designer.name}
                  </h3>
                  <p className="text-accent font-medium mb-2">{designer.specialty}</p>
                  <p className="text-sm text-muted-foreground">{designer.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="py-12 px-4 border-t border-b">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-muted-foreground text-lg">Trusted by leading fashion brands and designers</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
            {/* Placeholder for brand logos */}
            <div className="aspect-video bg-muted rounded flex items-center justify-center">
              <span className="text-sm font-medium">Brand Logo</span>
            </div>
            <div className="aspect-video bg-muted rounded flex items-center justify-center">
              <span className="text-sm font-medium">Brand Logo</span>
            </div>
            <div className="aspect-video bg-muted rounded flex items-center justify-center">
              <span className="text-sm font-medium">Brand Logo</span>
            </div>
            <div className="aspect-video bg-muted rounded flex items-center justify-center">
              <span className="text-sm font-medium">Brand Logo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-accent text-accent-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to transform your fashion workflow?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of designers, organizers, and brands already using FashionOS
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link to="/sign-up">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent">
              <Link to="/services">View Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Camera, Video, Sparkles, Megaphone, ArrowRight, Clock, CheckCircle, Star } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: Camera,
      title: 'Photography',
      description: 'Professional fashion photography with AI enhancement',
      href: '/services/photography',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Video,
      title: 'Video Production',
      description: 'Runway shows, campaigns, and social content',
      href: '/services/video',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Sparkles,
      title: 'AI Studio',
      description: 'AI-powered content generation and enhancement',
      href: '/services/ai',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Megaphone,
      title: 'Campaigns',
      description: 'Omnichannel marketing campaign management',
      href: '/services/campaigns',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Choose Your Service',
      description: 'Select from photography, video, AI content, or full campaigns based on your needs.'
    },
    {
      number: '02',
      title: 'Upload & Customize',
      description: 'Upload your products, set preferences, and customize your content requirements.'
    },
    {
      number: '03',
      title: 'Receive & Distribute',
      description: 'Get your professional content delivered and automatically distribute across channels.'
    }
  ];

  const beforeAfter = [
    {
      category: 'Product Photography',
      before: '/api/placeholder/300/400',
      after: '/api/placeholder/300/400',
      improvement: 'AI-enhanced lighting & background'
    },
    {
      category: 'Runway Video',
      before: '/api/placeholder/300/400',
      after: '/api/placeholder/300/400',
      improvement: 'Professional editing & color grading'
    },
    {
      category: 'Campaign Creative',
      before: '/api/placeholder/300/400',
      after: '/api/placeholder/300/400',
      improvement: 'Multi-platform optimization'
    }
  ];

  const testimonials = [
    {
      quote: "FashionOS transformed our content creation process. What used to take weeks now takes hours.",
      author: "María González",
      role: "Creative Director, Elegance Boutique",
      rating: 5
    },
    {
      quote: "The AI enhancement feature is incredible. Our product photos look professional-grade now.",
      author: "Carlos Mendoza",
      role: "Founder, Urban Threads",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 text-sm">
            Professional Fashion Content Creation
          </Badge>
          <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            From concept to campaign in
            <span className="text-accent"> 48 hours</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-4xl mx-auto">
            Professional photography, video production, AI content generation, and omnichannel campaigns. 
            All in one platform, optimized for the fashion industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/sign-up">
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/contact">Book Consultation</Link>
            </Button>
          </div>
          
          {/* Pricing Teaser */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="text-center p-4 bg-card rounded-lg border">
              <div className="text-2xl font-bold text-accent">$39</div>
              <div className="text-sm text-muted-foreground">per photo</div>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border">
              <div className="text-2xl font-bold text-accent">$199</div>
              <div className="text-sm text-muted-foreground">per video</div>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border">
              <div className="text-2xl font-bold text-accent">$9</div>
              <div className="text-sm text-muted-foreground">AI image</div>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border">
              <div className="text-2xl font-bold text-accent">$299</div>
              <div className="text-sm text-muted-foreground">campaign/month</div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Service</h2>
            <p className="text-xl text-muted-foreground">Professional content creation tailored for fashion brands</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-accent/20">
                <Link to={service.href}>
                  <div className={`h-2 bg-gradient-to-r ${service.gradient}`} />
                  <CardHeader className="p-8">
                    <div className="flex items-center mb-4">
                      <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-full flex items-center justify-center mr-4`}>
                        <service.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl mb-2">{service.title}</CardTitle>
                        <CardDescription className="text-base">{service.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <Button className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Three simple steps to professional fashion content</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 transform translate-x-1/2 w-full h-0.5 bg-accent/30 z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto bg-accent text-accent-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Gallery */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See the Transformation</h2>
            <p className="text-xl text-muted-foreground">Professional results delivered in 48 hours or less</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {beforeAfter.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-2">
                    <div className="relative">
                      <img src={item.before} alt="Before" className="w-full h-64 object-cover" />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary">Before</Badge>
                      </div>
                    </div>
                    <div className="relative">
                      <img src={item.after} alt="After" className="w-full h-64 object-cover" />
                      <div className="absolute top-4 left-4">
                        <Badge variant="default">After</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">{item.category}</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      {item.improvement}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground">Trusted by fashion brands across Colombia</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-lg mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className="font-bold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-accent text-accent-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to elevate your fashion content?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the platform that's transforming fashion content creation
          </p>
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>48h delivery</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Professional quality</span>
            </div>
            <div className="flex items-center">
              <Star className="w-5 h-5 mr-2" />
              <span>5-star support</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link to="/dashboard/services/book">Book a Service</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent">
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Camera, CheckCircle, Clock, Users, Palette, Zap } from 'lucide-react';

const Photography: React.FC = () => {
  const packages = [
    {
      name: 'Starter',
      price: '$39',
      unit: 'per photo',
      description: 'Perfect for small collections',
      features: [
        '5 professional photos',
        'AI background removal',
        'Basic color correction',
        '48h delivery',
        'High-res downloads',
        'Social media formats'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Professional',
      price: '$149',
      unit: 'per session',
      description: 'Ideal for established brands',
      features: [
        '25 professional photos',
        'AI enhancement suite',
        'Advanced retouching',
        'Multiple angles per item',
        '24h express delivery',
        'All format exports',
        'Usage rights included',
        'Dedicated project manager'
      ],
      cta: 'Choose Pro',
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$499',
      unit: 'per collection',
      description: 'For large fashion houses',
      features: [
        '100+ professional photos',
        'Custom AI training',
        'Brand-specific presets',
        'Model coordination',
        'Same-day delivery',
        'Unlimited revisions',
        'White-glove service',
        'Dedicated creative team',
        'Analytics & insights'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const examples = [
    {
      category: 'Product Photography',
      image: '/api/placeholder/400/500',
      description: 'Clean, professional product shots with perfect lighting'
    },
    {
      category: 'Lifestyle Shots',
      image: '/api/placeholder/400/500',
      description: 'Models wearing your designs in natural settings'
    },
    {
      category: 'Detail Photography',
      image: '/api/placeholder/400/500',
      description: 'Close-up shots highlighting craftsmanship and materials'
    },
    {
      category: 'Flat Lay Styling',
      image: '/api/placeholder/400/500',
      description: 'Artistic arrangements perfect for social media'
    }
  ];

  const benefits = [
    {
      icon: Camera,
      title: 'Professional Equipment',
      description: 'State-of-the-art cameras and lighting setups for magazine-quality results'
    },
    {
      icon: Zap,
      title: 'AI Enhancement',
      description: 'Advanced AI technology for perfect color correction and background optimization'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Experienced fashion photographers who understand your brand aesthetic'
    },
    {
      icon: Palette,
      title: 'Brand Consistency',
      description: 'Maintain consistent visual identity across all your product imagery'
    }
  ];

  const faqs = [
    {
      question: 'What\'s included in a photography session?',
      answer: 'Each session includes professional photography, AI-powered post-processing, high-resolution files, and social media optimized formats. We also provide basic retouching and color correction.'
    },
    {
      question: 'How quickly can I receive my photos?',
      answer: 'Standard delivery is 48 hours for most packages. Professional and Enterprise clients can upgrade to 24-hour or same-day delivery for urgent projects.'
    },
    {
      question: 'Do you provide models and styling?',
      answer: 'Yes! Our Professional and Enterprise packages include access to our network of fashion models and stylists. We can coordinate the entire shoot for a seamless experience.'
    },
    {
      question: 'What file formats do you provide?',
      answer: 'We deliver high-resolution JPEGs, PNGs with transparent backgrounds, and optimized formats for Instagram, TikTok, and e-commerce platforms like Shopify and Amazon.'
    },
    {
      question: 'Can you match my brand\'s visual style?',
      answer: 'Absolutely! We create custom presets and AI training models based on your brand guidelines to ensure consistent visual identity across all photography.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-6 text-sm">
              <Camera className="w-4 h-4 mr-2" />
              Professional Fashion Photography
            </Badge>
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
              Magazine-quality photos in
              <span className="text-accent"> 48 hours</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-4xl mx-auto">
              Professional fashion photography with AI enhancement. Perfect for e-commerce, social media, and marketing campaigns.
            </p>
            
            {/* Key Benefits */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <div className="flex items-center justify-center p-4 bg-background/50 rounded-lg border">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">From $39/photo</span>
              </div>
              <div className="flex items-center justify-center p-4 bg-background/50 rounded-lg border">
                <Clock className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-sm font-medium">48h delivery</span>
              </div>
              <div className="flex items-center justify-center p-4 bg-background/50 rounded-lg border">
                <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                <span className="text-sm font-medium">AI enhanced</span>
              </div>
              <div className="flex items-center justify-center p-4 bg-background/50 rounded-lg border">
                <Users className="w-5 h-5 text-purple-500 mr-2" />
                <span className="text-sm font-medium">Expert team</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 px-4" id="packages">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Package</h2>
            <p className="text-xl text-muted-foreground">Transparent pricing for every stage of your fashion journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className={`relative ${pkg.popular ? 'border-accent border-2 shadow-xl' : 'border'}`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center p-8">
                  <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{pkg.price}</span>
                    <span className="text-muted-foreground ml-2">{pkg.unit}</span>
                  </div>
                  <CardDescription className="text-base">{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    asChild 
                    className={`w-full ${pkg.popular ? 'bg-accent hover:bg-accent/90' : ''}`}
                    variant={pkg.popular ? 'default' : 'outline'}
                  >
                    <Link to="/dashboard/services/book">{pkg.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Gallery */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Photography Styles</h2>
            <p className="text-xl text-muted-foreground">From product shots to lifestyle photography, we cover all your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {examples.map((example, index) => (
              <Card key={index} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="aspect-[4/5] overflow-hidden">
                  <img 
                    src={example.image} 
                    alt={example.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">{example.category}</h3>
                  <p className="text-sm text-muted-foreground">{example.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Photography</h2>
            <p className="text-xl text-muted-foreground">Professional results that elevate your fashion brand</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-6">
                  <benefit.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">Everything you need to know about our photography services</p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-background border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2 pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-accent text-accent-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to create stunning fashion photography?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of fashion brands already using our photography services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link to="/dashboard/services/book">Book Photography Session</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Photography;
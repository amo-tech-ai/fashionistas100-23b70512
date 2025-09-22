import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Target, BarChart3, Users, MessageCircle, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const CampaignServices: React.FC = () => {
  const packages = [
    {
      name: 'Launch',
      price: '$299',
      duration: 'monthly',
      features: [
        '2 platforms (Instagram + TikTok)',
        '8 posts per month',
        'Basic analytics',
        'Content calendar',
        '48h response time'
      ],
      popular: false,
      platforms: 2
    },
    {
      name: 'Growth',
      price: '$599',
      duration: 'monthly',
      features: [
        '4 platforms + WhatsApp',
        '20 posts per month',
        'Advanced analytics & insights',
        'Influencer outreach',
        'A/B testing',
        '24h response time',
        'Monthly strategy calls'
      ],
      popular: true,
      platforms: 4
    },
    {
      name: 'Scale',
      price: '$1,299',
      duration: 'monthly',
      features: [
        'All platforms + custom integrations',
        'Unlimited posts',
        'Real-time analytics dashboard',
        'Dedicated campaign manager',
        'Custom automations',
        '4h response time',
        'Weekly strategy sessions'
      ],
      popular: false,
      platforms: 'All'
    }
  ];

  const platforms = [
    { name: 'Instagram', icon: '📸', description: 'Stories, Posts, Reels optimization' },
    { name: 'TikTok', icon: '🎵', description: 'Viral content and trend integration' },
    { name: 'WhatsApp', icon: '💬', description: 'Direct customer communication' },
    { name: 'Shopify', icon: '🛍️', description: 'E-commerce integration' },
    { name: 'Amazon', icon: '📦', description: 'Marketplace optimization' },
    { name: 'Email', icon: '📧', description: 'Newsletter and drip campaigns' }
  ];

  const features = [
    {
      icon: Target,
      title: 'Smart Targeting',
      description: 'AI-powered audience segmentation and targeting for maximum ROI',
      benefit: 'Reach the right customers at the right time'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Track performance across all channels with unified reporting',
      benefit: 'Make data-driven decisions instantly'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Integration',
      description: 'Leverage Colombia\'s #1 communication channel for direct sales',
      benefit: 'Convert conversations into sales'
    },
    {
      icon: Users,
      title: 'Influencer Network',
      description: 'Connect with micro-influencers and brand ambassadors',
      benefit: 'Authentic brand advocacy and reach'
    }
  ];

  const caseStudies = [
    {
      brand: 'Elegance Boutique',
      challenge: 'Low Instagram engagement',
      solution: 'Content optimization + influencer partnerships',
      results: '+340% engagement, +85% sales',
      metric: '340%',
      metricLabel: 'Engagement Increase'
    },
    {
      brand: 'Urban Threads',
      challenge: 'WhatsApp customer service overload',
      solution: 'Automated workflows + smart responses',
      results: '70% faster response time, 95% satisfaction',
      metric: '70%',
      metricLabel: 'Faster Response'
    },
    {
      brand: 'Medellin Fashion Co.',
      challenge: 'Multi-platform management',
      solution: 'Unified campaign management',
      results: '200% reach increase, 50% cost reduction',
      metric: '200%',
      metricLabel: 'Reach Increase'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6">
              <Megaphone className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
              Omnichannel Fashion Campaigns
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8">
              From Instagram to WhatsApp, manage your entire fashion marketing ecosystem in one place
            </p>
            
            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-2 p-4 bg-card rounded-lg border">
                <Target className="w-5 h-5 text-accent" />
                <span>Smart targeting</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-4 bg-card rounded-lg border">
                <BarChart3 className="w-5 h-5 text-accent" />
                <span>Unified analytics</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-4 bg-card rounded-lg border">
                <MessageCircle className="w-5 h-5 text-accent" />
                <span>WhatsApp integration</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">All Your Channels, One Platform</h2>
            <p className="text-xl text-muted-foreground">Manage campaigns across every platform your customers use</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {platforms.map((platform, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{platform.icon}</div>
                <h3 className="text-xl font-bold mb-2">{platform.name}</h3>
                <p className="text-muted-foreground">{platform.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Campaign Features</h2>
            <p className="text-xl text-muted-foreground">Powerful tools for fashion marketing success</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground mb-3">{feature.description}</p>
                    <p className="text-sm font-medium text-accent">{feature.benefit}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Campaign Management Plans</h2>
            <p className="text-xl text-muted-foreground">From launch to scale, we've got your growth covered</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className={`relative overflow-hidden ${pkg.popular ? 'ring-2 ring-accent' : ''}`}>
                {pkg.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-accent text-accent-foreground text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardHeader className={pkg.popular ? 'pt-12' : 'pt-6'}>
                  <div className="text-center">
                    <CardTitle className="text-2xl mb-2">{pkg.name}</CardTitle>
                    <div className="text-4xl font-bold text-accent mb-2">{pkg.price}</div>
                    <CardDescription>{pkg.duration}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      {pkg.platforms} {typeof pkg.platforms === 'string' ? 'Platforms' : 'Platforms'}
                    </Badge>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    asChild 
                    className="w-full" 
                    variant={pkg.popular ? 'default' : 'outline'}
                  >
                    <Link to="/dashboard/services/book?service=campaigns&package=growth">
                      Start Campaign
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-muted-foreground">Real results from Colombian fashion brands</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <Card key={index} className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-accent mb-2">{study.metric}</div>
                  <div className="text-sm text-muted-foreground">{study.metricLabel}</div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg">{study.brand}</h3>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Challenge:</p>
                    <p className="text-sm">{study.challenge}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Solution:</p>
                    <p className="text-sm">{study.solution}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-accent">{study.results}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-accent text-accent-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to dominate Colombian fashion marketing?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Launch campaigns that convert across every channel your customers use
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link to="/dashboard/services/book?service=campaigns">
                Start Your Campaign
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent">
              <Link to="/contact">Get Strategy Call</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CampaignServices;
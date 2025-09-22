import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Wand2, Palette, Zap, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const AIServices: React.FC = () => {
  const packages = [
    {
      name: 'AI Essentials',
      price: '$9',
      unit: 'per image',
      features: [
        'Background removal/replacement',
        'Basic AI enhancement',
        'Color correction',
        'Instant processing',
        'HD output'
      ],
      popular: false,
      credits: 10
    },
    {
      name: 'AI Pro',
      price: '$49',
      unit: 'monthly',
      features: [
        '100 AI image credits',
        'Advanced style transfer',
        'Custom model training',
        'Batch processing',
        '4K output',
        'Priority support'
      ],
      popular: true,
      credits: 100
    },
    {
      name: 'AI Studio',
      price: '$199',
      unit: 'monthly',
      features: [
        '500 AI image credits',
        'Custom AI model creation',
        'Brand style consistency',
        'API access',
        'White-label solution',
        'Dedicated support'
      ],
      popular: false,
      credits: 500
    }
  ];

  const aiTools = [
    {
      icon: Palette,
      title: 'Style Transfer',
      description: 'Apply fashion aesthetics and brand styles to your products',
      example: 'Transform casual wear into high-fashion editorial looks'
    },
    {
      icon: Wand2,
      title: 'Background Magic',
      description: 'Remove, replace, or enhance backgrounds instantly',
      example: 'Place your products in luxury settings or clean studios'
    },
    {
      icon: Sparkles,
      title: 'Enhancement Pro',
      description: 'AI-powered color correction, lighting, and detail enhancement',
      example: 'Perfect lighting and colors for professional results'
    },
    {
      icon: Zap,
      title: 'Quick Generator',
      description: 'Generate product variations and styling options',
      example: 'Create multiple colorways and styling combinations'
    }
  ];

  const beforeAfter = [
    {
      category: 'Background Replacement',
      before: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&auto=format&fit=crop',
      after: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&auto=format&fit=crop',
      improvement: 'Professional studio background'
    },
    {
      category: 'Style Enhancement',
      before: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&auto=format&fit=crop',
      after: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&auto=format&fit=crop',
      improvement: 'Editorial fashion styling'
    },
    {
      category: 'Color Correction',
      before: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&auto=format&fit=crop',
      after: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&auto=format&fit=crop',
      improvement: 'Perfect color balance'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
              AI-Powered Fashion Studio
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8">
              Transform your fashion content with cutting-edge AI. Enhance, style, and perfect your products in seconds.
            </p>
            
            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-2 p-4 bg-card rounded-lg border">
                <Zap className="w-5 h-5 text-accent" />
                <span>Instant processing</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-4 bg-card rounded-lg border">
                <Sparkles className="w-5 h-5 text-accent" />
                <span>Professional quality</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-4 bg-card rounded-lg border">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>No design skills needed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Fashion Tools</h2>
            <p className="text-xl text-muted-foreground">Powerful AI capabilities at your fingertips</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aiTools.map((tool, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{tool.title}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground italic">
                      Example: {tool.example}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Studio Plans</h2>
            <p className="text-xl text-muted-foreground">Choose the perfect plan for your AI content needs</p>
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
                    <CardDescription>{pkg.unit}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      {pkg.credits} AI Credits
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
                    <Link to="/dashboard/services/book?service=ai&package=pro">
                      {pkg.name === 'AI Essentials' ? 'Try AI Tools' : 'Start Free Trial'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Examples */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Transformations</h2>
            <p className="text-xl text-muted-foreground">See the power of AI enhancement in action</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {beforeAfter.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-2">
                    <div className="relative">
                      <img src={item.before} alt="Before AI" className="w-full h-64 object-cover" />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary">Before AI</Badge>
                      </div>
                    </div>
                    <div className="relative">
                      <img src={item.after} alt="After AI" className="w-full h-64 object-cover" />
                      <div className="absolute top-4 left-4">
                        <Badge variant="default">After AI</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2">{item.category}</h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-green-500" />
                      {item.improvement}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-accent text-accent-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to transform your fashion content with AI?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of fashion brands using AI to create stunning content
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link to="/dashboard/services/book?service=ai">
                Start AI Studio Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent">
              <Link to="/contact">See AI Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AIServices;
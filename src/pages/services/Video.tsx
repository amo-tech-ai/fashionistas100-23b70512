import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Play, Camera, Users, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const VideoServices: React.FC = () => {
  const packages = [
    {
      name: 'Starter',
      price: '$199',
      duration: '1-2 hours',
      features: [
        'Product showcase video (30-60s)',
        'Basic color correction',
        '1 revision included',
        '24-48h delivery',
        'HD 1080p output'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$399',
      duration: '3-4 hours',
      features: [
        'Runway/lookbook video (2-3 min)',
        'Professional editing & grading',
        'Background music included',
        '3 revisions included',
        '24h delivery',
        '4K output available'
      ],
      popular: true
    },
    {
      name: 'Campaign',
      price: '$799',
      duration: 'Half day',
      features: [
        'Multi-format campaign videos',
        'Instagram/TikTok optimization',
        'Model casting included',
        'Advanced post-production',
        'Unlimited revisions',
        '12h express delivery',
        'Raw footage included'
      ],
      popular: false
    }
  ];

  const examples = [
    {
      type: 'Product Showcase',
      thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&auto=format&fit=crop',
      duration: '45s'
    },
    {
      type: 'Runway Coverage',
      thumbnail: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&auto=format&fit=crop',
      duration: '2:15'
    },
    {
      type: 'Brand Story',
      thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop',
      duration: '1:30'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
              <Video className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
              Professional Video Production
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8">
              From product showcases to runway coverage, create stunning videos that capture your fashion vision
            </p>
            
            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-2 p-4 bg-card rounded-lg border">
                <Clock className="w-5 h-5 text-accent" />
                <span>24-48h delivery</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-4 bg-card rounded-lg border">
                <Users className="w-5 h-5 text-accent" />
                <span>Model casting included</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-4 bg-card rounded-lg border">
                <CheckCircle className="w-5 h-5 text-accent" />
                <span>4K quality output</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Video Production Packages</h2>
            <p className="text-xl text-muted-foreground">Professional video content tailored to your needs</p>
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
                    <CardDescription>{pkg.duration} shoot time</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
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
                    <Link to="/dashboard/services/book?service=video&package=professional">
                      Book This Package
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Gallery */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Video Examples</h2>
            <p className="text-xl text-muted-foreground">See the quality we deliver for fashion brands</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {examples.map((example, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img 
                    src={example.thumbnail} 
                    alt={example.type}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                  <Badge className="absolute top-4 left-4 bg-black/60 text-white">
                    {example.duration}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">{example.type}</h3>
                  <p className="text-muted-foreground">Professional fashion video production</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Production Process</h2>
            <p className="text-xl text-muted-foreground">From concept to delivery in 48 hours</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Briefing', desc: 'Share your vision and requirements' },
              { step: '02', title: 'Pre-production', desc: 'Planning, casting, and scheduling' },
              { step: '03', title: 'Production', desc: 'Professional filming with your products' },
              { step: '04', title: 'Post & Delivery', desc: 'Editing, color grading, and final delivery' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-accent text-accent-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to create stunning fashion videos?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Book your video production package and get professional results in 48 hours
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link to="/dashboard/services/book?service=video">
                Book Video Production
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent">
              <Link to="/contact">Get Custom Quote</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VideoServices;
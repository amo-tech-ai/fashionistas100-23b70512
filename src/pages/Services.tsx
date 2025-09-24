import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Video, 
  Sparkles, 
  Megaphone, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  Star,
  Zap,
  Package,
  Palette,
  Globe,
  Users,
  TrendingUp,
  Shield,
  Award
} from 'lucide-react';

// Import sample images
import servicesHero from '@/assets/services-hero.jpg';
import productPhotographySamples from '@/assets/product-photography-samples.jpg';
import videoProductionSamples from '@/assets/video-production-samples.jpg';
import aiServicesSample from '@/assets/ai-services-sample.jpg';
import campaignShowcase from '@/assets/campaign-showcase.jpg';
import workflowDiagram from '@/assets/workflow-diagram.jpg';

const Services: React.FC = () => {
  const services = [
    {
      icon: Camera,
      title: 'Product Photography',
      description: 'On-model, ghost mannequin, flat lay - multi-angle coverage',
      features: ['Professional lighting', 'Ghost mannequin', 'Detail shots', 'Lifestyle photography'],
      price: 'From $39',
      image: productPhotographySamples,
      gradient: 'from-purple-600 via-purple-500 to-violet-600'
    },
    {
      icon: Video,
      title: 'Video Production',
      description: 'Runway recap, TikTok/Reels, brand stories',
      features: ['4K recording', 'Professional editing', 'Color grading', 'Multi-format delivery'],
      price: 'From $199',
      image: videoProductionSamples,
      gradient: 'from-amber-600 via-orange-500 to-yellow-600'
    },
    {
      icon: Package,
      title: 'Media Packs',
      description: 'Launch Pack, Runway Pack, Sponsor Pack bundles',
      features: ['Photo + Video combo', 'Social media assets', 'E-commerce ready', 'Bulk pricing'],
      price: 'From $299',  
      image: campaignShowcase,
      gradient: 'from-emerald-600 via-teal-500 to-cyan-600'
    },
    {
      icon: Users,
      title: 'Pro Services',
      description: 'Casting, styling, creative direction',
      features: ['Professional casting', 'Art direction', 'Styling services', 'Location scouting'],
      price: 'Custom',
      image: servicesHero,
      gradient: 'from-rose-600 via-pink-500 to-fuchsia-600'
    },
    {
      icon: Sparkles,
      title: 'Post-Production',
      description: 'AI retouching, batch editing, color correction',
      features: ['AI enhancement', 'Background removal', 'Color matching', 'Batch processing'],
      price: 'From $9',
      image: aiServicesSample,
      gradient: 'from-indigo-600 via-blue-500 to-cyan-600'
    },
    {
      icon: Globe,
      title: 'Integrations',
      description: 'Shopify, Amazon, Instagram/TikTok, WhatsApp',
      features: ['E-commerce sync', 'Social publishing', 'WhatsApp delivery', 'Analytics tracking'],
      price: 'From $99',
      image: workflowDiagram,
      gradient: 'from-slate-600 via-gray-500 to-zinc-600'
    }
  ];

  const useCases = [
    {
      title: 'Designer Launch',
      description: 'From concept to Shopify store in 48 hours',
      result: '300% sales lift in first month',
      image: productPhotographySamples,
      tags: ['E-commerce', 'Product Photography', 'Launch Pack']
    },
    {
      title: 'Fashion Week Recap',
      description: 'Complete runway coverage with sponsor assets',
      result: '95% sponsor renewal rate',
      image: videoProductionSamples,
      tags: ['Video Production', 'Event Coverage', 'Sponsor Pack']
    },
    {
      title: 'Influencer Campaign',
      description: 'Multi-platform content for brand activation',
      result: '2.5M impressions, 15% engagement',
      image: campaignShowcase,
      tags: ['Social Media', 'Campaigns', 'Content Creation']
    }
  ];

  const workflowSteps = [
    {
      number: '01',
      title: 'Prep & Shot List',
      description: 'Brief consultation, style guide review, shot list creation',
      duration: '2-4 hours'
    },
    {
      number: '02', 
      title: 'Production',
      description: 'Professional photography/video with on-site team',
      duration: '4-8 hours'
    },
    {
      number: '03',
      title: 'Post-Production',
      description: 'AI enhancement, editing, color correction, retouching',
      duration: '24-36 hours'
    },
    {
      number: '04',
      title: 'Delivery & Integration',
      description: 'Multi-format delivery, direct platform integration',
      duration: '2-6 hours'
    }
  ];

  const comparisonFeatures = [
    { feature: 'Turnaround Time', traditional: '2-4 weeks', fashionistas: '48 hours', advantage: true },
    { feature: 'Cost per Photo', traditional: '$150-300', fashionistas: '$39-89', advantage: true },
    { feature: 'Multi-Channel Delivery', traditional: 'Manual', fashionistas: 'Automated', advantage: true },
    { feature: 'AI Enhancement', traditional: 'Not included', fashionistas: 'Standard', advantage: true },
    { feature: 'ROI Tracking', traditional: 'Limited', fashionistas: 'Real-time', advantage: true },
    { feature: 'Revisions', traditional: '1-2 rounds', fashionistas: 'Unlimited', advantage: true }
  ];

  const testimonials = [
    {
      quote: "Fashionistas transformed our entire content strategy. From 3 weeks to 48 hours - incredible!",
      author: "Isabella Martínez",
      role: "Creative Director, Elegancia Moderna",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      quote: "The AI enhancement feature is game-changing. Our products look premium without the premium cost.",
      author: "Diego Rodríguez", 
      role: "Founder, Urban Threads Colombia",
      rating: 5,
      image: "/api/placeholder/60/60"
    },
    {
      quote: "Their runway coverage doubled our sponsor engagement. Best investment we've made.",
      author: "Camila Torres",
      role: "Event Director, Bogotá Fashion Week",
      rating: 5,
      image: "/api/placeholder/60/60"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${servicesHero})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <Badge variant="secondary" className="mb-6 text-sm bg-white/20 text-white border-white/30">
            Professional Fashion Media Services
          </Badge>
          <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight">
            High-Fashion Media.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400">
              E-commerce Results.
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-4xl mx-auto leading-relaxed">
            48-hour delivery, multi-angle coverage, market-ready assets. 
            Professional photography, video, and AI-powered content creation for fashion brands.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button size="lg" className="text-lg px-12 py-6 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700">
              Book a Shoot
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-12 py-6 border-white/30 text-white hover:bg-white/10">
              View Media Packs
            </Button>
          </div>
          
          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-amber-400 mb-2">48h</div>
              <div className="text-sm text-white/80">Delivery Time</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-purple-400 mb-2">$39</div>
              <div className="text-sm text-white/80">Starting Price</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">  
              <div className="text-3xl font-bold text-emerald-400 mb-2">500+</div>
              <div className="text-sm text-white/80">Brands Served</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-rose-400 mb-2">98%</div>
              <div className="text-sm text-white/80">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">Our Services</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Complete Media Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From product photography to full campaign management - everything you need to succeed in fashion e-commerce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group overflow-hidden border-2 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-80`} />
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {service.price}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">Success Stories</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Real Results, Real ROI
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how fashion brands are achieving incredible results with our media services
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-56">
                  <img 
                    src={useCase.image} 
                    alt={useCase.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {useCase.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>  
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
                  <p className="text-muted-foreground mb-4">{useCase.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-emerald-600">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      <span className="font-semibold text-sm">{useCase.result}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      View Case Study
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">Our Process</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              From Concept to Campaign
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our streamlined 4-step process delivers professional results in record time
            </p>
          </div>

          <div className="relative">
            {/* Workflow Visual */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-purple-500 via-amber-500 to-emerald-500 transform -translate-y-1/2" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {workflowSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="text-center">
                    <div className="relative z-10 w-20 h-20 mx-auto bg-gradient-to-br from-purple-600 to-amber-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground mb-4">{step.description}</p>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {step.duration}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">Why Choose Us</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Traditional vs Fashionistas
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See the difference in speed, cost, and results
            </p>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-6 font-bold text-lg">Feature</th>
                    <th className="text-center p-6 font-bold text-lg text-muted-foreground">Traditional Agencies</th>
                    <th className="text-center p-6 font-bold text-lg bg-primary/5">
                      <div className="flex items-center justify-center">
                        <Award className="w-5 h-5 mr-2 text-primary" />
                        Fashionistas
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-6 font-medium">{item.feature}</td>
                      <td className="p-6 text-center text-muted-foreground">{item.traditional}</td>
                      <td className="p-6 text-center bg-primary/5">
                        <div className="flex items-center justify-center">
                          <span className="font-semibold text-primary mr-2">{item.fashionistas}</span>
                          {item.advantage && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* Image Showcase */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">Our Work</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Portfolio Showcase
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From product shots to runway coverage - see our professional work in action
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative group overflow-hidden rounded-xl">
              <img 
                src={productPhotographySamples} 
                alt="Product Photography Samples"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Product Photography
                </Badge>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-xl">
              <img 
                src={videoProductionSamples} 
                alt="Video Production Samples"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Video Production
                </Badge>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-xl">
              <img 
                src={campaignShowcase} 
                alt="Campaign Showcase"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Campaign Materials
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">Client Success</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted by Leading Brands
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Fashion brands across Colombia choose Fashionistas for professional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="text-lg mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <div className="font-bold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Shield className="w-12 h-12 mb-4 text-emerald-500" />
              <div className="text-2xl font-bold mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Money-Back Guarantee</div>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="w-12 h-12 mb-4 text-amber-500" />
              <div className="text-2xl font-bold mb-2">48h</div>
              <div className="text-sm text-muted-foreground">Delivery Promise</div>
            </div>
            <div className="flex flex-col items-center">
              <Award className="w-12 h-12 mb-4 text-purple-500" />
              <div className="text-2xl font-bold mb-2">5★</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-12 h-12 mb-4 text-blue-500" />
              <div className="text-2xl font-bold mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Happy Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-gradient-to-r from-primary-black to-muted-foreground text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
            Ready to Launch Your Campaign?
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to elevate your 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-400"> fashion content?</span>
          </h2>
          <p className="text-xl mb-12 opacity-90 max-w-3xl mx-auto">
            Join 500+ fashion brands who trust Fashionistas for professional media services. 
            48-hour delivery, guaranteed quality, unlimited revisions.
          </p>
          
          <div className="flex items-center justify-center gap-8 mb-12">
            <div className="flex items-center">
              <Clock className="w-6 h-6 mr-3 text-amber-400" />
              <span className="text-lg">48h delivery</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 mr-3 text-emerald-400" />
              <span className="text-lg">Professional quality</span>
            </div>
            <div className="flex items-center">
              <Star className="w-6 h-6 mr-3 text-purple-400" />
              <span className="text-lg">5-star support</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="text-lg px-12 py-6 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700">
              <Link to="/dashboard/services/book">Book Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-12 py-6 border-white/30 text-white hover:bg-white/10">
              <Link to="/contact">Talk to a Producer</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-lg px-12 py-6 text-white hover:bg-white/10">
              <Link to="/services/pricing">Download Rate Card</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
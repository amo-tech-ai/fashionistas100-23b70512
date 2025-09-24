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
  Award,
  Play,
  Edit3,
  Send
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

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
      image: productPhotographySamples
    },
    {
      icon: Video,
      title: 'Video Production',
      description: 'Runway recap, TikTok/Reels, brand stories',
      features: ['4K recording', 'Professional editing', 'Color grading', 'Multi-format delivery'],
      price: 'From $199',
      image: videoProductionSamples
    },
    {
      icon: Package,
      title: 'Media Packs',
      description: 'Launch Pack, Runway Pack, Sponsor Pack bundles',
      features: ['Photo + Video combo', 'Social media assets', 'E-commerce ready', 'Bulk pricing'],
      price: 'From $299',  
      image: campaignShowcase
    },
    {
      icon: Users,
      title: 'Pro Services',
      description: 'Casting, styling, creative direction',
      features: ['Professional casting', 'Art direction', 'Styling services', 'Location scouting'],
      price: 'Custom',
      image: servicesHero
    },
    {
      icon: Sparkles,
      title: 'Post-Production',
      description: 'AI retouching, batch editing, color correction',
      features: ['AI enhancement', 'Background removal', 'Color matching', 'Batch processing'],
      price: 'From $9',
      image: aiServicesSample
    },
    {
      icon: Globe,
      title: 'Integrations',
      description: 'Shopify, Amazon, Instagram/TikTok, WhatsApp',
      features: ['E-commerce sync', 'Social publishing', 'WhatsApp delivery', 'Analytics tracking'],
      price: 'From $99',
      image: workflowDiagram
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
      icon: Edit3,
      title: 'Prep & Shot List',
      description: 'Define concepts, angles, and style direction',
      duration: '2-4 hours'
    },
    {
      icon: Camera, 
      title: 'Production',
      description: 'Professional photography/video with on-site team',
      duration: '4-8 hours'
    },
    {
      icon: Sparkles,
      title: 'Post-Production',
      description: 'AI enhancement, editing, color correction, retouching',
      duration: '24-36 hours'
    },
    {
      icon: Send,
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
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${servicesHero})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center text-white pt-20">
          <Badge variant="secondary" className="mb-6 text-sm bg-white/10 text-white border-white/20">
            Professional Fashion Media Services
          </Badge>
          <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            High-Fashion Media.
            <br />
            <span className="text-white">E-commerce Results.</span>
          </h1>
          <p className="text-lg md:text-xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed">
            48-hour delivery, multi-angle coverage, market-ready assets. 
            Professional photography, video, and AI-powered content creation for fashion brands.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="text-lg px-8 py-4 bg-white text-black hover:bg-white/90">
              Book a Shoot
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10">
              View Media Packs
            </Button>
          </div>
          
          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-white mb-1">48h</div>
              <div className="text-sm text-white/70">Delivery Time</div>
            </div>
            <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-white mb-1">$39</div>
              <div className="text-sm text-white/70">Starting Price</div>
            </div>
            <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">  
              <div className="text-2xl font-bold text-white mb-1">500+</div>
              <div className="text-sm text-white/70">Brands Served</div>
            </div>
            <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-white mb-1">98%</div>
              <div className="text-sm text-white/70">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
              Complete Media Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From product photography to full campaign management - everything you need to succeed in fashion e-commerce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="group overflow-hidden border hover:shadow-lg transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-4 left-4">
                    <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <service.icon className="w-5 h-5 text-black" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-black border-0">
                      {service.price}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg mb-2 text-black">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600">{service.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 mr-2 text-black" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-black text-white hover:bg-gray-800">
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
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
              Real Results, Real ROI
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how fashion brands are achieving incredible results with our media services
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative h-48">
                  <img 
                    src={useCase.image} 
                    alt={useCase.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {useCase.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-white/90 text-black text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>  
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-3 text-black">{useCase.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{useCase.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-black">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      <span className="font-semibold text-sm">{useCase.result}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-black hover:bg-gray-100">
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
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our streamlined 4-step process delivers professional results in record time
            </p>
          </div>

          <div className="relative">
            {/* Desktop connecting line */}
            <div className="hidden lg:block absolute top-16 left-1/2 transform -translate-x-1/2 w-3/4 h-px bg-gray-200" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {workflowSteps.map((step, index) => (
                <div key={index} className="relative text-center">
                  <div className="relative z-10 w-16 h-16 mx-auto bg-black rounded-full flex items-center justify-center text-white mb-6">
                    <step.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-black">{step.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{step.description}</p>
                  <div className="text-xs text-gray-500 flex items-center justify-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {step.duration}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button className="bg-black text-white hover:bg-gray-800">
                Book Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
              Portfolio Showcase
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From product shots to runway coverage - see our professional work in action
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative group overflow-hidden rounded-lg">
              <img 
                src={productPhotographySamples} 
                alt="Product Photography Samples"
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Badge variant="secondary" className="bg-white/90 text-black">
                  Product Photography
                </Badge>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg">
              <img 
                src={videoProductionSamples} 
                alt="Video Production Samples"
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Badge variant="secondary" className="bg-white/90 text-black">
                  Video Production
                </Badge>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg">
              <img 
                src={campaignShowcase} 
                alt="Campaign Showcase"
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Badge variant="secondary" className="bg-white/90 text-black">
                  Campaign Materials
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
              Trusted by Leading Brands
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fashion brands across Colombia choose Fashionistas for professional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-black text-black" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <div className="font-bold text-black text-sm">{testimonial.author}</div>
                    <div className="text-xs text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Shield className="w-10 h-10 mb-3 text-black" />
              <div className="text-xl font-bold mb-1 text-black">100%</div>
              <div className="text-sm text-gray-600">Money-Back Guarantee</div>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="w-10 h-10 mb-3 text-black" />
              <div className="text-xl font-bold mb-1 text-black">48h</div>
              <div className="text-sm text-gray-600">Delivery Promise</div>
            </div>
            <div className="flex flex-col items-center">
              <Award className="w-10 h-10 mb-3 text-black" />
              <div className="text-xl font-bold mb-1 text-black">5★</div>
              <div className="text-sm text-gray-600">Average Rating</div>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-10 h-10 mb-3 text-black" />
              <div className="text-xl font-bold mb-1 text-black">500+</div>
              <div className="text-sm text-gray-600">Happy Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to elevate your fashion content?
          </h2>
          <p className="text-lg mb-12 text-gray-300 max-w-2xl mx-auto">
            Join 500+ fashion brands who trust Fashionistas for professional media services. 
            48-hour delivery, guaranteed quality, unlimited revisions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-2xl mx-auto">
            <div className="flex items-center justify-center">
              <Clock className="w-5 h-5 mr-2 text-white" />
              <span>48h delivery</span>
            </div>
            <div className="flex items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2 text-white" />
              <span>Professional quality</span>
            </div>
            <div className="flex items-center justify-center">
              <Star className="w-5 h-5 mr-2 text-white" />
              <span>5-star support</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100">
              <Link to="/dashboard/services/book">Book Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link to="/contact">Talk to a Producer</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-white hover:bg-white/10">
              <Link to="/services/pricing">Download Rate Card</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Services;
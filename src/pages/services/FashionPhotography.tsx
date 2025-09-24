import React from 'react';
import productPhotographySamples from '@/assets/product-photography-samples.jpg';
import campaignShowcase from '@/assets/campaign-showcase.jpg';
import designerSpotlight from '@/assets/designer-spotlight.jpg';
import videoProductionSamples from '@/assets/video-production-samples.jpg';
import aiServicesSample from '@/assets/ai-services-sample.jpg';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { 
  Camera, 
  Clock, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Users,
  TrendingUp,
  Eye,
  Palette,
  Settings
} from 'lucide-react';

const FashionPhotography = () => {
  const packages = [
    {
      title: "Studio Photography",
      description: "Multi-angle, white background, ghost mannequin",
      image: "/src/assets/product-photography-samples.jpg",
      features: ["White background", "Ghost mannequin", "Multi-angle shots", "Batch editing"]
    },
    {
      title: "On-Model Photography", 
      description: "Professional casting, styling, full looks",
      image: "/src/assets/campaign-showcase.jpg",
      features: ["Model casting", "Professional styling", "Full looks", "Lifestyle shots"]
    },
    {
      title: "Creative Direction",
      description: "Props, sets, AI style matching",
      image: designerSpotlight,
      features: ["Custom props", "Set design", "AI style matching", "Brand alignment"]
    }
  ];

  const processSteps = [
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Prep & Shot List",
      description: "Define concepts, angles, and style direction"
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Studio Production", 
      description: "Professional photography with expert lighting"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Post-Production",
      description: "AI retouching, color correction, batch editing"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Fast Delivery",
      description: "48-hour delivery, multi-platform ready"
    }
  ];

  const stats = [
    { value: "48h", label: "Delivery Time" },
    { value: "$39", label: "Per Photo" }, 
    { value: "500+", label: "Happy Clients" },
    { value: "98%", label: "Satisfaction" }
  ];

  const integrations = [
    { name: "Shopify", logo: "🛒" },
    { name: "Instagram", logo: "📸" },
    { name: "TikTok", logo: "🎵" },
    { name: "Amazon", logo: "📦" },
    { name: "WhatsApp", logo: "💬" }
  ];

  const testimonials = [
    {
      quote: "Fashionistas transformed our product catalog. Sales increased 40% after switching to their photography.",
      name: "Maria Rodriguez",
      title: "Designer, Elegancia Boutique",
      image: designerSpotlight
    },
    {
      quote: "The 48-hour delivery is game-changing. We can launch collections faster than ever.",
      name: "Carlos Mendez", 
      title: "Creative Director, Moda Latina",
      image: campaignShowcase
    }
  ];

  const faqs = [
    {
      question: "What's included in a photography shoot?",
      answer: "Every shoot includes professional lighting, multiple angles, white background, ghost mannequin editing, color correction, and platform-ready formats."
    },
    {
      question: "How fast is delivery?",
      answer: "We guarantee 48-hour delivery for all photography services. Rush delivery (24h) available for additional fee."
    },
    {
      question: "Do you provide models and styling?",
      answer: "Yes, our on-model packages include professional casting, styling, and creative direction to match your brand aesthetic."
    },
    {
      question: "What file formats do you deliver?",
      answer: "We deliver high-resolution JPGs, PNGs with transparency, and custom sizes optimized for Shopify, Amazon, Instagram, and TikTok."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Fashion Photography that 
                <span className="text-yellow-500"> Elevates</span> Your Brand
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Fast, fashion-grade photography optimized for e-commerce & campaigns. 
                From studio to storefront in 48 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                  Book a Shoot <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg">
                  View Packages
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/src/assets/product-photography-samples.jpg"
                alt="Fashion Photography Studio"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase Grid - Masonry Style */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Work Speaks</h2>
            <p className="text-gray-600">Professional photography that drives sales and engagement</p>
          </div>
          
          {/* Masonry Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {/* On-Model Photography */}
            <div className="group relative overflow-hidden rounded-xl break-inside-avoid mb-4 cursor-pointer">
              <img 
                src={campaignShowcase}
                alt="On-model fashion photography"
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    On-Model
                  </span>
                </div>
              </div>
            </div>

            {/* Studio Product Shot */}
            <div className="group relative overflow-hidden rounded-xl break-inside-avoid mb-4 cursor-pointer">
              <img 
                src={productPhotographySamples}
                alt="Studio product photography"
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    Studio Product
                  </span>
                </div>
              </div>
            </div>

            {/* Editorial Style */}
            <div className="group relative overflow-hidden rounded-xl break-inside-avoid mb-4 cursor-pointer">
              <img 
                src={designerSpotlight}
                alt="Editorial fashion photography"
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    Editorial
                  </span>
                </div>
              </div>
            </div>

            {/* Flat Lay */}
            <div className="group relative overflow-hidden rounded-xl break-inside-avoid mb-4 cursor-pointer">
              <img 
                src={aiServicesSample}
                alt="Flat lay product photography"
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    Flat Lay
                  </span>
                </div>
              </div>
            </div>

            {/* Lifestyle Shot */}
            <div className="group relative overflow-hidden rounded-xl break-inside-avoid mb-4 cursor-pointer">
              <img 
                src={videoProductionSamples}
                alt="Lifestyle fashion photography"
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    Lifestyle
                  </span>
                </div>
              </div>
            </div>

            {/* Ghost Mannequin */}
            <div className="group relative overflow-hidden rounded-xl break-inside-avoid mb-4 cursor-pointer">
              <img 
                src={campaignShowcase}
                alt="Ghost mannequin photography"
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    Ghost Mannequin
                  </span>
                </div>
              </div>
            </div>

            {/* Detail Shots */}
            <div className="group relative overflow-hidden rounded-xl break-inside-avoid mb-4 cursor-pointer">
              <img 
                src={productPhotographySamples}
                alt="Detail product photography"
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    Detail Shots
                  </span>
                </div>
              </div>
            </div>

            {/* Brand Campaign */}
            <div className="group relative overflow-hidden rounded-xl break-inside-avoid mb-4 cursor-pointer">
              <img 
                src={designerSpotlight}
                alt="Brand campaign photography"
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    Brand Campaign
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button className="bg-black text-white hover:bg-gray-800">
              View Full Portfolio <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Service Packages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Photography Packages</h2>
            <p className="text-gray-600">Choose the perfect package for your brand needs</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <img 
                  src={pkg.image}
                  alt={pkg.title}
                  className="w-full h-48 object-cover rounded-lg mb-6"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{pkg.title}</h3>
                <p className="text-gray-600 mb-6">{pkg.description}</p>
                <ul className="space-y-2 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-black text-white hover:bg-gray-800">
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">From Studio to Storefront in 48 Hours</h2>
            <p className="text-gray-600">Our streamlined process ensures quality and speed</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
                {index < processSteps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 w-6 h-6 text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl font-bold text-yellow-500 mb-2">{stat.value}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Media, Ready for Every Platform</h2>
          <p className="text-gray-600 mb-12">Optimized formats for all your sales channels</p>
          
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {integrations.map((integration, index) => (
              <div key={index} className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
                <span className="text-2xl">{integration.logo}</span>
                <span className="font-medium text-gray-900">{integration.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Elevate Your Brand?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join 500+ fashion brands who trust Fashionistas for professional photography services.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800">
              Book Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg">
              Talk to a Producer
            </Button>
            <Button variant="ghost" size="lg">
              Download Rate Card
            </Button>
          </div>
          
          <div className="flex justify-center gap-8 mt-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              48h delivery
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Professional quality
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              5-star support
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FashionPhotography;
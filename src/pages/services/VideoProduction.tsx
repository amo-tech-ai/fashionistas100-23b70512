import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import Footer from '@/components/Footer';
import { 
  Video, 
  Play, 
  Clock, 
  Star, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Users,
  TrendingUp,
  Eye,
  Palette,
  Settings,
  Camera,
  Edit,
  Upload
} from 'lucide-react';

const VideoProduction = () => {
  const packages = [
    {
      title: "Runway Recap",
      description: "Live event coverage, highlights, professional editing",
      image: "/src/assets/runway-1.jpg",
      features: ["Multi-camera setup", "Live streaming", "Same-day highlights", "Social media cuts"],
      price: "From $299"
    },
    {
      title: "E-commerce Video", 
      description: "On-model try-ons, styling demos, product features",
      image: "/src/assets/campaign-showcase.jpg",
      features: ["Model casting", "Product demos", "Multiple angles", "Platform optimization"],
      price: "From $199"
    },
    {
      title: "Social Shorts",
      description: "TikTok/Reels content, influencer-style videos",
      image: "/src/assets/designer-spotlight.jpg", 
      features: ["Vertical format", "Trending effects", "Quick turnaround", "Engagement optimized"],
      price: "From $99"
    }
  ];

  const processSteps = [
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Prep & Creative Brief",
      description: "Define video concept, style, and shot list"
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Video Production", 
      description: "Professional filming with expert lighting and direction"
    },
    {
      icon: <Edit className="w-6 h-6" />,
      title: "Post-Production",
      description: "Color grading, music, effects, and platform optimization"
    },
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Multi-Platform Delivery",
      description: "Optimized formats for all your channels"
    }
  ];

  const stats = [
    { value: "48h", label: "Delivery Time" },
    { value: "500+", label: "Videos Created" }, 
    { value: "98%", label: "Client Satisfaction" },
    { value: "3x", label: "Avg. Engagement Boost" }
  ];

  const integrations = [
    { name: "TikTok", logo: "🎵" },
    { name: "Instagram", logo: "📸" },
    { name: "YouTube", logo: "📹" },
    { name: "Shopify", logo: "🛒" },
    { name: "WhatsApp", logo: "💬" }
  ];

  const caseStudies = [
    {
      title: "Designer Campaign Launch",
      description: "360% increase in social engagement",
      image: "/src/assets/campaign-showcase.jpg",
      metrics: "360% engagement increase"
    },
    {
      title: "Fashion Week Recap",
      description: "1M+ views across platforms", 
      image: "/src/assets/runway-2.jpg",
      metrics: "1M+ views"
    },
    {
      title: "Influencer Activation",
      description: "50% conversion rate improvement",
      image: "/src/assets/designer-spotlight.jpg",
      metrics: "50% conversion boost"
    }
  ];

  const testimonials = [
    {
      quote: "Fashionistas' video content doubled our engagement in just 2 weeks. The quality is outstanding.",
      name: "Sofia Martinez",
      title: "Brand Manager, Moda Colombiana",
      image: "/src/assets/designer-spotlight.jpg"
    },
    {
      quote: "The runway recap videos captured our event perfectly. Professional quality at an amazing price.",
      name: "Diego Herrera", 
      title: "Event Director, Bogotá Fashion Week",
      image: "/src/assets/campaign-showcase.jpg"
    }
  ];

  const faqs = [
    {
      question: "What's included in video production?",
      answer: "Every video includes professional filming, lighting, editing, color grading, music licensing, and delivery in multiple formats optimized for different platforms."
    },
    {
      question: "How fast is video delivery?",
      answer: "Standard delivery is 48 hours. We also offer 24-hour rush delivery for urgent projects at an additional cost."
    },
    {
      question: "Do you handle casting and styling?",
      answer: "Yes, our full-service packages include model casting, professional styling, and creative direction to ensure your brand vision comes to life."
    },
    {
      question: "What video formats do you deliver?",
      answer: "We deliver optimized formats for TikTok (9:16), Instagram (1:1, 9:16, 16:9), YouTube (16:9), and custom formats for your specific needs."
    },
    {
      question: "Can you edit existing footage?",
      answer: "Absolutely! We offer post-production services for your existing footage including color grading, music, effects, and platform optimization."
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
                All-in-One Fashion
                <span className="text-yellow-500"> Video Solutions</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                48-hour delivery, TikTok/Reels, runway recaps, campaign videos. 
                Professional quality that drives engagement and sales.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                  Book a Shoot <Video className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg">
                  View Video Packs
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl flex items-center justify-center">
                <div className="relative">
                  <img 
                    src="/src/assets/runway-1.jpg"
                    alt="Video Production Studio"
                    className="rounded-xl w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
                    <Play className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Options Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Video Production Services</h2>
            <p className="text-gray-600">From concept to delivery, we handle everything</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border">
                <div className="aspect-video mb-6 rounded-lg overflow-hidden relative">
                  <img 
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{pkg.title}</h3>
                  <span className="text-yellow-600 font-semibold">{pkg.price}</span>
                </div>
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

      {/* Video Showcase Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Video Work</h2>
            <p className="text-gray-600">Professional videos that drive engagement and sales</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { src: "/src/assets/runway-1.jpg", type: "Runway Recap", duration: "2:30" },
              { src: "/src/assets/campaign-showcase.jpg", type: "E-commerce", duration: "0:45" },
              { src: "/src/assets/designer-spotlight.jpg", type: "Social Short", duration: "0:15" },
              { src: "/src/assets/runway-2.jpg", type: "Fashion Show", duration: "1:15" },
              { src: "/src/assets/video-production-samples.jpg", type: "Product Demo", duration: "1:00" },
              { src: "/src/assets/runway-3.jpg", type: "Behind Scenes", duration: "0:30" }
            ].map((video, index) => (
              <div key={index} className="group relative aspect-video rounded-xl overflow-hidden">
                <img 
                  src={video.src}
                  alt={`${video.type} video`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-between items-center text-white">
                    <span className="text-sm font-medium">{video.type}</span>
                    <span className="text-sm bg-black/50 px-2 py-1 rounded">{video.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600">From concept to delivery in 4 simple steps</p>
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

      {/* Portfolio / Case Studies */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-gray-600">Real results from fashion brands we've worked with</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-video relative">
                  <img 
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{study.title}</h3>
                  <p className="text-gray-600 mb-4">{study.description}</p>
                  <div className="text-yellow-600 font-semibold">{study.metrics}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Videos, Ready for Every Channel</h2>
          <p className="text-gray-600 mb-12">Optimized formats for all your platforms</p>
          
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {integrations.map((integration, index) => (
              <div key={index} className="flex items-center gap-2 bg-gray-50 px-6 py-3 rounded-lg">
                <span className="text-2xl">{integration.logo}</span>
                <span className="font-medium text-gray-900">{integration.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic text-lg">"{testimonial.quote}"</p>
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
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Launch Your Next Fashion Video Campaign?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join 500+ fashion brands who trust Fashionistas for professional video services. 
            48-hour delivery, guaranteed quality, unlimited revisions.
          </p>
          <div className="flex justify-center gap-4 flex-wrap mb-8">
            <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-400">
              Book Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
              Talk to a Producer
            </Button>
            <Button variant="ghost" size="lg" className="text-white hover:bg-white/10">
              Download Rate Card
            </Button>
          </div>
          
          <div className="flex justify-center gap-8 text-sm text-gray-400">
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

export default VideoProduction;
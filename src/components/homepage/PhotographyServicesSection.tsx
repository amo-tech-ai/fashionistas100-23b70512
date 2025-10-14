import { Button } from "@/components/ui/button";
import { Camera, Video, Image, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export const PhotographyServicesSection = () => {
  const services = [
    "Full event coverage with multiple photographers",
    "Designer lookbook and portfolio shoots",
    "Cinematic video production and editing",
    "Same-day photo delivery for social media",
    "Drone footage for unique perspectives",
    "Professional editing and retouching",
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image Side */}
            <div className="relative rounded-2xl overflow-hidden shadow-elegant group">
              <img
                src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=600&fit=crop"
                alt="Professional fashion photography"
                className="w-full h-[400px] lg:h-[500px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex gap-3">
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-3">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-3">
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-3">
                    <Image className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-[hsl(var(--breef-orange))]/10 text-[hsl(var(--breef-orange))] px-4 py-2 rounded-full mb-4">
                  <Camera className="h-4 w-4" />
                  <span className="font-inter text-sm font-medium">Professional Services</span>
                </div>
                <h2 className="font-inter text-3xl md:text-4xl lg:text-5xl font-light text-[hsl(var(--breef-dark))] mb-4">
                  Event Photography & Video Production
                </h2>
                <p className="font-inter text-lg text-[hsl(var(--breef-gray))] leading-relaxed">
                  Capture the essence of your fashion event with our team of professional photographers and videographers. 
                  We specialize in high-end fashion coverage that showcases your brand's unique vision.
                </p>
              </div>

              <div className="space-y-3">
                {services.map((service, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-[hsl(var(--breef-orange))] flex-shrink-0 mt-0.5" />
                    <span className="font-inter text-base text-[hsl(var(--breef-dark))]">
                      {service}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link to="/services">
                  <Button
                    size="lg"
                    className="bg-[hsl(var(--breef-orange))] text-white h-14 px-10 rounded-full hover:bg-[hsl(var(--breef-orange))]/90 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    View Photography Packages
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-[hsl(var(--border-strong))]">
                <div>
                  <div className="font-inter text-2xl font-semibold text-[hsl(var(--breef-dark))]">500+</div>
                  <div className="font-inter text-sm text-[hsl(var(--breef-gray))]">Events Covered</div>
                </div>
                <div>
                  <div className="font-inter text-2xl font-semibold text-[hsl(var(--breef-dark))]">50k+</div>
                  <div className="font-inter text-sm text-[hsl(var(--breef-gray))]">Photos Delivered</div>
                </div>
                <div>
                  <div className="font-inter text-2xl font-semibold text-[hsl(var(--breef-dark))]">24hr</div>
                  <div className="font-inter text-sm text-[hsl(var(--breef-gray))]">Quick Turnaround</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

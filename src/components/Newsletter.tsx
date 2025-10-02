import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mail, CheckCircle2, Sparkles, MessageCircle } from "lucide-react";

export const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      // Reset after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-4xl">
        {/* Header - Breef Style */}
        <div className="text-center space-y-6 mb-12">
          <h2 className="font-inter text-3xl md:text-5xl font-light text-[hsl(var(--breef-dark))]">
            Stay in the loop
          </h2>
          <p className="font-inter text-lg text-[hsl(var(--breef-gray))] max-w-2xl mx-auto">
            Get exclusive access to fashion week schedules, designer spotlights, and early-bird ticket releases.
          </p>
        </div>

        {/* Newsletter Form - Breef card style */}
        <div className="bg-[hsl(var(--breef-cream))] rounded-2xl p-8 md:p-12 shadow-card">
          {isSubscribed ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-[hsl(var(--breef-orange))]/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[hsl(var(--breef-orange))]" />
              </div>
              <h3 className="font-inter text-2xl font-medium text-[hsl(var(--breef-dark))]">
                You're all set!
              </h3>
              <p className="font-inter text-[hsl(var(--breef-gray))]">
                Check your email for confirmation and exclusive content.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 font-inter h-12 rounded-full bg-white border-[hsl(var(--border))] focus:border-[hsl(var(--breef-orange))]"
                  required
                />
                <Button 
                  type="submit" 
                  className="font-inter h-12 px-8 bg-[hsl(var(--breef-orange))] hover:bg-[hsl(var(--breef-orange))]/90 text-white rounded-full whitespace-nowrap"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Subscribe
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-3">
                <div className="h-px flex-1 bg-[hsl(var(--border))]" />
                <span className="font-inter text-xs text-[hsl(var(--breef-gray))]">or</span>
                <div className="h-px flex-1 bg-[hsl(var(--border))]" />
              </div>

              <Button 
                type="button"
                variant="outline"
                className="w-full font-inter h-12 rounded-full border-2 border-green-500/20 hover:border-green-500 text-green-600 hover:bg-green-50"
                onClick={() => window.open('https://wa.me/573001234567?text=Subscribe%20to%20Fashionistas', '_blank')}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Subscribe via WhatsApp
              </Button>
              
              <p className="font-inter text-xs text-[hsl(var(--breef-gray))] text-center">
                Trusted by 10,000+ fashion enthusiasts worldwide • Unsubscribe anytime
              </p>
            </form>
          )}
        </div>

        {/* Benefits - Breef style icon grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 mx-auto bg-[hsl(var(--breef-orange))]/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[hsl(var(--breef-orange))]" />
            </div>
            <h3 className="font-inter text-lg font-medium text-[hsl(var(--breef-dark))]">
              Exclusive Events
            </h3>
            <p className="font-inter text-sm text-[hsl(var(--breef-gray))]">
              First access to limited fashion shows
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 mx-auto bg-[hsl(var(--breef-orange))]/10 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-[hsl(var(--breef-orange))]" />
            </div>
            <h3 className="font-inter text-lg font-medium text-[hsl(var(--breef-dark))]">
              Industry Insights
            </h3>
            <p className="font-inter text-sm text-[hsl(var(--breef-gray))]">
              Curated content from fashion weeks
            </p>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-12 h-12 mx-auto bg-[hsl(var(--breef-orange))]/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-[hsl(var(--breef-orange))]" />
            </div>
            <h3 className="font-inter text-lg font-medium text-[hsl(var(--breef-dark))]">
              Early Access
            </h3>
            <p className="font-inter text-sm text-[hsl(var(--breef-gray))]">
              Priority booking for VIP experiences
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="text-center mt-12 pt-12 border-t border-[hsl(var(--border))]">
          <p className="font-inter text-sm text-[hsl(var(--breef-gray))] mb-6">
            Trusted by professionals from
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-[hsl(var(--breef-gray))]/60">
            <span className="font-inter text-base">Vogue</span>
            <span className="font-inter text-base">Harper's Bazaar</span>
            <span className="font-inter text-base">Elle</span>
            <span className="font-inter text-base">GQ</span>
          </div>
        </div>
      </div>
    </section>
  );
};
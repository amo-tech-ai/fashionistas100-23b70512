import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mail, CheckCircle2, Sparkles } from "lucide-react";

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
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="space-y-4 mb-8">
            <Badge variant="secondary" className="font-inter">
              <Mail className="w-4 h-4 mr-2" />
              Stay Connected
            </Badge>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-foreground">
              Fashion Industry
              <span className="block text-accent">Insider Updates</span>
            </h2>
            <p className="font-inter text-lg text-muted-foreground max-w-2xl mx-auto">
              Get exclusive access to fashion week schedules, designer spotlights, 
              and early-bird ticket releases delivered directly to your inbox.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-playfair text-lg font-semibold text-foreground mb-2">
                Exclusive Events
              </h3>
              <p className="font-inter text-sm text-muted-foreground">
                First access to limited fashion shows and designer collaborations
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-3">
                <Mail className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-playfair text-lg font-semibold text-foreground mb-2">
                Industry Insights
              </h3>
              <p className="font-inter text-sm text-muted-foreground">
                Curated content from fashion weeks around the world
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 mx-auto bg-accent/10 rounded-full flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-playfair text-lg font-semibold text-foreground mb-2">
                Early Access
              </h3>
              <p className="font-inter text-sm text-muted-foreground">
                Priority booking for VIP experiences and designer meet-and-greets
              </p>
            </div>
          </div>

          {/* Newsletter Form */}
          <div className="max-w-lg mx-auto">
            {isSubscribed ? (
              <div className="text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 mx-auto text-accent" />
                <h3 className="font-playfair text-xl font-semibold text-foreground">
                  Welcome to Fashion Insider!
                </h3>
                <p className="font-inter text-muted-foreground">
                  Check your email for confirmation and exclusive content.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 font-inter"
                    required
                  />
                  <Button type="submit" variant="hero" className="font-inter whitespace-nowrap">
                    Subscribe Now
                  </Button>
                </div>
                
                <p className="font-inter text-xs text-muted-foreground">
                  Join 50,000+ fashion professionals. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>

          {/* Social Proof */}
          <div className="mt-8 pt-8 border-t border-border">
            <p className="font-inter text-sm text-muted-foreground mb-4">
              Trusted by fashion professionals from:
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
              <span className="font-playfair text-lg">Vogue</span>
              <span className="font-playfair text-lg">Harper's Bazaar</span>
              <span className="font-playfair text-lg">Elle</span>
              <span className="font-playfair text-lg">GQ</span>
              <span className="font-playfair text-lg">Marie Claire</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Star, ExternalLink, Globe, Instagram } from "lucide-react";
import { listDesigners, Designer } from "@/services/designerService";
import designerSpotlightImage from "@/assets/designer-spotlight.jpg";

export const DesignerSpotlight = () => {
  const [featuredDesigner, setFeaturedDesigner] = useState<Designer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedDesigner = async () => {
      try {
        const { data, error: fetchError } = await listDesigners({
          verified: true,
          limit: 1,
          sortBy: 'popularity'
        });

        if (fetchError) {
          setError(fetchError);
          return;
        }

        if (data.length > 0) {
          setFeaturedDesigner(data[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load featured designer");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedDesigner();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <LoadingSkeleton variant="card" count={1} />
        </div>
      </section>
    );
  }

  if (error || !featuredDesigner) {
    return (
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-playfair font-bold mb-4">Featured Designer</h2>
            <p className="text-muted-foreground mb-8">
              {error || "No featured designer available at the moment"}
            </p>
            <Button asChild variant="outline">
              <Link to="/designers">Browse All Designers</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <ErrorBoundary>
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Star className="w-4 h-4 mr-2" />
              Designer Spotlight
            </Badge>
            <h2 className="text-3xl font-playfair font-bold mb-4">Featured Designer</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover exceptional talent shaping the future of fashion
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src={designerSpotlightImage}
                alt="Designer Spotlight"
                className="w-full h-[400px] object-cover rounded-lg shadow-lg"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary text-primary-foreground">
                  Featured
                </Badge>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-playfair font-bold mb-2">
                  {featuredDesigner.brandName}
                </h3>
                {featuredDesigner.isVerified && (
                  <Badge variant="default" className="mb-4">
                    Verified Designer
                  </Badge>
                )}
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {featuredDesigner.bio || "An exceptional designer creating innovative fashion experiences."}
                </p>
              </div>

              {featuredDesigner.portfolioUrls.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Recent Work</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {featuredDesigner.portfolioUrls.slice(0, 3).map((url, index) => (
                      <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                        <img
                          src={url}
                          alt={`${featuredDesigner.brandName} portfolio ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                {featuredDesigner.websiteUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={featuredDesigner.websiteUrl} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
                {featuredDesigner.socialLinks.instagram && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={featuredDesigner.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                      <Instagram className="w-4 h-4 mr-2" />
                      Instagram
                    </a>
                  </Button>
                )}
              </div>

              <div className="pt-4">
                <Button asChild size="lg">
                  <Link to={`/designers/${featuredDesigner.brandSlug}`}>
                    View Full Portfolio
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
};
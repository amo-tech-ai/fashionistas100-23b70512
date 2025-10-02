import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Star, ExternalLink, Globe, Instagram } from "lucide-react";
import { listDesigners, Designer } from "@/services/designerService";
import { fashionImages } from "@/lib/cloudinary";
import designerSpotlightImage from "@/assets/designer-spotlight.jpg";

export const DesignerSpotlight = () => {
  const [featuredDesigner, setFeaturedDesigner] = useState<Designer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedDesigner = async () => {
      try {
        const data = await listDesigners({ 
          verified: true, 
          sortBy: 'popularity', 
          limit: 1 
        });
        
        if (data && data.length > 0) {
          setFeaturedDesigner(data[0]);
        } else {
          setError('No featured designer found');
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
      <section className="py-20 bg-white px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header - Breef style */}
          <div className="text-center mb-16">
            <h2 className="font-inter text-3xl md:text-5xl font-light text-[hsl(var(--breef-dark))] mb-4">
              Featured designer
            </h2>
            <p className="font-inter text-lg text-[hsl(var(--breef-gray))]">
              Discover exceptional talent shaping the future of fashion
            </p>
          </div>

          {/* Designer Card - Breef style horizontal layout */}
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative h-96 lg:h-auto">
                <img
                  src={fashionImages.designers[0] || designerSpotlightImage}
                  alt="Featured Designer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = designerSpotlightImage;
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
                <div>
                  {featuredDesigner.isVerified && (
                    <Badge className="mb-3 bg-[hsl(var(--breef-orange))] text-white border-0">
                      Verified Designer
                    </Badge>
                  )}
                  <h3 className="font-inter text-3xl font-medium text-[hsl(var(--breef-dark))] mb-4">
                    {featuredDesigner.brandName}
                  </h3>
                  <p className="font-inter text-[hsl(var(--breef-gray))] leading-relaxed text-lg">
                    {featuredDesigner.bio || "An exceptional designer creating innovative fashion experiences."}
                  </p>
                </div>

                {/* Portfolio thumbnails */}
                {(featuredDesigner.portfolioUrls.length > 0 || fashionImages.gallery.length > 0) && (
                  <div className="grid grid-cols-3 gap-3">
                    {(featuredDesigner.portfolioUrls.length > 0 
                      ? featuredDesigner.portfolioUrls 
                      : fashionImages.gallery
                    ).slice(0, 3).map((url, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden">
                        <img
                          src={url}
                          alt={`Portfolio ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (fashionImages.gallery[index]) {
                              target.src = fashionImages.gallery[index];
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Links */}
                <div className="flex items-center gap-3 pt-4">
                  {featuredDesigner.websiteUrl && (
                    <Button variant="outline" size="sm" asChild className="rounded-full border-[hsl(var(--border))]">
                      <a href={featuredDesigner.websiteUrl} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4 mr-2" />
                        Website
                      </a>
                    </Button>
                  )}
                  {featuredDesigner.socialLinks.instagram && (
                    <Button variant="outline" size="sm" asChild className="rounded-full border-[hsl(var(--border))]">
                      <a href={featuredDesigner.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                        <Instagram className="w-4 h-4 mr-2" />
                        Instagram
                      </a>
                    </Button>
                  )}
                </div>

                <div className="pt-2">
                  <Button asChild size="lg" className="bg-[hsl(var(--breef-orange))] hover:bg-[hsl(var(--breef-orange))]/90 text-white rounded-full">
                    <Link to={`/designers/${featuredDesigner.brandSlug}`}>
                      View Full Portfolio
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
};
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Globe, Instagram, ExternalLink, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { getDesignerBySlug, Designer } from "@/services/designerService";

const DesignerProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const [designer, setDesigner] = useState<Designer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDesigner = async () => {
      if (!slug) {
        setError("Invalid designer profile");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await getDesignerBySlug(slug);

        if (fetchError) {
          setError(fetchError);
          return;
        }

        if (!data) {
          setError("Designer not found");
          return;
        }

        setDesigner(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load designer profile");
      } finally {
        setLoading(false);
      }
    };

    fetchDesigner();
  }, [slug]);

  if (loading) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/designers">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Designers
              </Link>
            </Button>
            <LoadingSkeleton variant="detail" />
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  if (error || !designer) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/designers">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Designers
              </Link>
            </Button>
            <EmptyState
              icon={<ArrowLeft className="h-8 w-8 text-muted-foreground" />}
              title="Designer not found"
              description={error || "The designer profile you're looking for doesn't exist or has been removed."}
              action={{
                label: "Browse Designers",
                onClick: () => window.location.href = "/designers"
              }}
            />
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative h-64 bg-gradient-primary">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80" />
          <div className="relative container mx-auto px-4 h-full flex items-end pb-8">
            <div className="text-white">
              <Button variant="ghost" asChild className="mb-4 text-white hover:bg-white/20">
                <Link to="/designers">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Designers
                </Link>
              </Button>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-4xl md:text-5xl font-bold font-playfair">
                  {designer.brandName}
                </h1>
                {designer.isVerified && (
                  <Badge className="bg-white/20 text-white border-white/30">
                    Verified Designer
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  {designer.bio ? (
                    <p className="text-muted-foreground leading-relaxed">
                      {designer.bio}
                    </p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No biography available for this designer.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Portfolio */}
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio</CardTitle>
                  <CardDescription>
                    Showcase of {designer.brandName}'s latest work
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {designer.portfolioUrls.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {designer.portfolioUrls.map((url, index) => (
                        <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden group">
                          <img
                            src={url}
                            alt={`${designer.brandName} portfolio ${index + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <ArrowLeft className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">
                        No portfolio images available yet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Events - Placeholder for future integration */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Events</CardTitle>
                  <CardDescription>
                    Fashion shows and events featuring {designer.brandName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      No recent events available.
                    </p>
                    <Button variant="outline" asChild>
                      <Link to="/events">
                        Browse All Events
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Connect</CardTitle>
                  <CardDescription>
                    Get in touch with {designer.brandName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {designer.websiteUrl && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={designer.websiteUrl} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Visit Website
                        <ExternalLink className="h-4 w-4 ml-auto" />
                      </a>
                    </Button>
                  )}
                  
                  {designer.socialLinks.instagram && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={designer.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-4 w-4 mr-2" />
                        Follow on Instagram
                        <ExternalLink className="h-4 w-4 ml-auto" />
                      </a>
                    </Button>
                  )}

                  {/* Additional social links */}
                  {Object.entries(designer.socialLinks)
                    .filter(([key]) => key !== 'instagram')
                    .map(([platform, url]) => (
                      <Button key={platform} variant="outline" className="w-full justify-start" asChild>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </a>
                      </Button>
                    ))}

                  {!designer.websiteUrl && !designer.socialLinks.instagram && Object.keys(designer.socialLinks).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No contact information available.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Profile Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={designer.isVerified ? "default" : "secondary"}>
                      {designer.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Portfolio Items</span>
                    <span className="font-medium">{designer.portfolioUrls.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Member Since</span>
                    <span className="font-medium">
                      {new Date(designer.createdAt).getFullYear()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card>
                <CardContent className="pt-6">
                  <Button className="w-full" asChild>
                    <Link to="/events">
                      <Calendar className="h-4 w-4 mr-2" />
                      Find Events
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DesignerProfile;
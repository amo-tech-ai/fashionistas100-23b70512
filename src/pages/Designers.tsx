import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Filter, Users, ExternalLink, Instagram, Globe, SortAsc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Navigation } from "@/components/Navigation";
import { listDesigners, Designer } from "@/services/designerService";

const Designers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  
  // URL-controlled filters
  const search = searchParams.get("search") || "";
  const verified = searchParams.get("verified");
  const specialty = searchParams.get("specialty");
  const location = searchParams.get("location");
  const sortBy = searchParams.get("sortBy") as 'newest' | 'oldest' | 'alphabetical' | 'popularity' || 'newest';
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 12;

  useEffect(() => {
    const fetchDesigners = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError, total: totalCount } = await listDesigners({
          search: search || undefined,
          verified: verified === "true" ? true : undefined,
          specialty: specialty || undefined,
          location: location || undefined,
          sortBy,
          limit,
          offset: (page - 1) * limit
        });

        if (fetchError) {
          setError(fetchError);
          setDesigners([]);
          return;
        }

        setDesigners(data);
        setTotal(totalCount || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load designers");
        setDesigners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigners();
  }, [search, verified, specialty, location, sortBy, page]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    
    // Handle special "all" values
    if (value === "all" || !value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    
    // Reset to page 1 when filtering
    if (key !== "page") {
      newParams.set("page", "1");
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 mt-16 lg:mt-20">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-playfair mb-4">Fashion Designers</h1>
            <p className="text-lg text-muted-foreground">
              Discover talented designers and their unique fashion perspectives
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search designers..."
                    value={search}
                    onChange={(e) => updateFilter("search", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={verified || undefined} onValueChange={(value) => updateFilter("verified", value)}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Designers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Designers</SelectItem>
                    <SelectItem value="true">Verified Only</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={specialty || undefined} onValueChange={(value) => updateFilter("specialty", value)}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="All Specialties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    <SelectItem value="haute-couture">Haute Couture</SelectItem>
                    <SelectItem value="ready-to-wear">Ready-to-Wear</SelectItem>
                    <SelectItem value="sustainable">Sustainable Fashion</SelectItem>
                    <SelectItem value="evening-wear">Evening Wear</SelectItem>
                    <SelectItem value="streetwear">Streetwear</SelectItem>
                    <SelectItem value="bridal">Bridal</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={location || undefined} onValueChange={(value) => updateFilter("location", value)}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="bogota">Bogotá</SelectItem>
                    <SelectItem value="medellin">Medellín</SelectItem>
                    <SelectItem value="cali">Cali</SelectItem>
                    <SelectItem value="cartagena">Cartagena</SelectItem>
                    <SelectItem value="barranquilla">Barranquilla</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SortAsc className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(search || verified || specialty || location || sortBy !== 'newest') && (
                <Button variant="outline" onClick={clearFilters} className="w-full sm:w-auto">
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <LoadingSkeleton variant="card" count={6} />
          ) : error ? (
            <EmptyState
              icon={<Users className="h-8 w-8 text-muted-foreground" />}
              title="Failed to load designers"
              description={error}
              action={{
                label: "Try Again",
                onClick: () => window.location.reload()
              }}
            />
          ) : designers.length === 0 ? (
            <EmptyState
              icon={<Users className="h-8 w-8 text-muted-foreground" />}
              title="No designers found"
              description={
                search || verified || specialty || location || sortBy !== 'newest'
                  ? "Try adjusting your filters to see more designers"
                  : "No designers are available at the moment"
              }
              action={
                search || verified || specialty || location || sortBy !== 'newest'
                  ? {
                      label: "Clear Filters",
                      onClick: clearFilters
                    }
                  : undefined
              }
            />
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground">
                  Showing {designers.length} of {total} designer{total !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {designers.map((designer) => (
                  <Card key={designer.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="group-hover:text-primary transition-colors text-lg sm:text-xl truncate">
                            <Link to={`/designers/${designer.brandSlug}`}>
                              {designer.brandName}
                            </Link>
                          </CardTitle>
                          {designer.isVerified && (
                            <Badge variant="default" className="mt-2 text-xs">
                              Verified Designer
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                      {designer.bio && (
                        <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                          {designer.bio}
                        </CardDescription>
                      )}

                      {/* Portfolio Preview */}
                      {designer.portfolioUrls.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {designer.portfolioUrls.slice(0, 3).map((url, index) => (
                            <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                              <img
                                src={url}
                                alt={`${designer.brandName} portfolio ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Social Links */}
                      <div className="flex items-center justify-between gap-2 pt-2">
                        <div className="flex items-center gap-2">
                          {designer.websiteUrl && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={designer.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit website">
                                <Globe className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {designer.socialLinks.instagram && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={designer.socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Visit Instagram">
                                <Instagram className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                        <Button variant="outline" size="sm" asChild className="shrink-0">
                          <Link to={`/designers/${designer.brandSlug}`}>
                            <span className="hidden sm:inline">View Profile</span>
                            <span className="sm:hidden">View</span>
                            <ExternalLink className="h-4 w-4 ml-1 sm:ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => updateFilter("page", String(page - 1))}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateFilter("page", String(pageNum))}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    {totalPages > 5 && (
                      <>
                        {totalPages > 6 && <span className="px-2">...</span>}
                        <Button
                          variant={totalPages === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateFilter("page", String(totalPages))}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    disabled={page >= totalPages}
                    onClick={() => updateFilter("page", String(page + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Designers;
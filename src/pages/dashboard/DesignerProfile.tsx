import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Globe, Instagram, MapPin, Calendar, Award, TrendingUp, Users, Upload, Heart, Share2, ExternalLink, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import DashboardLayout from "@/components/DashboardLayout";
import { getDesignerById } from "@/services/designerService";

const DesignerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [designer, setDesigner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDesigner = async () => {
      if (!id) {
        setError("Invalid designer profile");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getDesignerById(id);
        if (data) {
          setDesigner(data);
        } else {
          setError('Designer not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load designer profile");
      } finally {
        setLoading(false);
      }
    };

    fetchDesigner();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <LoadingSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !designer) {
    return (
      <DashboardLayout>
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <EmptyState
            icon={<ArrowLeft className="h-8 w-8 text-muted-foreground" />}
            title="Designer not found"
            description={error || "The designer profile you're looking for doesn't exist or has been removed."}
            action={{
              label: "Browse Designers",
              onClick: () => navigate("/dashboard/designers")
            }}
          />
        </div>
      </DashboardLayout>
    );
  }

  // Mock collections data
  const collections = [
    { id: 1, name: "Spring/Summer 2029", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400", items: 24 },
    { id: 2, name: "Fall/Winter 2028", image: "https://images.unsplash.com/photo-1558769132-cb1aea3c5e6d?w=400", items: 18 },
    { id: 3, name: "Haute Couture 2029", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400", items: 12 },
  ];

  // Mock events data
  const recentEvents = [
    { id: 1, name: "Paris Fashion Week 2029", date: "2029-09-15", location: "Paris, France" },
    { id: 2, name: "Milan Fashion Week", date: "2029-06-10", location: "Milan, Italy" },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard/designers")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Designers
          </Button>
        </div>

        {/* Hero Section */}
        <Card className="mb-6 overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-purple-600 to-pink-600" />
          <CardContent className="pt-0">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-20 relative z-10">
              <div className="bg-white p-2 rounded-lg shadow-lg">
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Users className="h-16 w-16 text-gray-400" />
                </div>
              </div>
              
              <div className="flex-1 bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold text-gray-900">{designer.brandName}</h1>
                      {designer.isVerified && (
                        <Badge className="bg-blue-100 text-blue-800">
                          <Star className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{designer.brandSlug}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="secondary">Couture</Badge>
                      <Badge variant="secondary">Ready-to-Wear</Badge>
                      <Badge variant="secondary">Sustainable</Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Collection
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  {designer.bio || "Innovative fashion designer specializing in contemporary haute couture with a focus on sustainable materials and timeless elegance. Known for pushing boundaries while maintaining classic sophistication."}
                </p>
              </CardContent>
            </Card>

            {/* Design Philosophy */}
            <Card>
              <CardHeader>
                <CardTitle>Design Philosophy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Blending traditional craftsmanship with modern innovation to create pieces that transcend trends and celebrate individuality.
                </p>
              </CardContent>
            </Card>

            {/* Collections */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Collections</CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {collections.map((collection) => (
                    <div key={collection.id} className="group cursor-pointer">
                      <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-2">
                        <img 
                          src={collection.image} 
                          alt={collection.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h4 className="font-medium text-sm">{collection.name}</h4>
                      <p className="text-xs text-gray-600">{collection.items} items</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Fashion Shows */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Fashion Shows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <h4 className="font-medium">{event.name}</h4>
                          <p className="text-sm text-gray-600">{event.location}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{event.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Brand Collaborations */}
            <Card>
              <CardHeader>
                <CardTitle>Brand Collaborations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {["Valentino", "Dior", "Versace", "Prada"].map((brand) => (
                    <Badge key={brand} variant="outline" className="text-sm py-2 px-4">
                      {brand}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Portfolio Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Collections</span>
                    </div>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Fashion Shows</span>
                    </div>
                    <span className="font-semibold">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Revenue Linked</span>
                    </div>
                    <span className="font-semibold">$245K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Rating</span>
                    </div>
                    <span className="font-semibold">4.8/5.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Experience & Location */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Location</span>
                  </div>
                  <p className="font-medium ml-6">Colombia</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Award className="h-4 w-4" />
                    <span className="text-sm">Experience</span>
                  </div>
                  <p className="font-medium ml-6">{designer.yearsExperience || 8} years</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Member Since</span>
                  </div>
                  <p className="font-medium ml-6">
                    {new Date(designer.memberSince || designer.createdAt).getFullYear()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact & Connect */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact & Connect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {designer.websiteUrl && (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={designer.websiteUrl} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  </Button>
                )}
                {designer.socialLinks?.instagram && (
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href={designer.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-4 w-4 mr-2" />
                      Instagram
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  </Button>
                )}
                <Button className="w-full">
                  Book for Event
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  <p>Next show: Fashion Week 2029</p>
                  <p className="text-xs mt-1">September 15, 2029</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DesignerProfile;
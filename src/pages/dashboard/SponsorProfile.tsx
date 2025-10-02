import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Star,
  Award,
  ExternalLink,
  Download,
  CheckCircle2,
  Instagram,
  Linkedin,
  Youtube,
  Facebook
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import DashboardLayout from "@/components/DashboardLayout";
import { getSponsorById } from "@/services/sponsorService";

const SponsorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [sponsor, setSponsor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSponsor = async () => {
      if (!id) {
        setError("Invalid sponsor profile");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getSponsorById(id);
        if (!data) {
          setError("Sponsor not found");
        } else {
          setSponsor(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load sponsor profile");
      } finally {
        setLoading(false);
      }
    };

    fetchSponsor();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/dashboard/sponsors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sponsors
            </Link>
          </Button>
          <LoadingSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !sponsor) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/dashboard/sponsors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sponsors
            </Link>
          </Button>
          <EmptyState
            icon={<ArrowLeft className="h-8 w-8 text-muted-foreground" />}
            title="Sponsor not found"
            description={error || "The sponsor profile you're looking for doesn't exist or has been removed."}
            action={{
              label: "Browse Sponsors",
              onClick: () => window.location.href = "/dashboard/sponsors"
            }}
          />
        </div>
      </DashboardLayout>
    );
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'title': return 'bg-gradient-to-r from-purple-600 to-purple-800';
      case 'platinum': return 'bg-gradient-to-r from-gray-400 to-gray-600';
      case 'gold': return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 'bronze': return 'bg-gradient-to-r from-orange-600 to-orange-800';
      default: return 'bg-gray-200';
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="space-y-6">
          {/* Back Button */}
          <Button variant="ghost" asChild>
            <Link to="/dashboard/sponsors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sponsors
            </Link>
          </Button>

          {/* Hero Header Section */}
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary/10 to-primary/5" />
            <CardContent className="-mt-16 pb-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Logo */}
                <div className="bg-white rounded-xl p-4 shadow-lg border-4 border-white">
                  {sponsor.logo_url ? (
                    <img 
                      src={sponsor.logo_url} 
                      alt={sponsor.name}
                      className="h-24 w-24 object-contain"
                    />
                  ) : (
                    <div className="h-24 w-24 bg-muted rounded-lg flex items-center justify-center">
                      <Award className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Header Info */}
                <div className="flex-1 pt-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold">{sponsor.name}</h1>
                        {sponsor.status === 'active' && (
                          <Badge variant="default" className="bg-green-600">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-lg text-muted-foreground mb-3">{sponsor.industry}</p>
                      <Badge className={`${getTierColor(sponsor.tier)} text-white px-4 py-1`}>
                        {sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)} Sponsor
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button>
                        <Mail className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                      <Button variant="outline">
                        <Award className="h-4 w-4 mr-2" />
                        Add to Event
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Investment</p>
                    <p className="text-2xl font-bold">${sponsor.investment.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Events Sponsored</p>
                    <p className="text-2xl font-bold">{sponsor.events_count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-100">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Audience Reach</p>
                    <p className="text-2xl font-bold">
                      {sponsor.audience_reach ? `${(sponsor.audience_reach / 1000000).toFixed(1)}M` : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-yellow-100">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Engagement Score</p>
                    <p className="text-2xl font-bold">{sponsor.engagement_score}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle>About {sponsor.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {sponsor.description || `${sponsor.name} is a valued partner in the fashion industry, bringing innovation and style to every collaboration.`}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {sponsor.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{sponsor.location}</span>
                      </div>
                    )}
                    {sponsor.founded_date && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Founded {sponsor.founded_date}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Sponsorship History */}
              {sponsor.sponsorship_history && sponsor.sponsorship_history.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Sponsorship History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sponsor.sponsorship_history.map((history: any, index: number) => (
                        <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Award className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{history.event_name}</h4>
                            <p className="text-sm text-muted-foreground">{history.date}</p>
                            <p className="text-sm font-medium text-primary mt-1">
                              ${history.amount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Media & Brand Assets */}
              <Card>
                <CardHeader>
                  <CardTitle>Media & Brand Assets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Logo variants display */}
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-square bg-muted rounded-lg flex items-center justify-center p-6 border-2 border-border hover:border-primary transition-colors">
                        {sponsor.logo_url ? (
                          <img 
                            src={sponsor.logo_url} 
                            alt={`${sponsor.name} logo variant ${i}`}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <Award className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Logo Pack
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Brand Guidelines
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Activation Campaigns */}
              <Card>
                <CardHeader>
                  <CardTitle>Activation Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">Digital Social Campaign</h4>
                          <p className="text-sm text-muted-foreground">Instagram & TikTok Activation</p>
                        </div>
                        <Badge>Active</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3">
                        <div className="text-center">
                          <p className="text-2xl font-bold">2.5M</p>
                          <p className="text-xs text-muted-foreground">Impressions</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">150K</p>
                          <p className="text-xs text-muted-foreground">Engagements</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">6.2%</p>
                          <p className="text-xs text-muted-foreground">CTR</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Contact & Details */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${sponsor.email}`} className="text-sm hover:underline">
                        {sponsor.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${sponsor.phone}`} className="text-sm hover:underline">
                        {sponsor.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={sponsor.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm hover:underline flex items-center gap-1"
                      >
                        Visit Website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium mb-2">Key Contact</p>
                    <p className="text-sm text-muted-foreground">{sponsor.contact_person}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sponsor.instagram && (
                    <a 
                      href={sponsor.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Instagram className="h-5 w-5 text-pink-600" />
                      <span className="text-sm">Instagram</span>
                      <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                    </a>
                  )}
                  {sponsor.linkedin && (
                    <a 
                      href={sponsor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Linkedin className="h-5 w-5 text-blue-600" />
                      <span className="text-sm">LinkedIn</span>
                      <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                    </a>
                  )}
                  {sponsor.youtube && (
                    <a 
                      href={sponsor.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Youtube className="h-5 w-5 text-red-600" />
                      <span className="text-sm">YouTube</span>
                      <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                    </a>
                  )}
                  {sponsor.facebook && (
                    <a 
                      href={sponsor.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Facebook className="h-5 w-5 text-blue-700" />
                      <span className="text-sm">Facebook</span>
                      <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
                    </a>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Partnership Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <div className="text-4xl font-bold text-primary">
                        {sponsor.engagement_score}
                      </div>
                      <div className="text-sm text-muted-foreground text-center">/ 100</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.round(sponsor.engagement_score / 20)
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Based on ROI, engagement, and reliability
                  </p>
                </CardContent>
              </Card>

              {/* Files & Documents */}
              <Card>
                <CardHeader>
                  <CardTitle>Files & Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Sponsorship Agreement 2029.pdf
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Media Kit.zip
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Brand Guidelines.pdf
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SponsorProfile;

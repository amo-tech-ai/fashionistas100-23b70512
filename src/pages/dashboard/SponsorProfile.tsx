import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import DashboardLayout from "@/components/DashboardLayout";
import ProfileTemplate from "@/components/ProfileTemplate";

// Mock sponsor data interface - replace with actual service
interface Sponsor {
  id: string;
  name: string;
  description?: string;
  category: string;
  website?: string;
  email?: string;
  phone?: string;
  location?: string;
  founded_date?: string;
  logo_url?: string;
  banner_url?: string;
  is_verified: boolean;
  social_links: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    [key: string]: string | undefined;
  };
  created_at: string;
  sponsorship_tier: 'Gold' | 'Platinum' | 'Title' | 'Silver' | 'Bronze';
  investment_amount: string;
  events_sponsored: number;
  partnerships: number;
}

const SponsorProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSponsor = async () => {
      if (!slug) {
        setError("Invalid sponsor profile");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Mock data - replace with actual API call
        const mockSponsor: Sponsor = {
          id: slug,
          name: "Luxury Fashion Brand",
          description: "A premium fashion brand specializing in luxury clothing and accessories. We partner with fashion events to showcase our latest collections and connect with fashion enthusiasts.",
          category: "Fashion Brand",
          website: "https://luxuryfashionbrand.com",
          email: "partnerships@luxuryfashionbrand.com",
          phone: "+1 (555) 987-6543",
          location: "Paris, France",
          founded_date: "2015",
          is_verified: true,
          social_links: {
            instagram: "https://instagram.com/luxuryfashionbrand",
            linkedin: "https://linkedin.com/company/luxuryfashionbrand",
            twitter: "https://twitter.com/luxuryfashion"
          },
          created_at: "2020-03-15T00:00:00Z",
          sponsorship_tier: 'Platinum',
          investment_amount: '$250,000',
          events_sponsored: 8,
          partnerships: 12
        };

        setSponsor(mockSponsor);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load sponsor profile");
      } finally {
        setLoading(false);
      }
    };

    fetchSponsor();
  }, [slug]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/sponsors">
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
            <Link to="/sponsors">
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
              onClick: () => window.location.href = "/sponsors"
            }}
          />
        </div>
      </DashboardLayout>
    );
  }

  // Transform sponsor data to match ProfileTemplate interface
  const profileData = {
    id: sponsor.id,
    name: sponsor.name,
    tagline: `${sponsor.sponsorship_tier} Sponsor • ${sponsor.category}`,
    category: sponsor.category,
    bio: sponsor.description,
    website: sponsor.website,
    email: sponsor.email,
    phone: sponsor.phone,
    location: sponsor.location,
    founded_date: sponsor.founded_date,
    social_links: sponsor.social_links,
    is_verified: sponsor.is_verified,
    metrics: {
      revenue: sponsor.investment_amount,
      events_count: sponsor.events_sponsored,
      partnerships: sponsor.partnerships
    },
    portfolio_urls: [], // Could add brand images here
    created_at: sponsor.created_at
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/sponsors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sponsors
            </Link>
          </Button>
        </div>

        {/* Profile Template */}
        <ProfileTemplate 
          profile={profileData} 
          role="sponsor" 
        />
      </div>
    </DashboardLayout>
  );
};

export default SponsorProfile;

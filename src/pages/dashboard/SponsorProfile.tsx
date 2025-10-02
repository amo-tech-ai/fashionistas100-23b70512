import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import DashboardLayout from "@/components/DashboardLayout";
import ProfileTemplate from "@/components/ProfileTemplate";
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

  // Transform sponsor data to match ProfileTemplate interface
  const profileData = {
    id: sponsor.id,
    name: sponsor.name,
    tagline: `${sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)} Sponsor • ${sponsor.industry}`,
    category: sponsor.industry,
    bio: sponsor.description || `${sponsor.name} is a valued partner in the fashion industry.`,
    website: sponsor.website,
    email: sponsor.email,
    phone: sponsor.phone,
    location: sponsor.location,
    founded_date: sponsor.founded_date,
    social_links: {},
    is_verified: sponsor.status === 'active',
    metrics: {
      revenue: `$${sponsor.investment.toLocaleString()}`,
      events_count: sponsor.events_count,
      partnerships: sponsor.audience_reach || 0
    },
    portfolio_urls: [],
    created_at: sponsor.added_date
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/dashboard/sponsors">
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

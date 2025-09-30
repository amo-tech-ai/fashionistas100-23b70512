import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import DashboardLayout from "@/components/DashboardLayout";
import ProfileTemplate from "@/components/ProfileTemplate";
import { getVenueById, getVenueBySlug, VenueProfile } from "@/services/venueService";

const VenueProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const [venue, setVenue] = useState<VenueProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVenue = async () => {
      if (!slug) {
        setError("Invalid venue profile");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Try to fetch by ID first (since our links use IDs), then by slug
        let data = await getVenueById(slug);
        if (!data) {
          data = await getVenueBySlug(slug);
        }

        if (data) {
          setVenue(data);
        } else {
          setError('Venue not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load venue profile");
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [slug]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="space-y-6">
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/venues">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Venues
              </Link>
            </Button>
            <LoadingSkeleton />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !venue) {
    return (
      <DashboardLayout>
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="space-y-6">
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/venues">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Venues
              </Link>
            </Button>
            <EmptyState
              icon={<ArrowLeft className="h-8 w-8 text-muted-foreground" />}
              title="Venue not found"
              description={error || "The venue profile you're looking for doesn't exist or has been removed."}
              action={{
                label: "Browse Venues",
                onClick: () => window.location.href = "/venues"
              }}
            />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Transform venue data to match ProfileTemplate interface
  const profileData = {
    id: venue.id,
    name: venue.name,
    tagline: venue.description,
    category: 'Venue',
    bio: venue.description,
    website: venue.website,
    email: venue.email,
    phone: venue.phone,
    location: venue.location,
    team_size: `${venue.capacity} capacity`,
    social_links: venue.social_links,
    is_verified: venue.is_verified,
    metrics: {
      capacity: venue.capacity,
      events_count: venue.events_hosted,
      rating: venue.rating
    },
    portfolio_urls: venue.images,
    created_at: venue.created_at
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="space-y-6">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/venues">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Venues
              </Link>
            </Button>
          </div>

          {/* Profile Template */}
          <ProfileTemplate 
            profile={profileData} 
            role="venue" 
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VenueProfile;

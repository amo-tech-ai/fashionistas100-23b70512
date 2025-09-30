import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import DashboardLayout from "@/components/DashboardLayout";
import ProfileTemplate from "@/components/ProfileTemplate";
import { getDesignerBySlug, getDesignerById, Designer } from "@/services/designerService";

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
        // Try to fetch by ID first (since our links use IDs), then by slug
        let data = await getDesignerById(slug);
        if (!data) {
          data = await getDesignerBySlug(slug);
        }

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
  }, [slug]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="space-y-6">
            <Button variant="ghost" asChild className="mb-6">
              <Link to="/designers">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Designers
              </Link>
            </Button>
            <LoadingSkeleton />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !designer) {
    return (
      <DashboardLayout>
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="space-y-6">
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
      </DashboardLayout>
    );
  }

  // Transform designer data to match ProfileTemplate interface
  const profileData = {
    id: designer.id || 'unknown',
    name: designer.brandName,
    tagline: designer.bio?.substring(0, 100) + '...',
    category: 'Designer',
    bio: designer.bio,
    website: designer.websiteUrl,
    location: 'Colombia',
    founded_date: new Date(designer.createdAt || designer.memberSince).getFullYear().toString(),
    social_links: designer.socialLinks || {},
    is_verified: designer.isVerified,
    metrics: {
      portfolio_views: '1.2K',
      events_count: 24,
      rating: '4.8',
      followers: '2.4K'
    },
    portfolio_urls: designer.portfolioUrls || [],
    created_at: designer.createdAt || designer.memberSince || new Date().toISOString()
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="space-y-6">
          {/* Header with Back Button */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/designers">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Designers
              </Link>
            </Button>
          </div>

          {/* Profile Template */}
          <ProfileTemplate 
            profile={profileData} 
            role="designer" 
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DesignerProfile;
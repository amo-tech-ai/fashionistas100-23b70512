export interface VenueProfile {
  id: string;
  name: string;
  description: string;
  venue_type: string;
  capacity: number;
  location: string;
  website?: string;
  email?: string;
  phone?: string;
  social_links: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    [key: string]: string | undefined;
  };
  is_verified: boolean;
  events_hosted: number;
  rating: string;
  images: string[];
  created_at: string;
}

export const getVenueById = async (id: string): Promise<VenueProfile | null> => {
  // Mock data for now
  const mockVenue: VenueProfile = {
    id: id,
    name: "Convention Center Premium",
    description: "Modern event space perfect for fashion shows and corporate events",
    venue_type: "convention_center",
    capacity: 500,
    location: "Bogotá, Colombia",
    website: "https://conventioncenterpremium.com",
    email: "contact@conventioncenterpremium.com",
    phone: "+57 1 234 5678",
    social_links: {
      instagram: "https://instagram.com/conventioncenterpremium",
      linkedin: "https://linkedin.com/company/conventioncenterpremium"
    },
    is_verified: true,
    events_hosted: 45,
    rating: "4.8",
    images: ["/placeholder.svg", "/placeholder.svg"],
    created_at: "2020-01-15T00:00:00Z"
  };

  return mockVenue;
};

export const getVenueBySlug = async (slug: string): Promise<VenueProfile | null> => {
  return getVenueById(slug);
};
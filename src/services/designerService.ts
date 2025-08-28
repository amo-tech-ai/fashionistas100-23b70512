import { supabase } from "@/integrations/supabase/client";

export interface Designer {
  id: string;
  userId: string;
  brandName: string;
  brandSlug: string;
  bio: string | null;
  websiteUrl: string | null;
  portfolioUrls: string[];
  socialLinks: Record<string, string>;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DesignerFilters {
  search?: string;
  verified?: boolean;
  specialty?: string;
  location?: string;
  sortBy?: 'newest' | 'oldest' | 'alphabetical' | 'popularity';
  limit?: number;
  offset?: number;
}

export interface Result<T> {
  data: T | null;
  error: string | null;
}

export interface ListResult<T> {
  data: T[];
  error: string | null;
  total?: number;
}

// List verified designers with filtering
export async function listDesigners(filters: DesignerFilters = {}): Promise<ListResult<Designer>> {
  try {
    let query = supabase
      .from("designer_profiles")
      .select("*", { count: 'exact' })
      .eq("is_verified", true);

    // Apply search filter
    if (filters.search) {
      query = query.ilike("brand_name", `%${filters.search}%`);
    }

    // Apply verified filter
    if (filters.verified !== undefined) {
      query = query.eq("is_verified", filters.verified);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'alphabetical':
        query = query.order("brand_name", { ascending: true });
        break;
      case 'oldest':
        query = query.order("created_at", { ascending: true });
        break;
      case 'popularity':
        // For now, sort by created_at desc as a proxy for popularity
        query = query.order("created_at", { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      return { data: [], error: error.message };
    }

    const designers: Designer[] = (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      brandName: row.brand_name,
      brandSlug: row.brand_slug,
      bio: row.bio,
      websiteUrl: row.website_url,
      portfolioUrls: row.portfolio_urls || [],
      socialLinks: (row.social_links && typeof row.social_links === 'object' && !Array.isArray(row.social_links)) 
        ? row.social_links as Record<string, string>
        : {},
      isVerified: row.is_verified,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return { 
      data: designers, 
      error: null, 
      total: count || 0 
    };
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error occurred";
    return { data: [], error: errorMessage };
  }
}

// Get single designer by slug
export async function getDesignerBySlug(slug: string): Promise<Result<Designer>> {
  try {
    const { data, error } = await supabase
      .from("designer_profiles")
      .select("*")
      .eq("brand_slug", slug)
      .eq("is_verified", true)
      .maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }

    if (!data) {
      return { data: null, error: null };
    }

    const designer: Designer = {
      id: data.id,
      userId: data.user_id,
      brandName: data.brand_name,
      brandSlug: data.brand_slug,
      bio: data.bio,
      websiteUrl: data.website_url,
      portfolioUrls: data.portfolio_urls || [],
      socialLinks: (data.social_links && typeof data.social_links === 'object' && !Array.isArray(data.social_links)) 
        ? data.social_links as Record<string, string>
        : {},
      isVerified: data.is_verified,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return { data: designer, error: null };
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error occurred";
    return { data: null, error: errorMessage };
  }
}
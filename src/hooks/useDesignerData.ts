import { useState, useEffect } from 'react';
import { listDesigners, getDesignerBySlug, type Designer, type DesignerFilters } from '@/services/designerService';

// Hook for fetching multiple designers
export function useDesigners(filters: DesignerFilters = {}) {
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchDesigners = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await listDesigners(filters);
      
      if (result.error) {
        setError(result.error);
      } else {
        setDesigners(result.data);
        setTotal(result.total || 0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch designers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigners();
  }, [
    filters.search,
    filters.verified,
    filters.specialty,
    filters.location,
    filters.sortBy,
    filters.limit,
    filters.offset
  ]);

  return { 
    designers, 
    loading, 
    error, 
    total,
    refetch: fetchDesigners 
  };
}

// Hook for fetching a single designer
export function useDesigner(slug: string) {
  const [designer, setDesigner] = useState<Designer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDesigner = async () => {
    if (!slug) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await getDesignerBySlug(slug);
      
      if (result.error) {
        setError(result.error);
      } else {
        setDesigner(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch designer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigner();
  }, [slug]);

  return { designer, loading, error, refetch: fetchDesigner };
}

// Hook for featured designer
export function useFeaturedDesigner() {
  const [designer, setDesigner] = useState<Designer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedDesigner = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await listDesigners({ 
        limit: 1, 
        sortBy: 'popularity',
        verified: true 
      });
      
      if (result.error) {
        setError(result.error);
      } else {
        setDesigner(result.data[0] || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch featured designer');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedDesigner();
  }, []);

  return { designer, loading, error, refetch: fetchFeaturedDesigner };
}
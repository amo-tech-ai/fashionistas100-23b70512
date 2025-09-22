import { useState, useEffect } from 'react';
import { listDesigners, getDesignerBySlug, Designer, DesignerFilters } from '@/services/designerService';
import { getFeaturedDesigners } from '@/services/getFeaturedDesigners';

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
      const response = await listDesigners({ ...filters, offset: (filters.page - 1) * (filters.limit || 12) });
      setDesigners(response);
      setError(null);
      setLoading(false);
      setTotal(response.length);
    } catch (err) {
      setError('Failed to fetch designers');
      setLoading(false);
      console.error('Error fetching designers:', err);
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
    filters.offset,
    filters.page
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
      const response = await getDesignerBySlug(slug);
      setDesigner(response);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch designer');
      setLoading(false);
      console.error('Error fetching designer:', err);
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
      const response = await getFeaturedDesigners(1);
      setDesigner(response[0] || null);
      setError(null);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch featured designers');
      setLoading(false);
      console.error('Error fetching featured designers:', err);
    }
  };

  useEffect(() => {
    fetchFeaturedDesigner();
  }, []);

  return { designer, loading, error, refetch: fetchFeaturedDesigner };
}
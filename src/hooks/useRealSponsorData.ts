import { useState, useCallback } from 'react';

export interface Sponsor {
  id: string;
  company_name: string;
  logo_url?: string;
  website?: string;
  contact_email?: string;
  tier: string;
  amount: number;
  status: string;
}

export const useRealSponsorData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  const fetchSponsors = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock sponsor data for now
      setSponsors([
        {
          id: '1',
          company_name: 'Fashion Brand Co',
          logo_url: '/api/placeholder/100/50',
          website: 'https://fashionbrand.com',
          contact_email: 'sponsor@fashionbrand.com',
          tier: 'gold',
          amount: 50000,
          status: 'active'
        },
        {
          id: '2',
          company_name: 'Luxury Accessories Ltd',
          logo_url: '/api/placeholder/100/50',
          website: 'https://luxuryaccessories.com',
          contact_email: 'partnerships@luxuryaccessories.com',
          tier: 'platinum',
          amount: 100000,
          status: 'active'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sponsors,
    fetchSponsors,
    isLoading,
    error: null
  };
};
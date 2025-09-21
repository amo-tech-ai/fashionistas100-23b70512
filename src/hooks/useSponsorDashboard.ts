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

export interface Sponsorship {
  id: string;
  sponsor_id: string;
  event_id: string;
  amount: number;
  status: string;
  start_date: string;
  end_date: string;
}

export const useSponsorDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Mock data for now
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
        }
      ]);

      setSponsorships([
        {
          id: '1',
          sponsor_id: '1',
          event_id: '1',
          amount: 50000,
          status: 'active',
          start_date: '2024-01-01',
          end_date: '2024-12-31'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sponsors,
    sponsorships,
    fetchData,
    isLoading
  };
};
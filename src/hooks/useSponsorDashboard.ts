import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Sponsor {
  id: string;
  company_name: string;
  slug: string;
  industry?: string;
  website?: string;
  logo_url?: string;
  description?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: any;
  status: 'lead' | 'negotiating' | 'contracted' | 'active' | 'expired' | 'churned';
  tags?: string[];
  notes?: string;
  brand_assets_complete?: boolean;
  activation_preferences?: any;
  preferred_placements?: string[];
  created_at: string;
  updated_at: string;
}

export interface SponsorPackage {
  id: string;
  package_name: string;
  description?: string;
  price: number;
  max_sponsors?: number;
  benefits?: string[];
  visibility_level?: string;
  is_available: boolean;
}

export interface Sponsorship {
  id: string;
  sponsor_id: string;
  event_id?: string;
  package_id?: string;
  amount: number;
  status: string;
  start_date: string;
  end_date: string;
  benefits_delivered?: string[];
  notes?: string;
  sponsor?: Sponsor;
  event?: any;
  package?: SponsorPackage;
}

export interface SponsorActivation {
  id: string;
  sponsorship_id: string;
  activation_type: string;
  name: string;
  description?: string;
  start_datetime: string;
  end_datetime: string;
  location?: string;
  estimated_reach: number;
  actual_reach?: number;
  status: string;
}

export interface DashboardMetrics {
  totalSponsors: number;
  activeSponsors: number;
  totalInvestment: number;
  totalReach: number;
  averageROI: number;
  upcomingActivations: number;
  pendingProposals: number;
  expiringContracts: number;
}

export interface RecentActivity {
  id: string;
  type: 'sponsor_added' | 'proposal_sent' | 'contract_signed' | 'payment_received' | 'activation_completed';
  title: string;
  description: string;
  timestamp: string;
  sponsor_name?: string;
  amount?: number;
}

export const useSponsorDashboard = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [packages, setPackages] = useState<SponsorPackage[]>([]);
  const [activations, setActivations] = useState<SponsorActivation[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalSponsors: 0,
    activeSponsors: 0,
    totalInvestment: 0,
    totalReach: 0,
    averageROI: 0,
    upcomingActivations: 0,
    pendingProposals: 0,
    expiringContracts: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch sponsors
      const { data: sponsorsData, error: sponsorsError } = await supabase
        .from('sponsors')
        .select('*')
        .order('created_at', { ascending: false });

      if (sponsorsError) throw sponsorsError;
      setSponsors(sponsorsData || []);

      // Fetch sponsor packages
      const { data: packagesData, error: packagesError } = await supabase
        .from('sponsor_packages')
        .select('*')
        .eq('is_available', true)
        .order('price', { ascending: false });

      if (packagesError) throw packagesError;
      setPackages(packagesData || []);

      // Fetch sponsorships with related data
      const { data: sponsorshipsData, error: sponsorshipsError } = await supabase
        .from('sponsorships')
        .select(`
          *,
          sponsors (
            id,
            company_name,
            logo_url,
            industry,
            contact_name,
            contact_email
          ),
          sponsor_packages (
            id,
            package_name,
            price,
            visibility_level
          )
        `)
        .order('created_at', { ascending: false });

      if (sponsorshipsError) throw sponsorshipsError;
      setSponsorships(sponsorshipsData || []);

      // Fetch activations
      const { data: activationsData, error: activationsError } = await supabase
        .from('sponsor_activations')
        .select('*')
        .order('start_datetime', { ascending: true });

      if (activationsError) {
        console.log('Activations table not found, using sample data');
        setActivations(generateSampleActivations());
      } else {
        setActivations(activationsData || []);
      }

      // Calculate metrics
      calculateMetrics(sponsorsData || [], sponsorshipsData || [], activationsData || []);
      
      // Generate recent activity
      generateRecentActivity(sponsorsData || [], sponsorshipsData || []);

      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message);
      // Use sample data as fallback
      useSampleData();
      setIsLoading(false);
    }
  };

  const calculateMetrics = (sponsorsData: Sponsor[], sponsorshipsData: Sponsorship[], activationsData: SponsorActivation[]) => {
    const activeSponsors = sponsorsData.filter(s => s.status === 'active').length;
    const totalInvestment = sponsorshipsData
      .filter(s => s.status === 'active' || s.status === 'confirmed')
      .reduce((sum, s) => sum + (s.amount || 0), 0);
    
    const totalReach = activationsData
      .reduce((sum, a) => sum + (a.actual_reach || a.estimated_reach || 0), 0);
    
    const upcomingActivations = activationsData
      .filter(a => new Date(a.start_datetime) > new Date()).length;
    
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const expiringContracts = sponsorshipsData
      .filter(s => {
        const endDate = new Date(s.end_date);
        return endDate > new Date() && endDate <= thirtyDaysFromNow;
      }).length;

    setMetrics({
      totalSponsors: sponsorsData.length,
      activeSponsors,
      totalInvestment,
      totalReach,
      averageROI: totalInvestment > 0 ? ((totalReach * 0.05) / totalInvestment) * 100 : 0, // Sample ROI calculation
      upcomingActivations,
      pendingProposals: sponsorsData.filter(s => s.status === 'negotiating').length,
      expiringContracts
    });
  };

  const generateRecentActivity = (sponsorsData: Sponsor[], sponsorshipsData: Sponsorship[]) => {
    const activities: RecentActivity[] = [];
    
    // Add recent sponsors as activities
    sponsorsData.slice(0, 3).forEach(sponsor => {
      activities.push({
        id: `sponsor-${sponsor.id}`,
        type: 'sponsor_added',
        title: 'New Sponsor Added',
        description: `${sponsor.company_name} has been added to the sponsor database`,
        timestamp: sponsor.created_at,
        sponsor_name: sponsor.company_name
      });
    });

    // Add recent sponsorships as activities
    sponsorshipsData.slice(0, 2).forEach(sponsorship => {
      activities.push({
        id: `sponsorship-${sponsorship.id}`,
        type: 'contract_signed',
        title: 'Sponsorship Confirmed',
        description: `${sponsorship.sponsor?.company_name || 'Sponsor'} confirmed sponsorship`,
        timestamp: sponsorship.created_at,
        sponsor_name: sponsorship.sponsor?.company_name,
        amount: sponsorship.amount
      });
    });

    // Sort by timestamp
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    setRecentActivity(activities.slice(0, 5));
  };

  const generateSampleActivations = (): SponsorActivation[] => {
    return [
      {
        id: '1',
        sponsorship_id: '1',
        activation_type: 'brand_activation',
        name: 'Chanel Beauty Lounge',
        description: 'Exclusive beauty and styling lounge for VIP guests',
        start_datetime: '2025-09-23T10:00:00Z',
        end_datetime: '2025-10-01T20:00:00Z',
        location: 'Grand Palais - VIP Area',
        estimated_reach: 5000,
        actual_reach: 0,
        status: 'planned'
      },
      {
        id: '2',
        sponsorship_id: '2',
        activation_type: 'product_showcase',
        name: 'Nike Innovation Lab',
        description: 'Interactive display of latest athletic fashion technology',
        start_datetime: '2025-09-06T10:00:00Z',
        end_datetime: '2025-09-14T20:00:00Z',
        location: 'Spring Studios - Main Hall',
        estimated_reach: 10000,
        actual_reach: 0,
        status: 'planned'
      }
    ];
  };

  const useSampleData = () => {
    // Sample sponsors
    const sampleSponsors: Sponsor[] = [
      {
        id: '1',
        company_name: 'Chanel',
        slug: 'chanel',
        industry: 'Luxury Fashion',
        website: 'https://www.chanel.com',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Chanel_logo.svg',
        description: 'French luxury fashion house',
        contact_name: 'Marie Dubois',
        contact_email: 'marie.dubois@chanel.com',
        contact_phone: '+33 1 44 50 22 00',
        status: 'active',
        tags: ['luxury', 'haute-couture', 'premium'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        company_name: 'Nike',
        slug: 'nike',
        industry: 'Sportswear',
        website: 'https://www.nike.com',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg',
        description: 'Global leader in athletic footwear and apparel',
        contact_name: 'Jason Chen',
        contact_email: 'jason.chen@nike.com',
        contact_phone: '+1 503-671-6453',
        status: 'active',
        tags: ['sportswear', 'athletic', 'innovation'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        company_name: 'Louis Vuitton',
        slug: 'louis-vuitton',
        industry: 'Luxury Goods',
        website: 'https://www.louisvuitton.com',
        logo_url: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Louis_Vuitton_logo.svg',
        description: 'French luxury fashion house and company',
        contact_name: 'Pierre Moreau',
        contact_email: 'pierre.moreau@louisvuitton.com',
        status: 'active',
        tags: ['luxury', 'leather-goods', 'heritage'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    setSponsors(sampleSponsors);

    // Sample packages
    const samplePackages: SponsorPackage[] = [
      {
        id: '1',
        package_name: 'Diamond Sponsor',
        price: 100000,
        benefits: ['Primary logo placement', 'VIP table for 10', 'Opening ceremony speaking'],
        visibility_level: 'premium',
        is_available: true
      },
      {
        id: '2',
        package_name: 'Platinum Sponsor',
        price: 50000,
        benefits: ['Logo on materials', 'VIP seating for 6', 'Backstage passes'],
        visibility_level: 'high',
        is_available: true
      },
      {
        id: '3',
        package_name: 'Gold Sponsor',
        price: 25000,
        benefits: ['Logo on select materials', 'Reserved seating for 4'],
        visibility_level: 'medium',
        is_available: true
      }
    ];

    setPackages(samplePackages);

    // Sample metrics
    setMetrics({
      totalSponsors: 10,
      activeSponsors: 7,
      totalInvestment: 750000,
      totalReach: 46000,
      averageROI: 23,
      upcomingActivations: 5,
      pendingProposals: 3,
      expiringContracts: 2
    });
  };

  const addSponsor = async (sponsorData: Partial<Sponsor>) => {
    try {
      const { data, error } = await supabase
        .from('sponsors')
        .insert([sponsorData])
        .select()
        .single();

      if (error) throw error;
      
      setSponsors([data, ...sponsors]);
      return { success: true, data };
    } catch (err) {
      console.error('Error adding sponsor:', err);
      return { success: false, error: err.message };
    }
  };

  const createProposal = async (proposalData: any) => {
    try {
      // This would integrate with your proposal generation system
      console.log('Creating proposal:', proposalData);
      return { success: true, message: 'Proposal created successfully' };
    } catch (err) {
      console.error('Error creating proposal:', err);
      return { success: false, error: err.message };
    }
  };

  return {
    sponsors,
    sponsorships,
    packages,
    activations,
    metrics,
    recentActivity,
    isLoading,
    error,
    addSponsor,
    createProposal,
    refetch: fetchDashboardData
  };
};

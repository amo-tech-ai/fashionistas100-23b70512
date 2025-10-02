// Mock sponsor data service
export interface Sponsor {
  id: string;
  name: string;
  industry: string;
  website: string;
  phone: string;
  email: string;
  tier: 'title' | 'platinum' | 'gold' | 'silver' | 'bronze';
  logo_url?: string;
  added_date: string;
  contact_person: string;
  status: 'active' | 'inactive' | 'pending';
  investment: number;
  events_count: number;
  description?: string;
  location?: string;
  founded_date?: string;
  audience_reach?: number;
  engagement_score?: number;
  sponsorship_history?: Array<{
    event_name: string;
    date: string;
    amount: number;
  }>;
}

// Mock fashion industry sponsors
const mockSponsors: Sponsor[] = [
  {
    id: '1',
    name: 'Vogue Italia',
    industry: 'Fashion Media',
    website: 'https://vogue.it',
    phone: '+39 02 8542 9210',
    email: 'partnerships@vogue.it',
    tier: 'title',
    logo_url: 'https://logo.clearbit.com/vogue.it',
    added_date: '2024-01-15',
    contact_person: 'Isabella Rossi',
    status: 'active',
    investment: 250000,
    events_count: 12,
    description: 'Leading Italian fashion magazine and media brand',
    location: 'Milan, Italy',
    founded_date: '1965',
    audience_reach: 1200000,
    engagement_score: 87,
    sponsorship_history: [
      { event_name: 'Milan Fashion Week 2024', date: '2024-09-20', amount: 80000 },
      { event_name: 'Paris Fashion Week 2024', date: '2024-10-01', amount: 90000 },
    ]
  },
  {
    id: '2',
    name: 'Chanel',
    industry: 'Luxury Fashion',
    website: 'https://chanel.com',
    phone: '+33 1 44 50 70 00',
    email: 'events@chanel.com',
    tier: 'platinum',
    logo_url: 'https://logo.clearbit.com/chanel.com',
    added_date: '2024-02-20',
    contact_person: 'Marie Dubois',
    status: 'active',
    investment: 180000,
    events_count: 10,
    description: 'Iconic French luxury fashion house',
    location: 'Paris, France',
    founded_date: '1910',
    audience_reach: 2500000,
    engagement_score: 92
  },
  {
    id: '3',
    name: 'Louis Vuitton',
    industry: 'Luxury Fashion',
    website: 'https://louisvuitton.com',
    phone: '+33 1 40 40 25 25',
    email: 'sponsorships@lv.com',
    tier: 'platinum',
    logo_url: 'https://logo.clearbit.com/louisvuitton.com',
    added_date: '2024-03-10',
    contact_person: 'Jean-Pierre Laurent',
    status: 'active',
    investment: 200000,
    events_count: 9,
    description: 'World-renowned luxury fashion brand',
    location: 'Paris, France',
    founded_date: '1854',
    audience_reach: 3000000,
    engagement_score: 94
  },
  {
    id: '4',
    name: 'Estée Lauder',
    industry: 'Beauty',
    website: 'https://esteelauder.com',
    phone: '+1 212 572 4200',
    email: 'brand@esteelauder.com',
    tier: 'gold',
    logo_url: 'https://logo.clearbit.com/esteelauder.com',
    added_date: '2024-04-05',
    contact_person: 'Amanda Roberts',
    status: 'active',
    investment: 120000,
    events_count: 8,
    description: 'Global leader in prestige beauty',
    location: 'New York, USA',
    founded_date: '1946',
    audience_reach: 1800000,
    engagement_score: 85
  },
  {
    id: '5',
    name: 'Versace',
    industry: 'Fashion',
    website: 'https://versace.com',
    phone: '+39 02 760 931',
    email: 'partnerships@versace.com',
    tier: 'gold',
    logo_url: 'https://logo.clearbit.com/versace.com',
    added_date: '2024-05-12',
    contact_person: 'Sofia Romano',
    status: 'active',
    investment: 110000,
    events_count: 7,
    description: 'Italian luxury fashion company',
    location: 'Milan, Italy',
    founded_date: '1978',
    audience_reach: 1500000,
    engagement_score: 88
  },
  {
    id: '6',
    name: 'Swarovski',
    industry: 'Luxury Accessories',
    website: 'https://swarovski.com',
    phone: '+43 5224 500',
    email: 'events@swarovski.com',
    tier: 'silver',
    logo_url: 'https://logo.clearbit.com/swarovski.com',
    added_date: '2024-06-18',
    contact_person: 'Klaus Schmidt',
    status: 'active',
    investment: 75000,
    events_count: 6,
    description: 'Austrian producer of glass',
    location: 'Wattens, Austria',
    founded_date: '1895',
    audience_reach: 900000,
    engagement_score: 82
  },
  {
    id: '7',
    name: 'Bulgari',
    industry: 'Luxury Jewelry',
    website: 'https://bulgari.com',
    phone: '+39 06 688 101',
    email: 'brand@bulgari.com',
    tier: 'silver',
    logo_url: 'https://logo.clearbit.com/bulgari.com',
    added_date: '2024-07-22',
    contact_person: 'Luca Bianchi',
    status: 'active',
    investment: 85000,
    events_count: 5,
    description: 'Italian luxury jewelry and watches',
    location: 'Rome, Italy',
    founded_date: '1884',
    audience_reach: 1100000,
    engagement_score: 86
  },
  {
    id: '8',
    name: 'Cartier',
    industry: 'Luxury Jewelry',
    website: 'https://cartier.com',
    phone: '+33 1 44 55 32 20',
    email: 'partnerships@cartier.com',
    tier: 'gold',
    logo_url: 'https://logo.clearbit.com/cartier.com',
    added_date: '2024-08-15',
    contact_person: 'Amélie Moreau',
    status: 'pending',
    investment: 95000,
    events_count: 4,
    description: 'French luxury goods conglomerate',
    location: 'Paris, France',
    founded_date: '1847',
    audience_reach: 1300000,
    engagement_score: 90
  },
  {
    id: '9',
    name: 'Dior',
    industry: 'Luxury Fashion',
    website: 'https://dior.com',
    phone: '+33 1 40 73 73 73',
    email: 'events@dior.com',
    tier: 'platinum',
    logo_url: 'https://logo.clearbit.com/dior.com',
    added_date: '2024-09-05',
    contact_person: 'Charlotte Lefevre',
    status: 'active',
    investment: 190000,
    events_count: 11,
    description: 'French luxury fashion house',
    location: 'Paris, France',
    founded_date: '1946',
    audience_reach: 2800000,
    engagement_score: 93
  },
  {
    id: '10',
    name: 'Prada',
    industry: 'Luxury Fashion',
    website: 'https://prada.com',
    phone: '+39 02 550 4211',
    email: 'sponsorships@prada.com',
    tier: 'gold',
    logo_url: 'https://logo.clearbit.com/prada.com',
    added_date: '2024-09-20',
    contact_person: 'Marco Ferretti',
    status: 'active',
    investment: 130000,
    events_count: 8,
    description: 'Italian luxury fashion house',
    location: 'Milan, Italy',
    founded_date: '1913',
    audience_reach: 2000000,
    engagement_score: 89
  }
];

export const getAllSponsors = async (): Promise<Sponsor[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockSponsors), 300);
  });
};

export const getSponsorById = async (id: string): Promise<Sponsor | null> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const sponsor = mockSponsors.find(s => s.id === id);
      resolve(sponsor || null);
    }, 300);
  });
};

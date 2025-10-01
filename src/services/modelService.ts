export interface ModelProfile {
  id: string;
  name: string;
  agency: string;
  category: string;
  location: string;
  age: number;
  height: string;
  bust: string;
  waist: string;
  hips: string;
  shoeSize: string;
  hairColor: string;
  eyeColor: string;
  experience: string;
  availability: string;
  bookedPercentage: number;
  nextAvailable: string;
  pricePerHour: number;
  pricePerShow: number;
  dailyRate?: number;
  status: 'Available' | 'Booked' | 'On Hold';
  image: string;
  portfolioImages: string[];
  videoReel?: string;
  recentBookings: string[];
  pastEvents: Array<{ name: string; year: number }>;
  brandsWorkedWith: string[];
  bio: string;
  reviews: Array<{ author: string; comment: string; rating: number }>;
  compCardUrl?: string;
  managerName?: string;
  managerEmail?: string;
  managerPhone?: string;
}

// Mock data for models
const mockModels: ModelProfile[] = [
  {
    id: '1',
    name: 'Sophia Martinez',
    agency: 'Elite Model Management',
    category: 'Runway',
    location: 'Paris, France',
    age: 24,
    height: '5\'10"',
    bust: '34"',
    waist: '24"',
    hips: '36"',
    shoeSize: '8.5',
    hairColor: 'Dark Brown',
    eyeColor: 'Brown',
    experience: '6 years',
    availability: 'Available',
    bookedPercentage: 75,
    nextAvailable: 'Sept 1, 2029',
    pricePerHour: 400,
    pricePerShow: 500,
    dailyRate: 3200,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=600',
    portfolioImages: [
      'https://images.unsplash.com/photo-1558008258-3256797b43f3?q=80&w=800',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800',
      'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=800',
    ],
    videoReel: 'https://example.com/sophia-reel.mp4',
    recentBookings: ['Paris Fashion Week 2029', 'Chanel Campaign'],
    pastEvents: [
      { name: 'Paris Fashion Week', year: 2029 },
      { name: 'Milan Fashion Week', year: 2028 },
      { name: 'Runway Revolution', year: 2028 },
    ],
    brandsWorkedWith: ['Chanel', 'Dior', 'Louis Vuitton', 'Hermès'],
    bio: 'International runway model specializing in haute couture and luxury brands. Known for elegant presence and versatility on the runway.',
    reviews: [
      {
        author: 'Jean-Pierre Laurent, Creative Director at Chanel',
        comment: 'Sophia brings incredible grace and professionalism to every show. A true runway artist.',
        rating: 5,
      },
      {
        author: 'Maria Rossi, Fashion Week Organizer',
        comment: 'Always punctual, always professional. One of the best models we work with.',
        rating: 5,
      },
    ],
    compCardUrl: '/downloads/sophia-martinez-comp-card.pdf',
    managerName: 'Claire Dubois',
    managerEmail: 'claire@elitemodels.com',
    managerPhone: '+33 1 42 56 78 90',
  },
  {
    id: '2',
    name: 'Liam Chen',
    agency: 'Next Models',
    category: 'Editorial',
    location: 'New York, USA',
    age: 26,
    height: '6\'1"',
    bust: '38"',
    waist: '30"',
    hips: '38"',
    shoeSize: '11',
    hairColor: 'Black',
    eyeColor: 'Brown',
    experience: '8 years',
    availability: 'Booked',
    bookedPercentage: 90,
    nextAvailable: 'Sept 15, 2029',
    pricePerHour: 300,
    pricePerShow: 450,
    dailyRate: 2400,
    status: 'Booked',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600',
    portfolioImages: [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800',
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800',
    ],
    recentBookings: ['Vogue Editorial', 'Ralph Lauren Campaign'],
    pastEvents: [
      { name: 'New York Fashion Week', year: 2029 },
      { name: 'Vogue Italia Editorial', year: 2028 },
    ],
    brandsWorkedWith: ['Ralph Lauren', 'Calvin Klein', 'Hugo Boss'],
    bio: 'Versatile editorial model with extensive experience in high fashion photography and commercial work.',
    reviews: [
      {
        author: 'Anna Schmidt, Vogue Editor',
        comment: 'Liam has an incredible range and brings energy to every shoot.',
        rating: 5,
      },
    ],
    managerName: 'Sarah Johnson',
    managerEmail: 'sarah@nextmodels.com',
    managerPhone: '+1 212 555 0123',
  },
];

export const getModelById = async (id: string): Promise<ModelProfile | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const model = mockModels.find((m) => m.id === id);
  return model || null;
};

export const getAllModels = async (): Promise<ModelProfile[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockModels;
};

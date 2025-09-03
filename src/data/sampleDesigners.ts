export interface Designer {
  id: string;
  name: string;
  brand: string;
  specialty: string;
  experience: 'Emerging' | 'Established' | 'Luxury';
  city: string;
  bio: string;
  image: string;
  portfolio: string[];
  contact: {
    email: string;
    website: string;
    instagram: string;
  };
}

export const sampleDesigners: Designer[] = [
  {
    id: '1',
    name: 'Alessandro Rossi',
    brand: 'Rossi Couture',
    specialty: 'Haute Couture',
    experience: 'Luxury',
    city: 'Milan',
    bio: 'Alessandro Rossi is a master of Italian haute couture with over 15 years of experience creating timeless pieces for the global elite.',
    image: '/src/assets/runway-3.jpg',
    portfolio: ['/src/assets/hero-runway.jpg', '/src/assets/event-poster.jpg'],
    contact: {
      email: 'alessandro@rossicouture.com',
      website: 'rossicouture.com',
      instagram: '@rossicouture'
    }
  },
  {
    id: '2',
    name: 'Sofia Chen',
    brand: 'Chen Studios',
    specialty: 'Sustainable Fashion',
    experience: 'Emerging',
    city: 'New York',
    bio: 'Sofia Chen is revolutionizing fashion with her innovative approach to sustainable design and ethical production methods.',
    image: '/src/assets/runway-4.jpg',
    portfolio: ['/src/assets/designer-studio.jpg', '/src/assets/hero-runway.jpg'],
    contact: {
      email: 'sofia@chenstudios.com',
      website: 'chenstudios.com',
      instagram: '@chenstudios'
    }
  },
  {
    id: '3',
    name: 'Maya Laurent',
    brand: 'Laurent Paris',
    specialty: 'Ready-to-Wear',
    experience: 'Established',
    city: 'Paris',
    bio: 'Maya Laurent brings Parisian elegance to modern ready-to-wear, creating sophisticated pieces for the contemporary woman.',
    image: '/src/assets/runway-5.jpg',
    portfolio: ['/src/assets/event-poster.jpg', '/src/assets/designer-studio.jpg'],
    contact: {
      email: 'maya@laurentparis.com',
      website: 'laurentparis.com',
      instagram: '@laurentparis'
    }
  },
  {
    id: '4',
    name: 'Marcus Thompson',
    brand: 'Thompson Tailoring',
    specialty: 'Menswear',
    experience: 'Established',
    city: 'London',
    bio: 'Marcus Thompson crafts bespoke menswear that combines Savile Row tradition with contemporary innovation.',
    image: '/src/assets/runway-1.jpg',
    portfolio: ['/src/assets/runway-2.jpg', '/src/assets/runway-6.jpg'],
    contact: {
      email: 'marcus@thompsontailoring.com',
      website: 'thompsontailoring.com',
      instagram: '@thompsontailoring'
    }
  },
  {
    id: '5',
    name: 'Yuki Tanaka',
    brand: 'Tanaka Avant-Garde',
    specialty: 'Avant-Garde',
    experience: 'Emerging',
    city: 'Tokyo',
    bio: 'Yuki Tanaka pushes the boundaries of fashion with experimental designs that blur the line between art and clothing.',
    image: '/src/assets/runway-2.jpg',
    portfolio: ['/src/assets/runway-3.jpg', '/src/assets/runway-4.jpg'],
    contact: {
      email: 'yuki@tanaka-ag.com',
      website: 'tanaka-ag.com',
      instagram: '@tanaka_avantgarde'
    }
  },
  {
    id: '6',
    name: 'Isabella Rodriguez',
    brand: 'Rodriguez Bridal',
    specialty: 'Bridal',
    experience: 'Luxury',
    city: 'Barcelona',
    bio: 'Isabella Rodriguez creates dream wedding gowns that combine Spanish romance with modern sophistication.',
    image: '/src/assets/runway-6.jpg',
    portfolio: ['/src/assets/runway-1.jpg', '/src/assets/runway-5.jpg'],
    contact: {
      email: 'isabella@rodriguezbridal.com',
      website: 'rodriguezbridal.com',
      instagram: '@rodriguezbridal'
    }
  }
];
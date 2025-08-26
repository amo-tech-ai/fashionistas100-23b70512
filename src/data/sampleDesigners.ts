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
    image: '/src/assets/designer-studio.jpg',
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
    image: '/src/assets/event-poster.jpg',
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
    image: '/src/assets/hero-runway.jpg',
    portfolio: ['/src/assets/event-poster.jpg', '/src/assets/designer-studio.jpg'],
    contact: {
      email: 'maya@laurentparis.com',
      website: 'laurentparis.com',
      instagram: '@laurentparis'
    }
  }
];
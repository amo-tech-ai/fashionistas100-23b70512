export interface Event {
  id: string;
  title: string;
  designer: string;
  venue: string;
  date: string;
  time: string;
  price: {
    general: number;
    vip: number;
    platinum: number;
  };
  image: string;
  description: string;
  category: 'Runway' | 'VIP' | 'Emerging Designers' | 'Haute Couture';
  city: string;
  featured: boolean;
}

export const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Milan Couture Week Opening',
    designer: 'Alessandro Rossi',
    venue: 'Teatro alla Scala',
    date: '2024-09-15',
    time: '20:00',
    price: {
      general: 150,
      vip: 350,
      platinum: 750
    },
    image: '/src/assets/runway-2.jpg',
    description: 'Experience the grandeur of Milan Couture Week with an exclusive runway show featuring the latest haute couture collection.',
    category: 'Haute Couture',
    city: 'Milan',
    featured: true
  },
  {
    id: '2',
    title: 'Emerging Talents Showcase',
    designer: 'Sofia Chen',
    venue: 'The Design District',
    date: '2024-09-20',
    time: '19:30',
    price: {
      general: 75,
      vip: 180,
      platinum: 350
    },
    image: '/src/assets/runway-3.jpg',
    description: 'Discover the next generation of fashion innovators in this exclusive showcase of emerging talent.',
    category: 'Emerging Designers',
    city: 'New York',
    featured: true
  },
  {
    id: '3',
    title: 'Sustainable Fashion Forward',
    designer: 'Maya Laurent',
    venue: 'Eco Fashion Hub',
    date: '2024-09-25',
    time: '18:00',
    price: {
      general: 100,
      vip: 250,
      platinum: 500
    },
    image: '/src/assets/runway-4.jpg',
    description: 'A revolutionary showcase of sustainable fashion, blending eco-consciousness with high-end design.',
    category: 'Runway',
    city: 'Paris',
    featured: true
  },
  {
    id: '4',
    title: 'Avant-Garde Evening',
    designer: 'Viktor Noir',
    venue: 'Gallery Modern',
    date: '2024-10-01',
    time: '21:00',
    price: {
      general: 200,
      vip: 450,
      platinum: 800
    },
    image: '/src/assets/runway-5.jpg',
    description: 'An evening of avant-garde fashion pushing the boundaries of traditional design.',
    category: 'VIP',
    city: 'London',
    featured: false
  },
  {
    id: '5',
    title: 'Resort Collection Preview',
    designer: 'Carmen Rodriguez',
    venue: 'Beach Club Monaco',
    date: '2024-10-05',
    time: '17:00',
    price: {
      general: 120,
      vip: 280,
      platinum: 550
    },
    image: '/src/assets/runway-6.jpg',
    description: 'Exclusive preview of the resort collection in a stunning beachside setting.',
    category: 'Runway',
    city: 'Monaco',
    featured: false
  },
  {
    id: '6',
    title: 'Digital Fashion Experience',
    designer: 'Alex Kim',
    venue: 'Tech Fashion Lab',
    date: '2024-10-10',
    time: '19:00',
    price: {
      general: 90,
      vip: 200,
      platinum: 400
    },
    image: '/src/assets/runway-1.jpg',
    description: 'Where technology meets fashion in this immersive digital fashion experience.',
    category: 'Emerging Designers',
    city: 'Tokyo',
    featured: true
  }
];
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
    title: 'Cumbre de Moda Sostenible Medellín',
    designer: 'Verde Studios',
    venue: 'Centro de Innovación',
    date: '2025-09-05',
    time: '16:00',
    price: {
      general: 45,
      vip: 120,
      platinum: 250
    },
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=600&fit=crop&crop=center',
    description: 'Cumbre de dos días enfocada en innovación sostenible en la industria de la moda, presentando tecnologías eco-amigables, textiles orgánicos y prácticas de producción responsable.',
    category: 'Runway',
    city: 'Medellín',
    featured: true
  },
  {
    id: '2',
    title: 'Milano Fashion Week 2025',
    designer: 'Atelier Milano',
    venue: 'Teatro alla Scala',
    date: '2025-09-15',
    time: '20:00',
    price: {
      general: 150,
      vip: 350,
      platinum: 750
    },
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=600&fit=crop&crop=center',
    description: 'Experience the grandeur of Milano Fashion Week with an exclusive runway show featuring the latest haute couture collection from Italy\'s finest designers.',
    category: 'Haute Couture',
    city: 'Milano',
    featured: true
  },
  {
    id: '3',
    title: 'Emerging Colombian Designers',
    designer: 'Various Artists',
    venue: 'Cartagena Cultural Center',
    date: '2025-09-20',
    time: '19:30',
    price: {
      general: 65,
      vip: 140,
      platinum: 280
    },
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop&crop=center',
    description: 'Discover the next generation of Colombian fashion innovators in this exclusive showcase celebrating local talent and cultural heritage.',
    category: 'Emerging Designers',
    city: 'Cartagena',
    featured: true
  },
  {
    id: '4',
    title: 'Bogotá Bridal Couture Week',
    designer: 'Cartagena Bridal',
    venue: 'Hotel Casa San Agustín',
    date: '2025-10-01',
    time: '18:00',
    price: {
      general: 85,
      vip: 220,
      platinum: 450
    },
    image: 'https://images.unsplash.com/photo-1594736797933-d0ae710da089?w=800&h=600&fit=crop&crop=center',
    description: 'An exclusive bridal fashion showcase featuring the most elegant wedding dress collections from Colombia\'s premier bridal designers.',
    category: 'Haute Couture',
    city: 'Bogotá',
    featured: true
  },
  {
    id: '5',
    title: 'Urban Streetwear Cali',
    designer: 'Urban Edge Cali',
    venue: 'Zona Rosa Cultural',
    date: '2025-10-05',
    time: '21:00',
    price: {
      general: 55,
      vip: 130,
      platinum: 280
    },
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=600&fit=crop&crop=center',
    description: 'Contemporary streetwear fashion show showcasing bold urban designs and the vibrant street culture of Cali.',
    category: 'VIP',
    city: 'Cali',
    featured: false
  },
  {
    id: '6',
    title: 'Amazonia Fashion Experience',
    designer: 'Amazonia Textiles',
    venue: 'Barranquilla Design Hub',
    date: '2025-10-10',
    time: '19:00',
    price: {
      general: 70,
      vip: 180,
      platinum: 350
    },
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&h=600&fit=crop&crop=center',
    description: 'Sustainable evening wear inspired by Colombian biodiversity, featuring handcrafted pieces that celebrate our natural heritage.',
    category: 'Runway',
    city: 'Barranquilla',
    featured: true
  },
  {
    id: '7',
    title: 'Paris Fashion Innovation',
    designer: 'Tech Couture Labs',
    venue: 'Grand Palais',
    date: '2025-10-15',
    time: '20:30',
    price: {
      general: 180,
      vip: 420,
      platinum: 850
    },
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop&crop=center',
    description: 'Where technology meets haute couture in this groundbreaking fashion show featuring smart textiles and wearable technology.',
    category: 'VIP',
    city: 'Paris',
    featured: false
  },
  {
    id: '8',
    title: 'London Avant-Garde Week',
    designer: 'Viktor Noir',
    venue: 'Tate Modern',
    date: '2025-10-20',
    time: '19:00',
    price: {
      general: 120,
      vip: 280,
      platinum: 580
    },
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=600&fit=crop&crop=center',
    description: 'An evening of avant-garde fashion pushing the boundaries of traditional design with experimental silhouettes and materials.',
    category: 'Emerging Designers',
    city: 'London',
    featured: true
  }
];
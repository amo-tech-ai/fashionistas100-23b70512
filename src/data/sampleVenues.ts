export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  image: string;
  description: string;
}

export const sampleVenues: Venue[] = [
  {
    id: '1',
    name: 'Grand Fashion Hall',
    address: '123 Fashion Avenue',
    city: 'Milan',
    capacity: 500,
    image: '/src/assets/venue-setup.jpg',
    description: 'Prestigious venue in the heart of Milan fashion district'
  },
  {
    id: '2',
    name: 'Runway Central',
    address: '456 Style Boulevard',
    city: 'Paris',
    capacity: 300,
    image: '/src/assets/venue-setup.jpg',
    description: 'Modern venue with state-of-the-art lighting and sound'
  },
  {
    id: '3',
    name: 'Designer Studio',
    address: '789 Creative Street',
    city: 'New York',
    capacity: 200,
    image: '/src/assets/venue-setup.jpg',
    description: 'Intimate space perfect for emerging designer showcases'
  }
];
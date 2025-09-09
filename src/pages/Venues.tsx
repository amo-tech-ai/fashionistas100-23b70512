import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Users, Calendar, ChevronRight, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

const Venues = () => {
  const navigate = useNavigate();
  
  const venues = [
    {
      id: '1',
      name: 'Plaza Mayor Convention Center',
      location: 'Medellín, Colombia',
      capacity: '5000',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      price: 'From $5,000/day',
      available: true,
      features: ['Catering', 'AV Equipment', 'Parking', 'WiFi']
    },
    {
      id: '2',
      name: 'Museo de Arte Moderno',
      location: 'Medellín, Colombia',
      capacity: '1500',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400',
      price: 'From $3,500/day',
      available: true,
      features: ['Gallery Space', 'Lighting', 'Security', 'Bar Service']
    },
    {
      id: '3',
      name: 'Fashion District Loft',
      location: 'New York, USA',
      capacity: '800',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400',
      price: 'From $2,500/day',
      available: false,
      features: ['Open Space', 'Natural Light', 'Kitchen', 'Rooftop']
    },
    {
      id: '4',
      name: 'Grand Ballroom Hotel',
      location: 'Paris, France',
      capacity: '3000',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400',
      price: 'From $8,000/day',
      available: true,
      features: ['Luxury', 'Valet', 'Catering', 'Suites']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <button onClick={() => navigate('/')} className="hover:text-gray-900">Home</button>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">Venue Directory</span>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Venue Directory</h1>
              <p className="text-gray-600 mt-1">Find the perfect venue for your fashion event</p>
            </div>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={() => navigate('/venue-dashboard')}
            >
              List Your Venue
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search venues by name or location..." 
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Venue Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {venues.map((venue) => (
            <Card key={venue.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <img 
                  src={venue.image} 
                  alt={venue.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge 
                  className={`absolute top-2 right-2 ${
                    venue.available 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {venue.available ? 'Available' : 'Booked'}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{venue.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <MapPin className="h-3 w-3" />
                  {venue.location}
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{venue.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="h-3 w-3" />
                    {venue.capacity}
                  </div>
                </div>
                <div className="text-purple-600 font-semibold mb-3">{venue.price}</div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {venue.features.slice(0, 2).map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {venue.features.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{venue.features.length - 2}
                    </Badge>
                  )}
                </div>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => navigate(`/venues/${venue.id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Venues;
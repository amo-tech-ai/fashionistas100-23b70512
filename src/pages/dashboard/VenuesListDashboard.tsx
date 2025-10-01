import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  MapPin, 
  Users, 
  DollarSign, 
  Star, 
  Plus,
  MoreVertical,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Venue {
  id: string;
  name: string;
  location: string;
  city: string;
  country: string;
  capacity: number;
  pricePerDay: number;
  rating: number;
  category: string;
  tags: string[];
  image: string;
  status: 'available' | 'booked' | 'pending';
}

const VenuesListDashboard = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [capacityFilter, setCapacityFilter] = useState('all');

  // Sample venue data
  const venues: Venue[] = [
    {
      id: '1',
      name: 'Grand Palais',
      location: 'Paris, France',
      city: 'Paris',
      country: 'France',
      capacity: 2000,
      pricePerDay: 15000,
      rating: 4.8,
      category: 'Couture Runway',
      tags: ['Couture-ready', 'Premium', 'Historic'],
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      status: 'available'
    },
    {
      id: '2',
      name: 'Vogue Hall',
      location: 'New York, USA',
      city: 'New York',
      country: 'USA',
      capacity: 1200,
      pricePerDay: 12500,
      rating: 4.6,
      category: 'Fashion Week Venue',
      tags: ['Fashion Week', 'Premium', 'Downtown'],
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400',
      status: 'available'
    },
    {
      id: '3',
      name: 'Plaza Mayor Convention Center',
      location: 'Medellín, Colombia',
      city: 'Medellín',
      country: 'Colombia',
      capacity: 800,
      pricePerDay: 6000,
      rating: 4.4,
      category: 'Outdoor Showcase',
      tags: ['Outdoor', 'Modern', 'Tech-enabled'],
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      status: 'booked'
    },
    {
      id: '4',
      name: 'Shibuya Arena',
      location: 'Tokyo, Japan',
      city: 'Tokyo',
      country: 'Japan',
      capacity: 3500,
      pricePerDay: 18000,
      rating: 4.7,
      category: 'Expo Center',
      tags: ['Streetwear', 'Large Scale', 'Tech Hub'],
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400',
      status: 'available'
    },
    {
      id: '5',
      name: 'Milan Fashion District Loft',
      location: 'Milan, Italy',
      city: 'Milan',
      country: 'Italy',
      capacity: 600,
      pricePerDay: 8500,
      rating: 4.5,
      category: 'Runway Hall',
      tags: ['Intimate', 'Luxury', 'Design District'],
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      status: 'available'
    },
    {
      id: '6',
      name: 'London Contemporary Space',
      location: 'London, UK',
      city: 'London',
      country: 'UK',
      capacity: 1500,
      pricePerDay: 11000,
      rating: 4.6,
      category: 'Ballroom',
      tags: ['Contemporary', 'Central', 'Versatile'],
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400',
      status: 'pending'
    },
    {
      id: '7',
      name: 'Bogotá Fashion Hub',
      location: 'Bogotá, Colombia',
      city: 'Bogotá',
      country: 'Colombia',
      capacity: 950,
      pricePerDay: 7200,
      rating: 4.3,
      category: 'Fashion Week Venue',
      tags: ['Modern', 'Emerging', 'Tech-ready'],
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
      status: 'available'
    },
    {
      id: '8',
      name: 'Dubai Luxury Pavilion',
      location: 'Dubai, UAE',
      city: 'Dubai',
      country: 'UAE',
      capacity: 2500,
      pricePerDay: 22000,
      rating: 4.9,
      category: 'Expo Center',
      tags: ['Ultra-Premium', 'Waterfront', 'Luxury'],
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400',
      status: 'available'
    }
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'booked':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || venue.category === categoryFilter;
    const matchesCapacity = capacityFilter === 'all' ||
                           (capacityFilter === '0-200' && venue.capacity <= 200) ||
                           (capacityFilter === '200-500' && venue.capacity > 200 && venue.capacity <= 500) ||
                           (capacityFilter === '500+' && venue.capacity > 500);
    
    return matchesSearch && matchesCategory && matchesCapacity;
  });

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="border-b bg-background">
        <div className="flex flex-col gap-4 p-6">
          {/* Breadcrumbs and Title */}
          <div>
            <div className="text-xs text-muted-foreground mb-1">Dashboard / Venues</div>
            <h1 className="text-2xl font-bold text-foreground">Venues</h1>
          </div>

          {/* Search and Filters Row */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search venue, city, or location"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Couture Runway">Couture Runway</SelectItem>
                  <SelectItem value="Fashion Week Venue">Fashion Week</SelectItem>
                  <SelectItem value="Outdoor Showcase">Outdoor</SelectItem>
                  <SelectItem value="Ballroom">Ballroom</SelectItem>
                  <SelectItem value="Expo Center">Expo Center</SelectItem>
                  <SelectItem value="Runway Hall">Runway Hall</SelectItem>
                </SelectContent>
              </Select>

              {/* Capacity Filter */}
              <Select value={capacityFilter} onValueChange={setCapacityFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Capacity" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  <SelectItem value="all">All Capacities</SelectItem>
                  <SelectItem value="0-200">0 - 200</SelectItem>
                  <SelectItem value="200-500">200 - 500</SelectItem>
                  <SelectItem value="500+">500+</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex gap-1 border rounded-md p-1">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-8 w-8 p-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Add New Venue */}
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Venue
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        {viewMode === 'grid' ? (
          <>
            {/* Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVenues.map((venue) => (
                <Card 
                  key={venue.id} 
                  className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden"
                  onClick={() => navigate(`/dashboard/venue/${venue.id}`)}
                >
                  {/* Venue Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge 
                      className={`absolute top-3 right-3 ${getStatusBadgeVariant(venue.status)}`}
                    >
                      {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
                    </Badge>
                  </div>

                  <CardContent className="p-4">
                    {/* Venue Name */}
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{venue.name}</h3>

                    {/* Location */}
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="h-3 w-3 mr-1" />
                      {venue.location}
                    </div>

                    {/* Category Badge */}
                    <Badge variant="secondary" className="mb-3 text-xs">
                      {venue.category}
                    </Badge>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {venue.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {venue.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{venue.tags.length - 2}
                        </Badge>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm mb-3">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="h-3 w-3 mr-1" />
                        {venue.capacity.toLocaleString()}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {venue.rating}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center font-semibold text-primary">
                        <DollarSign className="h-4 w-4" />
                        {venue.pricePerDay.toLocaleString()}/day
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dashboard/venue/${venue.id}`);
                          }}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                            Edit Venue
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Table View */}
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Venue Name</th>
                      <th className="text-left p-4 font-medium">Location</th>
                      <th className="text-left p-4 font-medium">Capacity</th>
                      <th className="text-left p-4 font-medium">Price/Day</th>
                      <th className="text-left p-4 font-medium">Category</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Rating</th>
                      <th className="text-right p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVenues.map((venue) => (
                      <tr key={venue.id} className="border-t hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium">{venue.name}</td>
                        <td className="p-4 text-muted-foreground">{venue.location}</td>
                        <td className="p-4">{venue.capacity.toLocaleString()}</td>
                        <td className="p-4 font-semibold">${venue.pricePerDay.toLocaleString()}</td>
                        <td className="p-4">
                          <Badge variant="secondary" className="text-xs">
                            {venue.category}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={`${getStatusBadgeVariant(venue.status)} text-xs`}>
                            {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                            {venue.rating}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/dashboard/venue/${venue.id}`)}
                            >
                              View
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-background">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredVenues.length} out of {venues.length} venues
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VenuesListDashboard;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  MapPin, 
  Mail, 
  Phone, 
  Globe,
  Calendar,
  Star,
  Users,
  Eye,
  Edit,
  Trash2,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Venue {
  id: string;
  name: string;
  venue_type: string;
  address: string;
  capacity: number;
  hourly_rate: number;
  amenities: string[];
  contact_email: string;
  contact_phone: string;
  website: string;
  images: string[];
  is_active: boolean;
  availability_calendar: any;
  coordinates: { lat: number; lng: number };
  added_date: string;
  events_count: number;
  rating: number;
  description: string;
}

const VenueDirectoryDashboard = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCapacity, setFilterCapacity] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'card' | 'map'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      setLoading(true);
      
      // Load from Supabase venues table
      const { data, error } = await supabase
        .from('venues')
        .select(`
          id,
          name,
          venue_type,
          address,
          capacity,
          hourly_rate,
          amenities,
          images,
          is_active,
          availability_calendar,
          coordinates,
          created_at,
          description
        `);

      if (error) {
        console.error('Error loading venues:', error);
        // Fallback to mock data
        loadMockVenues();
        return;
      }

      const formattedVenues: Venue[] = data.map(venue => ({
        id: venue.id,
        name: venue.name,
        venue_type: venue.venue_type || 'convention_center',
        address: venue.address || '',
        capacity: venue.capacity || 0,
        hourly_rate: venue.hourly_rate || 0,
        amenities: venue.amenities || [],
        contact_email: 'contact@venue.com', // Mock data
        contact_phone: '+57-1-234-5678', // Mock data
        website: 'https://venue.com', // Mock data
        images: venue.images || [],
        is_active: venue.is_active || false,
        availability_calendar: venue.availability_calendar || {},
        coordinates: venue.coordinates || { lat: 0, lng: 0 },
        added_date: venue.created_at,
        events_count: Math.floor(Math.random() * 15) + 1, // Mock data
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Mock rating 3-5
        description: venue.description || ''
      }));

      setVenues(formattedVenues);
    } catch (error) {
      console.error('Error loading venues:', error);
      loadMockVenues();
    } finally {
      setLoading(false);
    }
  };

  const loadMockVenues = () => {
    const mockVenues: Venue[] = [
      {
        id: '1',
        name: 'Grand Fashion Hall',
        venue_type: 'convention_center',
        address: 'Calle 85 #15-20, Chapinero, Bogotá',
        capacity: 500,
        hourly_rate: 500000,
        amenities: ['WiFi', 'Backstage Area', 'Catering', 'Lighting', 'Sound System'],
        contact_email: 'events@grandfashionhall.com',
        contact_phone: '+57-1-234-5678',
        website: 'https://grandfashionhall.com',
        images: ['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop'],
        is_active: true,
        availability_calendar: {},
        coordinates: { lat: 4.6097, lng: -74.0817 },
        added_date: '2024-10-24',
        events_count: 12,
        rating: 4.8,
        description: 'Bogotá\'s premier fashion event venue with state-of-the-art facilities.'
      },
      {
        id: '2',
        name: 'Medellín Convention Center',
        venue_type: 'convention_center',
        address: 'Carrera 43A #1-50, El Poblado, Medellín',
        capacity: 800,
        hourly_rate: 400000,
        amenities: ['WiFi', 'Multiple Rooms', 'Catering', 'Professional Lighting'],
        contact_email: 'bookings@medellinconvention.com',
        contact_phone: '+57-4-567-8901',
        website: 'https://medellinconvention.com',
        images: ['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop'],
        is_active: true,
        availability_calendar: {},
        coordinates: { lat: 6.2442, lng: -75.5812 },
        added_date: '2024-10-16',
        events_count: 8,
        rating: 4.6,
        description: 'Modern convention center in El Poblado with flexible spaces.'
      },
      {
        id: '3',
        name: 'Cali Expo Center',
        venue_type: 'exhibition_center',
        address: 'Carrera 8 #157-00, Cali',
        capacity: 2500,
        hourly_rate: 300000,
        amenities: ['WiFi', 'Parking', 'Catering', 'Conference Rooms', 'Outdoor Areas'],
        contact_email: 'info@caliexpo.com',
        contact_phone: '+57-2-345-6789',
        website: 'https://caliexpo.com',
        images: ['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop'],
        is_active: true,
        availability_calendar: {},
        coordinates: { lat: 3.4516, lng: -76.5320 },
        added_date: '2024-10-10',
        events_count: 6,
        rating: 4.4,
        description: 'Large exhibition center perfect for major fashion events.'
      },
      {
        id: '4',
        name: 'Cartagena Historic Center',
        venue_type: 'historic_venue',
        address: 'Calle 24 #8A-34, Centro Histórico, Cartagena',
        capacity: 1500,
        hourly_rate: 600000,
        amenities: ['WiFi', 'Waterfront View', 'Terraces', 'Historic Charm'],
        contact_email: 'events@cartagenahistoric.com',
        contact_phone: '+57-5-456-7890',
        website: 'https://cartagenahistoric.com',
        images: ['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop'],
        is_active: true,
        availability_calendar: {},
        coordinates: { lat: 10.3910, lng: -75.4794 },
        added_date: '2024-10-05',
        events_count: 4,
        rating: 4.9,
        description: 'Exclusive historic venue with stunning colonial architecture.'
      },
      {
        id: '5',
        name: 'Barranquilla Modern Art Center',
        venue_type: 'art_gallery',
        address: 'Calle 84 #52-20, El Prado, Barranquilla',
        capacity: 2000,
        hourly_rate: 250000,
        amenities: ['WiFi', 'Art Exhibitions', 'Modern Design', 'Flexible Layout'],
        contact_email: 'bookings@barranquillaart.com',
        contact_phone: '+57-5-567-8901',
        website: 'https://barranquillaart.com',
        images: ['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop'],
        is_active: true,
        availability_calendar: {},
        coordinates: { lat: 10.9685, lng: -74.7813 },
        added_date: '2024-09-28',
        events_count: 3,
        rating: 4.2,
        description: 'Contemporary art space perfect for avant-garde fashion shows.'
      }
    ];

    setVenues(mockVenues);
  };

  const filteredVenues = venues.filter(venue => {
    const venueAddress = typeof venue.address === 'object' && venue.address !== null
      ? `${venue.address.street || ''} ${venue.address.city || ''} ${venue.address.state || ''}`.toLowerCase()
      : (venue.address || '').toLowerCase();
      
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venueAddress.includes(searchTerm.toLowerCase()) ||
                         venue.venue_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || venue.venue_type === filterType;
    const matchesCapacity = filterCapacity === 'all' || 
                           (filterCapacity === 'small' && venue.capacity < 500) ||
                           (filterCapacity === 'medium' && venue.capacity >= 500 && venue.capacity < 1000) ||
                           (filterCapacity === 'large' && venue.capacity >= 1000);
    return matchesSearch && matchesType && matchesCapacity;
  });

  const totalPages = Math.ceil(filteredVenues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVenues = filteredVenues.slice(startIndex, startIndex + itemsPerPage);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'convention_center': return 'bg-blue-100 text-blue-800';
      case 'exhibition_center': return 'bg-green-100 text-green-800';
      case 'historic_venue': return 'bg-purple-100 text-purple-800';
      case 'art_gallery': return 'bg-pink-100 text-pink-800';
      case 'hotel': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCapacityLabel = (capacity: number) => {
    if (capacity < 500) return 'Small';
    if (capacity < 1000) return 'Medium';
    return 'Large';
  };

  const getCapacityColor = (capacity: number) => {
    if (capacity < 500) return 'bg-green-100 text-green-800';
    if (capacity < 1000) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <ErrorBoundary>
        <DashboardLayout>
          <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </DashboardLayout>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <DashboardLayout>
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Venue Directory</h1>
            <p className="text-gray-600 mt-1">Browse and manage fashion event venues</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Venue
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Venues</p>
                  <p className="text-2xl font-bold text-gray-900">{venues.length}</p>
                </div>
                <MapPin className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Venues</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {venues.filter(v => v.is_active).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {venues.reduce((sum, v) => sum + v.capacity, 0).toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {venues.length > 0 ? (venues.reduce((sum, v) => sum + v.rating, 0) / venues.length).toFixed(1) : '0.0'}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search venues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Types</option>
                  <option value="convention_center">Convention Center</option>
                  <option value="exhibition_center">Exhibition Center</option>
                  <option value="historic_venue">Historic Venue</option>
                  <option value="art_gallery">Art Gallery</option>
                  <option value="hotel">Hotel</option>
                </select>

                <select
                  value={filterCapacity}
                  onChange={(e) => setFilterCapacity(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Sizes</option>
                  <option value="small">Small (&lt;500)</option>
                  <option value="medium">Medium (500-999)</option>
                  <option value="large">Large (1000+)</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  Table
                </Button>
                <Button
                  variant={viewMode === 'card' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('card')}
                >
                  Card
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                >
                  Map
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">All Venues</h2>
          <p className="text-sm text-gray-600">
            {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredVenues.length)} of {filteredVenues.length}
          </p>
        </div>

        {/* Table View */}
        {viewMode === 'table' && (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Venue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedVenues.map((venue) => (
                      <tr key={venue.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {venue.images.length > 0 ? (
                                <img
                                  className="h-10 w-10 rounded-lg object-cover"
                                  src={venue.images[0]}
                                  alt={venue.name}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <MapPin className="h-5 w-5 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <Link 
                                to={`/venues/${venue.id}`} 
                                className="text-sm font-medium text-gray-900 hover:text-blue-600 hover:underline cursor-pointer"
                              >
                                {venue.name}
                              </Link>
                              <div className="text-sm text-gray-500">{venue.events_count} events</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getTypeColor(venue.venue_type)}>
                            {venue.venue_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {typeof venue.address === 'object' && venue.address !== null
                              ? `${venue.address.street || ''}, ${venue.address.city || ''}, ${venue.address.state || ''}`.replace(/^,\s*|,\s*$/g, '')
                              : venue.address || 'Address not available'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Badge className={getCapacityColor(venue.capacity)}>
                              {getCapacityLabel(venue.capacity)}
                            </Badge>
                            <span className="ml-2 text-sm text-gray-900">{venue.capacity.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${venue.hourly_rate.toLocaleString()}/hr
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm text-gray-900">{venue.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={venue.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {venue.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Link to={`/venues/${venue.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Card View */}
        {viewMode === 'card' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedVenues.map((venue) => (
              <Card key={venue.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {venue.images.length > 0 ? (
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={venue.images[0]}
                          alt={venue.name}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <Link 
                          to={`/venues/${venue.id}`} 
                          className="font-semibold text-gray-900 hover:text-blue-600 hover:underline cursor-pointer"
                        >
                          <h3>{venue.name}</h3>
                        </Link>
                        <p className="text-sm text-gray-600">
                          {typeof venue.address === 'object' && venue.address !== null
                            ? `${venue.address.street || ''}, ${venue.address.city || ''}, ${venue.address.state || ''}`.replace(/^,\s*|,\s*$/g, '')
                            : venue.address || 'Address not available'}
                        </p>
                      </div>
                    </div>
                    <Badge className={getTypeColor(venue.venue_type)}>
                      {venue.venue_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      Capacity: {venue.capacity.toLocaleString()} people
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      ${venue.hourly_rate.toLocaleString()}/hour
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {venue.events_count} events hosted
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="font-semibold text-gray-900">{venue.rating}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Size</p>
                      <Badge className={getCapacityColor(venue.capacity)}>
                        {getCapacityLabel(venue.capacity)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={venue.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {venue.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <div className="flex space-x-2">
                      <Link to={`/venues/${venue.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Map View Placeholder */}
        {viewMode === 'map' && (
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Map View</h3>
                <p className="text-gray-600 mb-4">Interactive map showing venue locations</p>
                <p className="text-sm text-gray-500">Map integration coming soon...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredVenues.length)} of {filteredVenues.length} results
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
          </div>
        </div>
      </DashboardLayout>
    </ErrorBoundary>
  );
};

export default VenueDirectoryDashboard;

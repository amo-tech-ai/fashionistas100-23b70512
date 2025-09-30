import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  User, 
  Mail, 
  Phone, 
  Globe,
  Calendar,
  Star,
  Award,
  Eye,
  Edit,
  Trash2,
  Instagram,
  Palette,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Designer {
  id: string;
  name: string;
  brand_name: string;
  tier: 'emerging' | 'established' | 'celebrity';
  style_categories: string[];
  years_experience: number;
  website: string;
  instagram: string;
  email: string;
  phone: string;
  avatar_url?: string;
  is_verified: boolean;
  is_available: boolean;
  hourly_rate: number;
  portfolio_url: string;
  added_date: string;
  events_count: number;
  rating: number;
}

const DesignersListDashboard = () => {
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterAvailability, setFilterAvailability] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Using imported supabase client

  useEffect(() => {
    loadDesigners();
  }, []);

  const loadDesigners = async () => {
    try {
      setLoading(true);
      
      // Load from Supabase designers table
      const { data, error } = await supabase
        .from('designers')
        .select(`
          id,
          brand_name,
          tier,
          style_categories,
          years_experience,
          website_url,
          instagram_handle,
          hourly_rate,
          is_verified,
          is_available,
          portfolio_url,
          created_at,
          profiles!inner(
            first_name,
            last_name,
            email,
            phone,
            avatar_url
          )
        `);

      if (error) {
        console.error('Error loading designers:', error);
        // Fallback to mock data
        loadMockDesigners();
        return;
      }

      const formattedDesigners: Designer[] = data.map(designer => ({
        id: designer.id,
        name: `${designer.profiles.first_name} ${designer.profiles.last_name}`,
        brand_name: designer.brand_name,
        tier: designer.tier === 'luxury' ? 'established' : designer.tier,
        style_categories: designer.style_categories || [],
        years_experience: designer.years_experience || 0,
        website: designer.website_url || '',
        instagram: designer.instagram_handle || '',
        email: designer.profiles.email,
        phone: designer.profiles.phone || '',
        avatar_url: designer.profiles.avatar_url,
        is_verified: designer.is_verified,
        is_available: designer.is_available,
        hourly_rate: designer.hourly_rate || 0,
        portfolio_url: designer.portfolio_url || '',
        added_date: designer.created_at,
        events_count: Math.floor(Math.random() * 10) + 1, // Mock data
        rating: Math.round((Math.random() * 2 + 3) * 10) / 10 // Mock rating 3-5
      }));

      setDesigners(formattedDesigners);
    } catch (error) {
      console.error('Error loading designers:', error);
      loadMockDesigners();
    } finally {
      setLoading(false);
    }
  };

  const loadMockDesigners = () => {
    const mockDesigners: Designer[] = [
      {
        id: '1',
        name: 'Elena Vásquez',
        brand_name: 'Elegante Studio',
        tier: 'established',
        style_categories: ['Contemporary', 'Haute Couture', 'Ready-to-Wear'],
        years_experience: 8,
        website: 'https://elegantestudio.com',
        instagram: '@elena_elegante',
        email: 'elena@elegantestudio.com',
        phone: '+57-4-567-8901',
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        is_verified: true,
        is_available: true,
        hourly_rate: 150000,
        portfolio_url: 'https://elegantestudio.com/portfolio',
        added_date: '2024-10-24',
        events_count: 12,
        rating: 4.8
      },
      {
        id: '2',
        name: 'Carlos Méndez',
        brand_name: 'CM Couture',
        tier: 'celebrity',
        style_categories: ['Haute Couture', 'Bespoke', 'Luxury'],
        years_experience: 12,
        website: 'https://cmcouture.com',
        instagram: '@carlos_mendez_couture',
        email: 'carlos@cmcouture.com',
        phone: '+57-2-345-6789',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        is_verified: true,
        is_available: true,
        hourly_rate: 300000,
        portfolio_url: 'https://cmcouture.com/portfolio',
        added_date: '2024-10-16',
        events_count: 8,
        rating: 4.9
      },
      {
        id: '3',
        name: 'Ana López',
        brand_name: 'Sustainable Fashion Co',
        tier: 'emerging',
        style_categories: ['Sustainable', 'Eco-Friendly', 'Recycled'],
        years_experience: 3,
        website: 'https://sustainablefashion.co',
        instagram: '@ana_sustainable_fashion',
        email: 'ana@sustainablefashion.co',
        phone: '+57-2-456-7890',
        avatar_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
        is_verified: true,
        is_available: true,
        hourly_rate: 80000,
        portfolio_url: 'https://sustainablefashion.co/portfolio',
        added_date: '2024-10-10',
        events_count: 5,
        rating: 4.2
      },
      {
        id: '4',
        name: 'Roberto Silva',
        brand_name: 'Luxury Atelier',
        tier: 'established',
        style_categories: ['Luxury', 'Ready-to-Wear', 'Custom'],
        years_experience: 10,
        website: 'https://luxuryatelier.com',
        instagram: '@luxury_atelier_co',
        email: 'roberto@luxuryatelier.com',
        phone: '+57-1-456-7890',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        is_verified: true,
        is_available: true,
        hourly_rate: 250000,
        portfolio_url: 'https://luxuryatelier.com/portfolio',
        added_date: '2024-10-05',
        events_count: 6,
        rating: 4.6
      },
      {
        id: '5',
        name: 'Sophia Martínez',
        brand_name: 'Avant-Garde Collective',
        tier: 'emerging',
        style_categories: ['Avant-Garde', 'Experimental', 'Conceptual'],
        years_experience: 2,
        website: 'https://avantgardecollective.com',
        instagram: '@avant_garde_collective',
        email: 'sophia@avantgardecollective.com',
        phone: '+57-4-678-9012',
        avatar_url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=face',
        is_verified: false,
        is_available: true,
        hourly_rate: 70000,
        portfolio_url: 'https://avantgardecollective.com/portfolio',
        added_date: '2024-09-28',
        events_count: 3,
        rating: 3.8
      }
    ];

    setDesigners(mockDesigners);
  };

  const filteredDesigners = designers.filter(designer => {
    const matchesSearch = designer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         designer.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         designer.style_categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTier = filterTier === 'all' || designer.tier === filterTier;
    const matchesAvailability = filterAvailability === 'all' || 
                               (filterAvailability === 'available' && designer.is_available) ||
                               (filterAvailability === 'unavailable' && !designer.is_available);
    return matchesSearch && matchesTier && matchesAvailability;
  });

  const totalPages = Math.ceil(filteredDesigners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDesigners = filteredDesigners.slice(startIndex, startIndex + itemsPerPage);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'celebrity': return 'bg-gradient-to-r from-purple-600 to-purple-800 text-white';
      case 'established': return 'bg-gradient-to-r from-blue-600 to-blue-800 text-white';
      case 'emerging': return 'bg-gradient-to-r from-green-500 to-green-700 text-white';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getAvailabilityColor = (available: boolean) => {
    return available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Designers</h1>
            <p className="text-gray-600 mt-1">Manage fashion designers and their portfolios</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Designer
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Designers</p>
                  <p className="text-2xl font-bold text-gray-900">{designers.length}</p>
                </div>
                <User className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {designers.filter(d => d.is_available).length}
                  </p>
                </div>
                <Award className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Verified</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {designers.filter(d => d.is_verified).length}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {designers.length > 0 ? (designers.reduce((sum, d) => sum + d.rating, 0) / designers.length).toFixed(1) : '0.0'}
                  </p>
                </div>
                <Palette className="h-8 w-8 text-blue-600" />
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
                    placeholder="Search designers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Tiers</option>
                  <option value="celebrity">Celebrity</option>
                  <option value="established">Established</option>
                  <option value="emerging">Emerging</option>
                </select>

                <select
                  value={filterAvailability}
                  onChange={(e) => setFilterAvailability(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Availability</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">All Designers</h2>
          <p className="text-sm text-gray-600">
            {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredDesigners.length)} of {filteredDesigners.length}
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
                        Designer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Style
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
                    {paginatedDesigners.map((designer) => (
                      <tr key={designer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {designer.avatar_url ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={designer.avatar_url}
                                  alt={designer.name}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="h-5 w-5 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <Link 
                                to={`/designers/${designer.id}`} 
                                className="text-sm font-medium text-gray-900 hover:text-blue-600 hover:underline cursor-pointer"
                              >
                                {designer.name}
                              </Link>
                              <div className="text-sm text-gray-500">{designer.years_experience} years exp.</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{designer.brand_name}</div>
                          {designer.is_verified && (
                            <div className="flex items-center text-xs text-blue-600">
                              <Star className="h-3 w-3 mr-1" />
                              Verified
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getTierColor(designer.tier)}>
                            {designer.tier.charAt(0).toUpperCase() + designer.tier.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {designer.style_categories.slice(0, 2).map((category, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                            {designer.style_categories.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{designer.style_categories.length - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${designer.hourly_rate.toLocaleString()}/hr
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className="text-sm text-gray-900">{designer.rating}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getAvailabilityColor(designer.is_available)}>
                            {designer.is_available ? 'Available' : 'Unavailable'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Link to={`/designers/${designer.id}`}>
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
            {paginatedDesigners.map((designer) => (
              <Card key={designer.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {designer.avatar_url ? (
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={designer.avatar_url}
                          alt={designer.name}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <Link 
                          to={`/designers/${designer.id}`} 
                          className="font-semibold text-gray-900 hover:text-blue-600 hover:underline cursor-pointer"
                        >
                          {designer.name}
                        </Link>
                        <p className="text-sm text-gray-600">{designer.brand_name}</p>
                        {designer.is_verified && (
                          <div className="flex items-center text-xs text-blue-600">
                            <Star className="h-3 w-3 mr-1" />
                            Verified
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge className={getTierColor(designer.tier)}>
                      {designer.tier.charAt(0).toUpperCase() + designer.tier.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {designer.years_experience} years experience
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Palette className="h-4 w-4 mr-2" />
                      {designer.style_categories.slice(0, 2).join(', ')}
                      {designer.style_categories.length > 2 && ` +${designer.style_categories.length - 2} more`}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Instagram className="h-4 w-4 mr-2" />
                      {designer.instagram}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Hourly Rate</p>
                      <p className="font-semibold text-gray-900">${designer.hourly_rate.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rating</p>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="font-semibold text-gray-900">{designer.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={getAvailabilityColor(designer.is_available)}>
                      {designer.is_available ? 'Available' : 'Unavailable'}
                    </Badge>
                    <div className="flex space-x-2">
                      <Link to={`/designers/${designer.id}`}>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDesigners.length)} of {filteredDesigners.length} results
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
  );
};

export default DesignersListDashboard;

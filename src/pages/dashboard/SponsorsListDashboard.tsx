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
  Building2, 
  Mail, 
  Phone, 
  Globe,
  Calendar,
  Star,
  Users,
  TrendingUp,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Sponsor {
  id: string;
  name: string;
  industry: string;
  website: string;
  phone: string;
  email: string;
  tier: 'title' | 'platinum' | 'gold' | 'silver' | 'bronze';
  logo_url?: string;
  added_date: string;
  contact_person: string;
  status: 'active' | 'inactive' | 'pending';
  investment: number;
  events_count: number;
}

const SponsorsListDashboard = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Using imported supabase client

  useEffect(() => {
    loadSponsors();
  }, []);

  const loadSponsors = async () => {
    try {
      setLoading(true);
      
      // For now, we'll use mock data since we don't have a sponsors table yet
      // In the future, this would be: const { data, error } = await supabase.from('sponsors').select('*');
      
      const mockSponsors: Sponsor[] = [
        {
          id: '1',
          name: 'Google',
          industry: 'Technology',
          website: 'https://google.com',
          phone: '+1-650-253-0000',
          email: 'partnerships@google.com',
          tier: 'title',
          logo_url: 'https://logo.clearbit.com/google.com',
          added_date: '2024-10-24',
          contact_person: 'Sarah Johnson',
          status: 'active',
          investment: 150000,
          events_count: 12
        },
        {
          id: '2',
          name: 'Facebook',
          industry: 'Social Media',
          website: 'https://facebook.com',
          phone: '+1-650-543-4800',
          email: 'sponsors@facebook.com',
          tier: 'platinum',
          logo_url: 'https://logo.clearbit.com/facebook.com',
          added_date: '2024-10-16',
          contact_person: 'Mike Chen',
          status: 'active',
          investment: 100000,
          events_count: 8
        },
        {
          id: '3',
          name: 'Twitter',
          industry: 'Social Media',
          website: 'https://twitter.com',
          phone: '+1-415-222-9670',
          email: 'brand@twitter.com',
          tier: 'gold',
          logo_url: 'https://logo.clearbit.com/twitter.com',
          added_date: '2024-10-10',
          contact_person: 'Alex Rodriguez',
          status: 'active',
          investment: 75000,
          events_count: 6
        },
        {
          id: '4',
          name: 'YouTube',
          industry: 'Entertainment',
          website: 'https://youtube.com',
          phone: '+1-650-253-0000',
          email: 'creator@youtube.com',
          tier: 'gold',
          logo_url: 'https://logo.clearbit.com/youtube.com',
          added_date: '2024-10-05',
          contact_person: 'Emma Wilson',
          status: 'active',
          investment: 60000,
          events_count: 5
        },
        {
          id: '5',
          name: 'Reddit',
          industry: 'Social Media',
          website: 'https://reddit.com',
          phone: '+1-415-606-4000',
          email: 'ads@reddit.com',
          tier: 'silver',
          logo_url: 'https://logo.clearbit.com/reddit.com',
          added_date: '2024-09-28',
          contact_person: 'David Kim',
          status: 'active',
          investment: 40000,
          events_count: 3
        },
        {
          id: '6',
          name: 'LinkedIn',
          industry: 'Professional Network',
          website: 'https://linkedin.com',
          phone: '+1-650-687-3600',
          email: 'marketing@linkedin.com',
          tier: 'silver',
          logo_url: 'https://logo.clearbit.com/linkedin.com',
          added_date: '2024-09-20',
          contact_person: 'Lisa Park',
          status: 'active',
          investment: 35000,
          events_count: 4
        },
        {
          id: '7',
          name: 'Twitch',
          industry: 'Gaming & Streaming',
          website: 'https://twitch.tv',
          phone: '+1-206-343-1000',
          email: 'partnerships@twitch.tv',
          tier: 'bronze',
          logo_url: 'https://logo.clearbit.com/twitch.tv',
          added_date: '2024-09-15',
          contact_person: 'James Miller',
          status: 'active',
          investment: 25000,
          events_count: 2
        },
        {
          id: '8',
          name: 'Pinterest',
          industry: 'Visual Discovery',
          website: 'https://pinterest.com',
          phone: '+1-650-300-0000',
          email: 'business@pinterest.com',
          tier: 'bronze',
          logo_url: 'https://logo.clearbit.com/pinterest.com',
          added_date: '2024-09-10',
          contact_person: 'Maria Garcia',
          status: 'pending',
          investment: 20000,
          events_count: 1
        },
        {
          id: '9',
          name: 'Webflow',
          industry: 'Web Development',
          website: 'https://webflow.com',
          phone: '+1-415-555-0123',
          email: 'partners@webflow.com',
          tier: 'bronze',
          logo_url: 'https://logo.clearbit.com/webflow.com',
          added_date: '2024-09-05',
          contact_person: 'Tom Anderson',
          status: 'active',
          investment: 15000,
          events_count: 2
        },
        {
          id: '10',
          name: 'Spotify',
          industry: 'Music Streaming',
          website: 'https://spotify.com',
          phone: '+1-212-539-2500',
          email: 'brand@spotify.com',
          tier: 'silver',
          logo_url: 'https://logo.clearbit.com/spotify.com',
          added_date: '2024-08-30',
          contact_person: 'Anna Thompson',
          status: 'active',
          investment: 45000,
          events_count: 3
        }
      ];

      setSponsors(mockSponsors);
    } catch (error) {
      console.error('Error loading sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSponsors = sponsors.filter(sponsor => {
    const matchesSearch = sponsor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sponsor.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sponsor.contact_person.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = filterTier === 'all' || sponsor.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  const totalPages = Math.ceil(filteredSponsors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSponsors = filteredSponsors.slice(startIndex, startIndex + itemsPerPage);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'title': return 'bg-gradient-to-r from-purple-600 to-purple-800 text-white';
      case 'platinum': return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
      case 'gold': return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 'bronze': return 'bg-gradient-to-r from-orange-600 to-orange-800 text-white';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Sponsors</h1>
            <p className="text-gray-600 mt-1">Manage your sponsor partnerships and relationships</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Sponsor
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sponsors</p>
                  <p className="text-2xl font-bold text-gray-900">{sponsors.length}</p>
                </div>
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Sponsors</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {sponsors.filter(s => s.status === 'active').length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Investment</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${sponsors.reduce((sum, s) => sum + s.investment, 0).toLocaleString()}
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
                  <p className="text-sm font-medium text-gray-600">Avg. per Sponsor</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${Math.round(sponsors.reduce((sum, s) => sum + s.investment, 0) / sponsors.length).toLocaleString()}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
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
                    placeholder="Search sponsors..."
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
                  <option value="title">Title</option>
                  <option value="platinum">Platinum</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
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
          <h2 className="text-lg font-semibold text-gray-900">All Sponsors</h2>
          <p className="text-sm text-gray-600">
            {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSponsors.length)} of {filteredSponsors.length}
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
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Industry
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Investment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Added Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedSponsors.map((sponsor) => (
                      <tr key={sponsor.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {sponsor.logo_url ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={sponsor.logo_url}
                                  alt={sponsor.name}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <Building2 className="h-5 w-5 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <Link 
                                to={`/sponsors/${sponsor.id}`} 
                                className="text-sm font-medium text-gray-900 hover:text-blue-600 hover:underline cursor-pointer"
                              >
                                {sponsor.name}
                              </Link>
                              <div className="text-sm text-gray-500">{sponsor.contact_person}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {sponsor.industry}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getTierColor(sponsor.tier)}>
                            {sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <a
                              href={`mailto:${sponsor.email}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Mail className="h-4 w-4" />
                            </a>
                            <a
                              href={`tel:${sponsor.phone}`}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Phone className="h-4 w-4" />
                            </a>
                            <a
                              href={sponsor.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <Globe className="h-4 w-4" />
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${sponsor.investment.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(sponsor.added_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Link to={`/sponsors/${sponsor.id}`}>
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
            {paginatedSponsors.map((sponsor) => (
              <Card key={sponsor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {sponsor.logo_url ? (
                        <img
                          className="h-12 w-12 rounded-full object-cover"
                          src={sponsor.logo_url}
                          alt={sponsor.name}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <Link 
                          to={`/sponsors/${sponsor.id}`} 
                          className="font-semibold text-gray-900 hover:text-blue-600 hover:underline cursor-pointer"
                        >
                          <h3>{sponsor.name}</h3>
                        </Link>
                        <p className="text-sm text-gray-600">{sponsor.industry}</p>
                      </div>
                    </div>
                    <Badge className={getTierColor(sponsor.tier)}>
                      {sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {sponsor.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {sponsor.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {sponsor.contact_person}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Investment</p>
                      <p className="font-semibold text-gray-900">${sponsor.investment.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Events</p>
                      <p className="font-semibold text-gray-900">{sponsor.events_count}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(sponsor.status)}>
                      {sponsor.status.charAt(0).toUpperCase() + sponsor.status.slice(1)}
                    </Badge>
                    <div className="flex space-x-2">
                      <Link to={`/sponsors/${sponsor.id}`}>
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
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredSponsors.length)} of {filteredSponsors.length} results
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

export default SponsorsListDashboard;

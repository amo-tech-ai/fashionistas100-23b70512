import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';
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
  Trash2,
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getAllSponsors, type Sponsor } from '@/services/sponsorService';
import { useIsMobile } from '@/hooks/use-mobile';

const SponsorsListDashboard = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Using imported supabase client

  useEffect(() => {
    loadSponsors();
  }, []);

  const loadSponsors = async () => {
    try {
      setLoading(true);
      const data = await getAllSponsors();
      setSponsors(data);
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
              <ResponsiveTable
                columns={[
                  {
                    key: 'name',
                    label: 'Company',
                    mobileLabel: 'Company',
                    mobilePriority: 1,
                    render: (sponsor) => (
                      <div className="flex items-center gap-3">
                        {sponsor.logo_url ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                            src={sponsor.logo_url}
                            alt={sponsor.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <Award className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <Link 
                            to={`/dashboard/sponsors/${sponsor.id}`} 
                            className="font-medium text-foreground hover:text-primary hover:underline block truncate"
                          >
                            {sponsor.name}
                          </Link>
                          <div className="text-sm text-muted-foreground truncate">{sponsor.contact_person}</div>
                        </div>
                      </div>
                    )
                  },
                  {
                    key: 'industry',
                    label: 'Industry',
                    mobileLabel: 'Industry',
                    mobilePriority: 2,
                  },
                  {
                    key: 'tier',
                    label: 'Tier',
                    mobileLabel: 'Tier',
                    mobilePriority: 1,
                    render: (sponsor) => (
                      <Badge className={getTierColor(sponsor.tier)}>
                        {sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)}
                      </Badge>
                    )
                  },
                  {
                    key: 'contact',
                    label: 'Contact',
                    mobileLabel: 'Contact',
                    mobilePriority: 3,
                    render: (sponsor) => (
                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${sponsor.email}`}
                          className="text-primary hover:text-primary/80 min-touch"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                        <a
                          href={`tel:${sponsor.phone}`}
                          className="text-success hover:text-success/80 min-touch"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                        <a
                          href={sponsor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground min-touch"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Globe className="h-4 w-4" />
                        </a>
                      </div>
                    )
                  },
                  {
                    key: 'investment',
                    label: 'Investment',
                    mobileLabel: 'Investment',
                    mobilePriority: 1,
                    render: (sponsor) => `$${sponsor.investment.toLocaleString()}`
                  },
                  {
                    key: 'added_date',
                    label: 'Added Date',
                    mobileLabel: 'Added',
                    mobilePriority: 2,
                    render: (sponsor) => new Date(sponsor.added_date).toLocaleDateString()
                  },
                  {
                    key: 'actions',
                    label: 'Actions',
                    mobileLabel: 'Actions',
                    mobilePriority: 3,
                    render: (sponsor) => (
                      <div className="flex items-center gap-1">
                        <Link to={`/dashboard/sponsors/${sponsor.id}`}>
                          <Button variant="ghost" size="sm" className="min-touch">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="min-touch"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle edit
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="min-touch"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle more options
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  },
                ]}
                data={paginatedSponsors}
                keyExtractor={(sponsor) => sponsor.id}
                onRowClick={(sponsor) => navigate(`/dashboard/sponsors/${sponsor.id}`)}
                emptyMessage="No sponsors found"
                mobileCardRender={(sponsor) => (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {sponsor.logo_url ? (
                        <img
                          className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                          src={sponsor.logo_url}
                          alt={sponsor.name}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <Award className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{sponsor.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">{sponsor.industry}</p>
                      </div>
                      <Badge className={getTierColor(sponsor.tier)}>
                        {sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <p className="text-sm text-muted-foreground">Investment</p>
                        <p className="font-semibold text-foreground">${sponsor.investment.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${sponsor.email}`}
                          className="text-primary hover:text-primary/80 min-touch p-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Mail className="h-5 w-5" />
                        </a>
                        <a
                          href={`tel:${sponsor.phone}`}
                          className="text-success hover:text-success/80 min-touch p-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone className="h-5 w-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              />
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
                          to={`/dashboard/sponsors/${sponsor.id}`} 
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
                      <Link to={`/dashboard/sponsors/${sponsor.id}`}>
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground order-2 sm:order-1">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredSponsors.length)} of {filteredSponsors.length} results
            </div>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="min-touch"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Previous</span>
              </Button>
              
              {/* Page numbers - hidden on mobile */}
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  // Show first, last, current, and surrounding pages
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="min-w-[40px] min-touch"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              {/* Mobile: Show current page indicator */}
              <div className="sm:hidden flex items-center gap-2 px-3 py-1 bg-muted rounded-md">
                <span className="text-sm font-medium text-foreground">
                  {currentPage} / {totalPages}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="min-touch"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4 ml-1" />
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

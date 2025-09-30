import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Search,
  Bell,
  Settings,
  Grid3x3,
  List,
  MapPin,
  Calendar,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Upload,
  Image as ImageIcon,
  Bookmark,
  Share2,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type ViewType = 'grid' | 'list';

interface Designer {
  id: number;
  name: string;
  brand: string;
  category: string;
  location: string;
  experience: string;
  collections: number;
  fashionShows: number;
  revenueLinked: number;
  status: 'Active' | 'Showcased' | 'Upcoming';
  avatar: string;
  portfolioImages: string[];
  bio: string;
  philosophy: string;
  recentShows: string[];
  collaborations: string[];
  socialMedia: {
    instagram?: string;
    website?: string;
  };
}

const designers: Designer[] = [
  {
    id: 1,
    name: 'Elena Rossi',
    brand: 'Rossi Couture',
    category: 'Couture',
    location: 'Milan',
    experience: '15 years',
    collections: 12,
    fashionShows: 28,
    revenueLinked: 850000,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300',
    portfolioImages: [
      'https://images.unsplash.com/photo-1558008258-3256797b43f3?q=80&w=400',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=400',
    ],
    bio: 'Award-winning haute couture designer specializing in luxury evening wear and bridal collections.',
    philosophy: 'Elegance meets innovation - creating timeless pieces that celebrate feminine power.',
    recentShows: ['Paris Fashion Week 2029', 'Milan Fashion Week SS 2029', 'Met Gala Collection'],
    collaborations: ['Valentino', 'Dior', 'Versace'],
    socialMedia: {
      instagram: '@elenarossi_couture',
      website: 'www.elenarossicouture.com',
    },
  },
  {
    id: 2,
    name: 'David Nakamura',
    brand: 'Nakamura Street',
    category: 'Streetwear',
    location: 'Tokyo',
    experience: '8 years',
    collections: 8,
    fashionShows: 15,
    revenueLinked: 420000,
    status: 'Showcased',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300',
    portfolioImages: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400',
      'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=400',
    ],
    bio: 'Contemporary streetwear designer blending Japanese tradition with urban culture.',
    philosophy: 'Fashion as cultural expression - bridging heritage and modernity.',
    recentShows: ['Tokyo Fashion Week', 'Seoul Fashion Week', 'ComplexCon Tokyo'],
    collaborations: ['Nike', 'Uniqlo', 'A Bathing Ape'],
    socialMedia: {
      instagram: '@nakamura_street',
      website: 'www.nakamurastreet.jp',
    },
  },
  {
    id: 3,
    name: 'Amira Khan',
    brand: 'Khan RTW',
    category: 'Ready-to-Wear',
    location: 'London',
    experience: '12 years',
    collections: 15,
    fashionShows: 22,
    revenueLinked: 680000,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300',
    portfolioImages: [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=400',
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=400',
    ],
    bio: 'Sustainable ready-to-wear designer championing ethical fashion and inclusive sizing.',
    philosophy: 'Fashion for everyone - sustainable luxury that doesn\'t compromise style.',
    recentShows: ['London Fashion Week', 'Copenhagen Fashion Summit', 'Sustainable Fashion Week'],
    collaborations: ['H&M Conscious', 'Stella McCartney', 'Reformation'],
    socialMedia: {
      instagram: '@amirakhan_rtw',
      website: 'www.khanrtw.com',
    },
  },
  {
    id: 4,
    name: 'Lucas Pereira',
    brand: 'Pereira Accessories',
    category: 'Accessories',
    location: 'São Paulo',
    experience: '10 years',
    collections: 6,
    fashionShows: 12,
    revenueLinked: 320000,
    status: 'Upcoming',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300',
    portfolioImages: [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=400',
    ],
    bio: 'Luxury accessories designer specializing in handcrafted leather goods and statement jewelry.',
    philosophy: 'Details define perfection - every accessory tells a story.',
    recentShows: ['São Paulo Fashion Week', 'Miami Fashion Week', 'New York Accessories Show'],
    collaborations: ['Louis Vuitton', 'Hermès', 'Gucci'],
    socialMedia: {
      instagram: '@lucas_pereira_design',
      website: 'www.pereiraaccessories.com',
    },
  },
  {
    id: 5,
    name: 'Sofia Martinez',
    brand: 'Martinez Atelier',
    category: 'Couture',
    location: 'Madrid',
    experience: '18 years',
    collections: 20,
    fashionShows: 35,
    revenueLinked: 1200000,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=300',
    portfolioImages: [
      'https://images.unsplash.com/photo-1558008258-3256797b43f3?q=80&w=400',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=400',
    ],
    bio: 'Spanish haute couture designer known for dramatic silhouettes and theatrical runway presentations.',
    philosophy: 'Fashion as art - each piece is a masterpiece meant to inspire.',
    recentShows: ['Madrid Fashion Week', 'Paris Haute Couture Week', 'Cannes Film Festival'],
    collaborations: ['Chanel', 'Balenciaga', 'Alexander McQueen'],
    socialMedia: {
      instagram: '@sofia_martinez_atelier',
      website: 'www.martinezatelier.es',
    },
  },
  {
    id: 6,
    name: 'Kenji Tanaka',
    brand: 'Tanaka Minimalist',
    category: 'Ready-to-Wear',
    location: 'Kyoto',
    experience: '14 years',
    collections: 18,
    fashionShows: 25,
    revenueLinked: 750000,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300',
    portfolioImages: [
      'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=400',
    ],
    bio: 'Minimalist designer creating zen-inspired collections with clean lines and natural fabrics.',
    philosophy: 'Less is more - finding beauty in simplicity and functionality.',
    recentShows: ['Tokyo Fashion Week', 'Milan Fashion Week', 'New York Fashion Week'],
    collaborations: ['Muji', 'COS', 'Issey Miyake'],
    socialMedia: {
      instagram: '@kenji_tanaka_design',
      website: 'www.tanakaminimalist.jp',
    },
  },
];

export default function DesignersDashboard() {
  const [activeTab, setActiveTab] = useState<'active' | 'draft' | 'past'>('active');
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDesigner, setSelectedDesigner] = useState<Designer | null>(null);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(designers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDesigners = designers.slice(startIndex, endIndex);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Couture: 'bg-purple-100 text-purple-700',
      Streetwear: 'bg-cyan-100 text-cyan-700',
      'Ready-to-Wear': 'bg-pink-100 text-pink-700',
      Accessories: 'bg-blue-100 text-blue-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Active: 'bg-green-500 text-white',
      Showcased: 'bg-purple-500 text-white',
      Upcoming: 'bg-yellow-500 text-white',
    };
    return colors[status] || 'bg-gray-500 text-white';
  };

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {currentDesigners.map((designer) => (
        <Card
          key={designer.id}
          className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setSelectedDesigner(designer)}
        >
          <div className="relative h-64">
            <img
              src={designer.avatar}
              alt={designer.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className={getCategoryColor(designer.category)}>{designer.category}</Badge>
              <Badge className={getStatusColor(designer.status)}>{designer.status}</Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h3 className="font-semibold text-white text-lg">{designer.name}</h3>
              <p className="text-white/90 text-sm">{designer.brand}</p>
            </div>
          </div>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{designer.location}</span>
              </div>
              <span>{designer.experience}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="p-2 bg-purple-50 rounded">
                <p className="text-xs text-muted-foreground">Collections</p>
                <p className="font-bold text-purple-600">{designer.collections}</p>
              </div>
              <div className="p-2 bg-pink-50 rounded">
                <p className="text-xs text-muted-foreground">Shows</p>
                <p className="font-bold text-pink-600">{designer.fashionShows}</p>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload New Design
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-4">
      {currentDesigners.map((designer) => (
        <Card
          key={designer.id}
          className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setSelectedDesigner(designer)}
        >
          <div className="flex">
            <div className="w-48 flex-shrink-0">
              <img
                src={designer.avatar}
                alt={designer.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(designer.category)}>{designer.category}</Badge>
                  <Badge className={getStatusColor(designer.status)}>{designer.status}</Badge>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">
                    ${(designer.revenueLinked / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-muted-foreground">revenue linked</p>
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-1">{designer.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{designer.brand}</p>

              <div className="flex items-center gap-6 text-sm mb-3">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{designer.location}</span>
                </div>
                <span className="text-muted-foreground">{designer.experience}</span>
                <span className="text-muted-foreground">{designer.collections} collections</span>
                <span className="text-muted-foreground">{designer.fashionShows} shows</span>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Design
                </Button>
                <Button variant="outline" size="sm">
                  View Portfolio
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link
                  to="/dashboard/admin/overview"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Dashboard
                </Link>
                <span className="text-sm text-muted-foreground">/</span>
                <span className="text-sm text-muted-foreground">Designers</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Designers</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search designer name, brand, style" className="pl-10" />
              </div>

              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Orlando"
                  alt="Orlando Laurentius"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">Orlando Laurentius</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Designers List */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tabs and Filters */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setActiveTab('active')}
                    className={`rounded-full ${
                      activeTab === 'active'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    Active <Badge className="ml-2 bg-white/20">32</Badge>
                  </Button>
                  <Button
                    onClick={() => setActiveTab('draft')}
                    className={`rounded-full ${
                      activeTab === 'draft'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    Draft <Badge className="ml-2 bg-white/20">12</Badge>
                  </Button>
                  <Button
                    onClick={() => setActiveTab('past')}
                    className={`rounded-full ${
                      activeTab === 'past'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    Past <Badge className="ml-2 bg-white/20">18</Badge>
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="couture">Couture</SelectItem>
                      <SelectItem value="streetwear">Streetwear</SelectItem>
                      <SelectItem value="rtw">Ready-to-Wear</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="all-locations">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-locations">All Locations</SelectItem>
                      <SelectItem value="milan">Milan</SelectItem>
                      <SelectItem value="paris">Paris</SelectItem>
                      <SelectItem value="tokyo">Tokyo</SelectItem>
                      <SelectItem value="london">London</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-1 border rounded-lg p-1">
                    <Button
                      variant={viewType === 'grid' ? 'default' : 'ghost'}
                      size="icon"
                      onClick={() => setViewType('grid')}
                      className={
                        viewType === 'grid'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                          : ''
                      }
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewType === 'list' ? 'default' : 'ghost'}
                      size="icon"
                      onClick={() => setViewType('list')}
                      className={
                        viewType === 'list'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                          : ''
                      }
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Designers Grid/List */}
              {viewType === 'grid' ? <GridView /> : <ListView />}

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {itemsPerPage} out of {designers.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i + 1 ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setCurrentPage(i + 1)}
                      className={
                        currentPage === i + 1
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                          : ''
                      }
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - KPIs & Upload */}
            <div className="space-y-6">
              {/* KPI Cards */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Designer Portfolio Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Collections</p>
                    <p className="text-2xl font-bold">99</p>
                    <div className="flex items-center text-sm text-green-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+15% this year</span>
                    </div>
                  </div>

                  <div className="p-4 bg-pink-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Fashion Shows</p>
                    <p className="text-2xl font-bold">137</p>
                    <div className="flex items-center text-sm text-green-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+22% vs last year</span>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold">$4.2M</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Avg Revenue/Designer</p>
                    <p className="text-2xl font-bold">$656K</p>
                  </div>
                </CardContent>
              </Card>

              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upload Collection</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-sm font-medium mb-1">Drag & drop images here</p>
                    <p className="text-xs text-muted-foreground mb-3">
                      or click to browse files
                    </p>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-600"
                    >
                      Select Files
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Showcases</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Paris Fashion Week</p>
                      <p className="text-xs text-muted-foreground">Sept 25 - Oct 3</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-pink-600" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Milan Fashion Week</p>
                      <p className="text-xs text-muted-foreground">Sept 19 - Sept 25</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">London Fashion Week</p>
                      <p className="text-xs text-muted-foreground">Sept 15 - Sept 19</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Designer Detail Modal */}
      <Dialog open={!!selectedDesigner} onOpenChange={() => setSelectedDesigner(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedDesigner && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedDesigner.name}</DialogTitle>
                <DialogDescription>{selectedDesigner.brand}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Hero Portfolio Carousel */}
                <div className="grid grid-cols-3 gap-4">
                  {selectedDesigner.portfolioImages.map((img, idx) => (
                    <div key={idx} className="relative h-64 rounded-lg overflow-hidden group">
                      <img
                        src={img}
                        alt={`Portfolio ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* About & Stats */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4 text-purple-600" />
                      About
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{selectedDesigner.bio}</p>

                    <h3 className="font-semibold mb-2">Design Philosophy</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedDesigner.philosophy}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{selectedDesigner.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Experience:</span>
                        <span className="font-medium">{selectedDesigner.experience}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <Badge className={getCategoryColor(selectedDesigner.category)}>
                          {selectedDesigner.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Portfolio Statistics</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Collections</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {selectedDesigner.collections}
                        </p>
                      </div>
                      <div className="p-3 bg-pink-50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Fashion Shows</p>
                        <p className="text-2xl font-bold text-pink-600">
                          {selectedDesigner.fashionShows}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Revenue Linked</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ${(selectedDesigner.revenueLinked / 1000).toFixed(0)}K
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Shows */}
                <div>
                  <h3 className="font-semibold mb-3">Recent Fashion Shows</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedDesigner.recentShows.map((show, idx) => (
                      <div key={idx} className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                        <p className="text-sm font-medium">{show}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collaborations */}
                <div>
                  <h3 className="font-semibold mb-3">Brand Collaborations</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDesigner.collaborations.map((collab, idx) => (
                      <Badge key={idx} variant="outline" className="text-sm">
                        {collab}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Social Media */}
                {selectedDesigner.socialMedia && (
                  <div>
                    <h3 className="font-semibold mb-3">Connect</h3>
                    <div className="flex gap-3">
                      {selectedDesigner.socialMedia.instagram && (
                        <Button variant="outline" size="sm">
                          Instagram: {selectedDesigner.socialMedia.instagram}
                        </Button>
                      )}
                      {selectedDesigner.socialMedia.website && (
                        <Button variant="outline" size="sm">
                          Website
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload to Collection
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Full Portfolio
                  </Button>
                  <Button variant="outline" size="icon">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

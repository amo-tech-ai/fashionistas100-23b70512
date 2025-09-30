import React, { useState } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  Eye,
  Bookmark,
  Share2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type ViewType = 'grid' | 'list';

interface Model {
  id: number;
  name: string;
  agency: string;
  category: string;
  location: string;
  age: number;
  height: string;
  bust: string;
  waist: string;
  hips: string;
  experience: string;
  availability: string;
  bookedPercentage: number;
  nextAvailable: string;
  pricePerHour: number;
  pricePerShow: number;
  status: 'Available' | 'Booked' | 'On Hold';
  image: string;
  portfolioImages: string[];
  recentBookings: string[];
  bio: string;
}

const models: Model[] = [
  {
    id: 1,
    name: 'Sophia Martinez',
    agency: 'Elite Model Management',
    category: 'Runway',
    location: 'Paris',
    age: 24,
    height: '5\'10"',
    bust: '34"',
    waist: '24"',
    hips: '36"',
    experience: '6 years',
    availability: 'Available',
    bookedPercentage: 75,
    nextAvailable: 'Aug 15, 2029',
    pricePerHour: 400,
    pricePerShow: 500,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=300',
    portfolioImages: [
      'https://images.unsplash.com/photo-1558008258-3256797b43f3?q=80&w=400',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400',
    ],
    recentBookings: ['Paris Fashion Week 2029', 'Chanel Campaign'],
    bio: 'International runway model specializing in haute couture and luxury brands.',
  },
  {
    id: 2,
    name: 'Liam Chen',
    agency: 'Next Models',
    category: 'Editorial',
    location: 'New York',
    age: 26,
    height: '6\'1"',
    bust: '38"',
    waist: '30"',
    hips: '38"',
    experience: '8 years',
    availability: 'Booked',
    bookedPercentage: 90,
    nextAvailable: 'Sept 1, 2029',
    pricePerHour: 300,
    pricePerShow: 450,
    status: 'Booked',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300',
    portfolioImages: [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=400',
    ],
    recentBookings: ['Vogue Editorial', 'Ralph Lauren Campaign'],
    bio: 'Versatile editorial model with extensive experience in high fashion photography.',
  },
  {
    id: 3,
    name: 'Aisha Rahman',
    agency: 'Independent',
    category: 'Couture',
    location: 'Milan',
    age: 22,
    height: '5\'9"',
    bust: '32"',
    waist: '23"',
    hips: '34"',
    experience: '4 years',
    availability: 'Available',
    bookedPercentage: 65,
    nextAvailable: 'Aug 20, 2029',
    pricePerHour: 600,
    pricePerShow: 800,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300',
    portfolioImages: [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=400',
    ],
    recentBookings: ['Milan Fashion Week', 'Valentino Show'],
    bio: 'Haute couture specialist known for elegant runway presence.',
  },
  {
    id: 4,
    name: 'Lucas Rossi',
    agency: 'Ford Models',
    category: 'Commercial',
    location: 'São Paulo',
    age: 28,
    height: '6\'0"',
    bust: '40"',
    waist: '32"',
    hips: '38"',
    experience: '10 years',
    availability: 'On Hold',
    bookedPercentage: 80,
    nextAvailable: 'Aug 25, 2029',
    pricePerHour: 200,
    pricePerShow: 350,
    status: 'On Hold',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300',
    portfolioImages: [
      'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=400',
    ],
    recentBookings: ['Nike Campaign', 'GQ Brazil'],
    bio: 'Commercial and fitness model with strong presence in athletic wear.',
  },
  {
    id: 5,
    name: 'Hana Kim',
    agency: 'IMG Models',
    category: 'Runway',
    location: 'Seoul',
    age: 21,
    height: '5\'11"',
    bust: '33"',
    waist: '24"',
    hips: '35"',
    experience: '3 years',
    availability: 'Available',
    bookedPercentage: 70,
    nextAvailable: 'Aug 18, 2029',
    pricePerHour: 500,
    pricePerShow: 600,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300',
    portfolioImages: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400',
    ],
    recentBookings: ['Seoul Fashion Week', 'Dior Korea'],
    bio: 'Rising star in Asian fashion scene with international runway experience.',
  },
  {
    id: 6,
    name: 'Marcus Johnson',
    agency: 'Wilhelmina Models',
    category: 'Editorial',
    location: 'London',
    age: 27,
    height: '6\'2"',
    bust: '42"',
    waist: '32"',
    hips: '38"',
    experience: '7 years',
    availability: 'Available',
    bookedPercentage: 85,
    nextAvailable: 'Aug 22, 2029',
    pricePerHour: 350,
    pricePerShow: 500,
    status: 'Available',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300',
    portfolioImages: [
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=400',
    ],
    recentBookings: ['British GQ', 'Burberry Campaign'],
    bio: 'Editorial and commercial model with strong presence in luxury menswear.',
  },
];

export default function ModelsDashboard() {
  const [activeTab, setActiveTab] = useState<'active' | 'draft' | 'past'>('active');
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(models.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentModels = models.slice(startIndex, endIndex);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Runway: 'bg-purple-100 text-purple-700',
      Editorial: 'bg-pink-100 text-pink-700',
      Couture: 'bg-blue-100 text-blue-700',
      Commercial: 'bg-cyan-100 text-cyan-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Available: 'bg-green-500 text-white',
      Booked: 'bg-red-500 text-white',
      'On Hold': 'bg-yellow-500 text-white',
    };
    return colors[status] || 'bg-gray-500 text-white';
  };

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {currentModels.map((model) => (
        <Card
          key={model.id}
          className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setSelectedModel(model)}
        >
          <div className="relative h-64">
            <img src={model.image} alt={model.name} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className={getCategoryColor(model.category)}>{model.category}</Badge>
              <Badge className={getStatusColor(model.status)}>{model.status}</Badge>
            </div>
            <div className="absolute top-3 right-3 flex gap-2">
              <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardContent className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg mb-1">{model.name}</h3>
              <p className="text-sm text-muted-foreground">{model.agency}</p>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{model.location}</span>
              </div>
              <span>Age {model.age}</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{model.bookedPercentage}% Booked</span>
                <span className="font-medium text-purple-600">
                  ${model.pricePerShow}/show
                </span>
              </div>
              <Progress value={model.bookedPercentage} className="h-2" />
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Next available: {model.nextAvailable}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-4">
      {currentModels.map((model) => (
        <Card
          key={model.id}
          className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setSelectedModel(model)}
        >
          <div className="flex">
            <div className="w-48 flex-shrink-0">
              <img src={model.image} alt={model.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(model.category)}>{model.category}</Badge>
                  <Badge className={getStatusColor(model.status)}>{model.status}</Badge>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">${model.pricePerShow}</p>
                  <p className="text-xs text-muted-foreground">per show</p>
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-1">{model.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{model.agency}</p>

              <div className="flex items-center gap-6 text-sm mb-3">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{model.location}</span>
                </div>
                <span className="text-muted-foreground">Age {model.age}</span>
                <span className="text-muted-foreground">{model.height}</span>
                <span className="text-muted-foreground">{model.experience} experience</span>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex-1 max-w-md space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{model.bookedPercentage}% Booked</span>
                  </div>
                  <Progress value={model.bookedPercentage} className="h-2" />
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Available: {model.nextAvailable}</span>
                </div>
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
                <span className="text-sm text-muted-foreground">Models</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground">Models</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search model name, agency, etc" className="pl-10" />
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
            {/* Left Column - Models List */}
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
                    Active <Badge className="ml-2 bg-white/20">48</Badge>
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
                    Past <Badge className="ml-2 bg-white/20">20</Badge>
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="runway">Runway</SelectItem>
                      <SelectItem value="editorial">Editorial</SelectItem>
                      <SelectItem value="couture">Couture</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue="all-locations">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-locations">All Locations</SelectItem>
                      <SelectItem value="paris">Paris</SelectItem>
                      <SelectItem value="new-york">New York</SelectItem>
                      <SelectItem value="milan">Milan</SelectItem>
                      <SelectItem value="london">London</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-1 border rounded-lg p-1">
                    <Button
                      variant={viewType === 'grid' ? 'default' : 'ghost'}
                      size="icon"
                      onClick={() => setViewType('grid')}
                      className={viewType === 'grid' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewType === 'list' ? 'default' : 'ghost'}
                      size="icon"
                      onClick={() => setViewType('list')}
                      className={viewType === 'list' ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Models Grid/List */}
              {viewType === 'grid' ? <GridView /> : <ListView />}

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {itemsPerPage} out of {models.length}
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

            {/* Right Column - KPIs & Info */}
            <div className="space-y-6">
              {/* Financial KPIs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Model Portfolio Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Active Models</p>
                    <p className="text-2xl font-bold">48</p>
                    <div className="flex items-center text-sm text-green-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+12% this month</span>
                    </div>
                  </div>

                  <div className="p-4 bg-pink-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Bookings</p>
                    <p className="text-2xl font-bold">156</p>
                    <div className="flex items-center text-sm text-green-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+8% vs last month</span>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Revenue Generated</p>
                    <p className="text-2xl font-bold">$78,450</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Avg Booking Fee</p>
                    <p className="text-2xl font-bold">$503</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Available This Week
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Top Rated Models
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Recently Added
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Most Booked
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Bookings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Paris Fashion Week</p>
                      <p className="text-xs text-muted-foreground">Aug 15 - Aug 20</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-pink-600" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Vogue Editorial Shoot</p>
                      <p className="text-xs text-muted-foreground">Aug 18</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Milan Couture Show</p>
                      <p className="text-xs text-muted-foreground">Aug 22</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Model Detail Modal */}
      <Dialog open={!!selectedModel} onOpenChange={() => setSelectedModel(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedModel && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedModel.name}</DialogTitle>
                <DialogDescription>{selectedModel.agency}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Hero Image */}
                <div className="relative h-96 rounded-lg overflow-hidden">
                  <img
                    src={selectedModel.image}
                    alt={selectedModel.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge className={getCategoryColor(selectedModel.category)}>
                      {selectedModel.category}
                    </Badge>
                    <Badge className={getStatusColor(selectedModel.status)}>
                      {selectedModel.status}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button size="icon" variant="secondary" className="rounded-full">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="rounded-full">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Bio & Measurements */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">About</h3>
                    <p className="text-sm text-muted-foreground mb-4">{selectedModel.bio}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{selectedModel.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Experience:</span>
                        <span className="font-medium">{selectedModel.experience}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Age:</span>
                        <span className="font-medium">{selectedModel.age}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Measurements</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Height:</span>
                        <span className="font-medium">{selectedModel.height}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bust:</span>
                        <span className="font-medium">{selectedModel.bust}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Waist:</span>
                        <span className="font-medium">{selectedModel.waist}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hips:</span>
                        <span className="font-medium">{selectedModel.hips}</span>
                      </div>
                    </div>

                    <h3 className="font-semibold mt-4 mb-2">Rates</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Per Hour:</span>
                        <span className="font-bold text-purple-600">
                          ${selectedModel.pricePerHour}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Per Show:</span>
                        <span className="font-bold text-purple-600">
                          ${selectedModel.pricePerShow}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Portfolio Gallery */}
                <div>
                  <h3 className="font-semibold mb-3">Portfolio</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedModel.portfolioImages.map((img, idx) => (
                      <div key={idx} className="relative h-48 rounded-lg overflow-hidden">
                        <img src={img} alt={`Portfolio ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Bookings */}
                <div>
                  <h3 className="font-semibold mb-3">Recent Bookings</h3>
                  <div className="space-y-2">
                    {selectedModel.recentBookings.map((booking, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">{booking}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
                    Book Model
                  </Button>
                  <Button variant="outline" className="flex-1">
                    View Full Portfolio
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

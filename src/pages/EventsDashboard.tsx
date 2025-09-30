import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import DashboardSidebar from '@/components/DashboardSidebar';
import Footer from '@/components/Footer';
import {
  Search,
  Bell,
  Settings,
  ChevronDown,
  Grid3x3,
  List,
  MapPin,
  Calendar,
  Ticket,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

type ViewType = 'grid' | 'list';

const EventsDashboard = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'draft' | 'past'>('active');
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  const fashionShows = [
    {
      id: 1,
      title: 'Paris Haute Couture Week',
      description: 'Experience the pinnacle of luxury fashion at Grand Palais. Witness exclusive designer collections.',
      category: 'Couture',
      venue: 'Grand Palais, Paris',
      date: 'July 2, 2029',
      time: '7:00 PM',
      ticketsSold: 80,
      ticketsLeft: 50,
      price: 150,
      status: 'Active',
      image: 'bg-gradient-to-br from-pink-400 to-purple-500'
    },
    {
      id: 2,
      title: 'Milan Fashion Week - Spring/Summer',
      description: 'Join us for the most prestigious fashion event in Milan showcasing Spring/Summer collections.',
      category: 'Fashion Week',
      venue: 'Piazza Duomo, Milan',
      date: 'Sept 15, 2029',
      time: '6:00 PM',
      ticketsSold: 90,
      ticketsLeft: 20,
      price: 200,
      status: 'Active',
      image: 'bg-gradient-to-br from-blue-400 to-indigo-500'
    },
    {
      id: 3,
      title: 'Runway Revolution 2029',
      description: 'Celebrate emerging talent at Runway Revolution 2029. Discover the next generation of fashion icons.',
      category: 'Runway',
      venue: 'Vogue Hall, New York, NY',
      date: 'May 1, 2029',
      time: '8:00 PM',
      ticketsSold: 100,
      ticketsLeft: 0,
      price: 120,
      status: 'Active',
      image: 'bg-gradient-to-br from-pink-300 to-pink-400'
    },
    {
      id: 4,
      title: 'Tokyo Streetwear Expo',
      description: 'Explore cutting-edge streetwear fashion from top Japanese and international designers.',
      category: 'Streetwear',
      venue: 'Shibuya Arena, Tokyo',
      date: 'Oct 10, 2029',
      time: '5:00 PM',
      ticketsSold: 70,
      ticketsLeft: 75,
      price: 90,
      status: 'Active',
      image: 'bg-gradient-to-br from-cyan-400 to-blue-500'
    },
    {
      id: 5,
      title: 'London Emerging Designers Showcase',
      description: 'Support up-and-coming designers at this exclusive London showcase event.',
      category: 'Runway',
      venue: 'Royal Albert Hall, London',
      date: 'Nov 5, 2029',
      time: '8:00 PM',
      ticketsSold: 65,
      ticketsLeft: 100,
      price: 80,
      status: 'Active',
      image: 'bg-gradient-to-br from-purple-400 to-pink-400'
    },
    {
      id: 6,
      title: 'Sustainable Fashion Showcase - Medellín',
      description: 'Discover eco-friendly fashion and sustainable design practices from Latin American designers.',
      category: 'Fashion Week',
      venue: 'Plaza Mayor, Medellín',
      date: 'Aug 22, 2029',
      time: '6:00 PM',
      ticketsSold: 55,
      ticketsLeft: 150,
      price: 60,
      status: 'Active',
      image: 'bg-gradient-to-br from-green-400 to-emerald-500'
    },
    {
      id: 7,
      title: 'Dubai Luxury Couture Gala',
      description: 'An opulent evening of haute couture featuring Middle Eastern and international designers.',
      category: 'Couture',
      venue: 'Armani Hotel, Dubai',
      date: 'Dec 12, 2029',
      time: '7:00 PM',
      ticketsSold: 75,
      ticketsLeft: 60,
      price: 250,
      status: 'Active',
      image: 'bg-gradient-to-br from-amber-400 to-orange-500'
    },
    {
      id: 8,
      title: 'Seoul K-Fashion Week',
      description: 'Experience the vibrant world of Korean fashion with innovative designs and K-pop influences.',
      category: 'Fashion Week',
      venue: 'Dongdaemun Design Plaza, Seoul',
      date: 'Oct 18, 2029',
      time: '6:00 PM',
      ticketsSold: 85,
      ticketsLeft: 30,
      price: 140,
      status: 'Active',
      image: 'bg-gradient-to-br from-fuchsia-400 to-purple-500'
    }
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Couture': 'bg-purple-100 text-purple-700',
      'Fashion Week': 'bg-pink-100 text-pink-700',
      'Runway': 'bg-blue-100 text-blue-700',
      'Streetwear': 'bg-cyan-100 text-cyan-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {fashionShows.slice(0, itemsPerPage).map((show) => (
        <Card key={show.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className={`relative h-48 ${show.image} flex items-center justify-center`}>
            <Badge className="absolute top-3 left-3 bg-white/90 text-gray-700">
              {show.category}
            </Badge>
            <Badge className="absolute top-3 right-3 bg-pink-500 text-white">
              {show.status}
            </Badge>
          </div>
          <CardContent className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-base mb-1">{show.title}</h3>
              <div className="flex items-start gap-1 text-xs text-muted-foreground mb-1">
                <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>{show.venue}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span>{show.date} – {show.time}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{show.ticketsSold}% Ticket Sold</span>
                <span className="font-medium text-purple-600">${show.price}</span>
              </div>
              <Progress value={show.ticketsSold} className="h-2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-4">
      {fashionShows.slice(0, itemsPerPage).map((show) => (
        <Card key={show.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="flex">
            <div className={`w-48 flex-shrink-0 ${show.image}`}></div>
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(show.category)}>
                    {show.category}
                  </Badge>
                  <Badge className="bg-pink-100 text-pink-700">
                    {show.status}
                  </Badge>
                </div>
                <span className="text-2xl font-bold text-purple-600">${show.price}</span>
              </div>
              
              <h3 className="font-semibold text-lg mb-2">{show.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{show.description}</p>
              
              <div className="flex items-center gap-6 text-sm mb-3">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{show.venue}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{show.date} – {show.time}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex-1 max-w-md space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{show.ticketsSold}% Ticket Sold</span>
                  </div>
                  <Progress value={show.ticketsSold} className="h-2" />
                </div>
                <div className="flex items-center gap-2">
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{show.ticketsLeft}</span>
                  <span className="text-sm text-muted-foreground">Tickets Left</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            {/* Left - Breadcrumbs and Title */}
            <div>
              <div className="text-xs text-muted-foreground mb-1">Dashboard / Events</div>
              <h1 className="text-xl font-semibold text-foreground">Events</h1>
            </div>

            {/* Right - Search, Notifications, Settings, Profile */}
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-purple-600 text-white text-xs">
                  3
                </Badge>
              </Button>

              {/* Settings Icon */}
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>

              {/* Profile */}
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/api/placeholder/36/36" />
                  <AvatarFallback className="bg-purple-600 text-white">OL</AvatarFallback>
                </Avatar>
                <div className="hidden lg:block">
                  <div className="text-sm font-medium">Orlando Laurentius</div>
                  <div className="text-xs text-muted-foreground">Admin</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {/* Tabs and Filters */}
          <div className="flex items-center justify-between">
            {/* Tabs */}
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
                Draft <Badge className="ml-2 bg-white/20">22</Badge>
              </Button>
              <Button
                onClick={() => setActiveTab('past')}
                className={`rounded-full ${
                  activeTab === 'past'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Past <Badge className="ml-2 bg-white/20">32</Badge>
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search event, location, etc"
                  className="pl-10 w-80 bg-muted/50"
                />
              </div>

              {/* Category Filter */}
              <Button variant="outline" className="bg-blue-900 text-white hover:bg-blue-800">
                All Category
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>

              {/* Date Filter */}
              <Button variant="outline">
                This Month
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>

              {/* View Toggle */}
              <div className="flex items-center gap-1 border rounded-md">
                <Button
                  variant={viewType === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewType('grid')}
                  className={viewType === 'grid' ? 'bg-blue-900 hover:bg-blue-800' : ''}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewType === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewType('list')}
                  className={viewType === 'list' ? 'bg-blue-900 hover:bg-blue-800' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Events Display */}
          {viewType === 'grid' ? <GridView /> : <ListView />}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Showing</span>
              <select 
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="border rounded px-2 py-1 bg-background"
              >
                <option value={6}>6</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
              <span>out of 48</span>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button 
                variant={currentPage === 1 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(1)}
                className={currentPage === 1 ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
              >
                1
              </Button>
              <Button 
                variant={currentPage === 2 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(2)}
                className={currentPage === 2 ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
              >
                2
              </Button>
              <Button 
                variant={currentPage === 3 ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(3)}
                className={currentPage === 3 ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
              >
                3
              </Button>
              
              <span className="px-2">...</span>
              
              <Button variant="outline" size="sm">8</Button>
              
              <Button variant="outline" size="icon" className="bg-blue-900 text-white hover:bg-blue-800">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default EventsDashboard;